"""Bundle the whole game into one self-contained HTML file that runs from file:// (double-click, no server).

    py -3 tools/bundle.py            -> dist/index.html

What it does:
  * concatenates every ES module under src/ (in dependency order) into ONE inline module script. Each module
    becomes an IIFE that returns its exports; relative imports become destructuring reads of that registry. The
    only syntax this needs from the sources is `import ... from './x.js'`, `export function|class|const|let|var` and
    a local export list `export { a, b as c };` on a line of its own (anything else with `export` stops the build).
  * embeds three.js and the two addons the game uses as data: URLs in the import map (downloaded once from
    jsDelivr into tools/vendor/), so the file needs no network at all;
  * inlines the stylesheet and the OpenStreetMap GeoJSON (read by loadGeoJSON from a <script type="application/json">).
"""
import base64, json, os, posixpath, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
VENDOR = os.path.join(ROOT, 'tools', 'vendor')
OUT = os.path.join(ROOT, 'dist', 'index.html')
THREE_VER = '0.170.0'
EXTERNALS = {   # bare specifier -> CDN url (cached in tools/vendor)
    'three': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/build/three.module.js',
    'three/addons/utils/BufferGeometryUtils.js': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/utils/BufferGeometryUtils.js',
    'three/addons/lights/RectAreaLightUniformsLib.js': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/lights/RectAreaLightUniformsLib.js',
    'three/addons/lights/RectAreaLightTexturesLib.js': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/lights/RectAreaLightTexturesLib.js',   # imported relatively by the uniforms lib
}
# photo mode's depth of field: the post-processing chain and everything it imports
for _f in ['postprocessing/EffectComposer.js', 'postprocessing/Pass.js', 'postprocessing/ShaderPass.js', 'postprocessing/MaskPass.js', 'postprocessing/RenderPass.js',
           'postprocessing/BokehPass.js', 'postprocessing/OutputPass.js', 'shaders/CopyShader.js', 'shaders/BokehShader.js', 'shaders/OutputShader.js']:
    EXTERNALS['three/addons/' + _f] = f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/{_f}'
RELATIVE_RE = re.compile(r'''from\s+['"](\.\.?/[\w./-]+\.js)['"]''')

IMPORT_RE = re.compile(r'^import\s+(.+?)\s+from\s+[\'"]([^\'"]+)[\'"];?\s*$', re.M)
EXPORT_RE = re.compile(r'^export\s+((?:async\s+)?function\*?|class|const|let|var)\s+([A-Za-z_$][\w$]*)', re.M)
EXPORT_LIST_RE = re.compile(r'^export\s*\{([^}]*)\}\s*;?[ \t]*$', re.M)   # export { a, b as c };
EXPORT_ANY_RE = re.compile(r'^\s*export\b', re.M)


def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def vendor(spec):
    os.makedirs(VENDOR, exist_ok=True)
    name = spec.replace('/', '_') + ('' if spec.endswith('.js') else '.js')
    path = os.path.join(VENDOR, name)
    if not os.path.exists(path):
        print('downloading', EXTERNALS[spec])
        urllib.request.urlretrieve(EXTERNALS[spec], path)
    js = read(path)
    # a data: URL module cannot resolve relative imports: point them at bare specifiers that the import map knows
    base = spec.rsplit('/', 1)[0] + '/' if '/' in spec else ''
    def bare(m):
        target = posixpath.normpath(base + m.group(1)).replace('three/addons/../', 'three/addons/')   # ('./x.js' and '../dir/x.js')
        if target not in EXTERNALS:
            sys.exit(f'{spec} imports {target}: add it to EXTERNALS')
        return f"from '{target}'"
    return RELATIVE_RE.sub(bare, js)


def data_url(js):
    return 'data:text/javascript;base64,' + base64.b64encode(js.encode('utf-8')).decode('ascii')


modules = {}      # rel path -> { code, imports:[(spec, clause)], exports:[names], deps:[rel paths] }
order = []


def key(p):
    return os.path.relpath(p, ROOT).replace('\\', '/')


def load(path):
    k = key(path)
    if k in modules:
        return
    src = read(path)
    imports, deps = [], []
    for m in IMPORT_RE.finditer(src):
        clause, spec = m.group(1), m.group(2)
        if spec.startswith('.'):
            dep = os.path.normpath(os.path.join(os.path.dirname(path), spec))
            deps.append(key(dep)); imports.append((key(dep), clause))
        else:
            if spec not in EXTERNALS:
                sys.exit(f'unknown external import {spec} in {k}')
            imports.append((spec, clause))
    exports = [m.group(2) for m in EXPORT_RE.finditer(src)]
    for m in EXPORT_LIST_RE.finditer(src):   # (local name, exported name) -> 'exported: local' in the module's return
        for item in filter(None, (s.strip() for s in m.group(1).split(','))):
            local, _, name = item.partition(' as ')
            local, name = local.strip(), (name or local).strip()
            exports.append(name if name == local else f'{name}: {local}')
    # any other form of export would be left in the bundle as a syntax error that stops the whole game: refuse to build
    rest = EXPORT_LIST_RE.sub('', EXPORT_RE.sub('', src))
    for m in EXPORT_ANY_RE.finditer(rest):
        line = rest[m.start():rest.find('\n', m.start())].strip()
        sys.exit(f'{k}: unsupported export syntax for the bundle: {line[:120]}')
    modules[k] = {'src': src, 'imports': imports, 'exports': exports, 'deps': deps}
    for d in deps:
        load(os.path.join(ROOT, d))
    order.append(k)   # post-order: dependencies first


def transform(k):
    m = modules[k]
    body = IMPORT_RE.sub('', m['src'])
    body = EXPORT_RE.sub(lambda mm: f'{mm.group(1)} {mm.group(2)}', body)
    body = EXPORT_LIST_RE.sub('', body)
    lines = []
    for dep, clause in m['imports']:
        if dep in EXTERNALS:
            continue   # hoisted to the top of the bundle
        clause = clause.strip()
        if clause.startswith('* as '):
            lines.append(f"const {clause[5:].strip()} = __m['{dep}'];")
        else:
            inner = clause.strip('{} ').replace(' as ', ': ')
            lines.append(f"const {{ {inner} }} = __m['{dep}'];")
    ret = ', '.join(m['exports'])
    return f"// ---- {k}\n__m['{k}'] = (() => {{\n" + '\n'.join(lines) + '\n' + body + f"\nreturn {{ {ret} }};\n}})();\n"


def main():
    # `--artifact` builds dist/artifact.html for publishing as a claude.ai Artifact: the page skeleton (doctype, html,
    # head, body, viewport meta) is left to the Artifact host, the title comes first, and three.js is loaded from
    # jsDelivr (an allowed script host there) instead of data: URLs, which its content-security policy may refuse.
    artifact = '--artifact' in sys.argv
    load(os.path.join(SRC, 'main.js'))
    externals = []
    for k in order:
        for spec, clause in modules[k]['imports']:
            if spec in EXTERNALS:
                line = f"import {clause.strip()} from '{spec}';"
                if line not in externals:
                    externals.append(line)
    bundle = '\n'.join(externals) + '\nconst __m = {};\n' + '\n'.join(transform(k) for k in order)
    if '</script' in bundle:
        sys.exit('bundle contains </script')

    if artifact:
        importmap = {'imports': {'three': EXTERNALS['three'], 'three/addons/': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/'}}
    else:
        importmap = {'imports': {spec: data_url(vendor(spec)) for spec in EXTERNALS}}
    html = read(os.path.join(ROOT, 'index.html'))
    css = read(os.path.join(SRC, 'ui', 'style.css'))
    # every track's GeoJSON is embedded as <script id="geojson-<name>" type="application/json">
    data_dir = os.path.join(ROOT, 'data')
    geo = '\n'.join(f'<script id="geojson-{os.path.splitext(fn)[0]}" type="application/json">' + read(os.path.join(data_dir, fn)).replace('</', '<\\/') + '</script>'
                    for fn in sorted(os.listdir(data_dir)) if fn.endswith('.geojson'))
    # the recorded sounds (assets/audio/*.mp3) as base64 in <script id="audio-<name>" type="text/plain"> (Audio.sample)
    adir = os.path.join(ROOT, 'assets', 'audio')
    if os.path.isdir(adir) and not artifact:   # (the Artifact: published as files beside the page, too big to inline)
        geo += '\n' + '\n'.join(f'<script id="audio-{os.path.splitext(fn)[0]}" type="text/plain">' + base64.b64encode(open(os.path.join(adir, fn), 'rb').read()).decode('ascii') + '</script>'
                                for fn in sorted(os.listdir(adir)) if fn.endswith('.mp3'))
    html = re.sub(r'<link rel="stylesheet" href="src/ui/style.css">', lambda _: f'<style>\n{css}\n</style>', html)
    html = re.sub(r'<script type="importmap">.*?</script>', lambda _: '<script type="importmap">\n' + json.dumps(importmap) + '\n</script>', html, flags=re.S)
    html = html.replace('<script type="module" src="src/main.js"></script>',
                        f'{geo}\n<script type="module">\n{bundle}\n</script>')
    out = OUT
    if artifact:
        out = os.path.join(ROOT, 'dist', 'artifact.html')
    if '--out' in sys.argv:   # (tools/splice_artifact.py: a build to compare against, not the shipped file)
        out = os.path.abspath(sys.argv[sys.argv.index('--out') + 1])
        head = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
        body = re.search(r'<body[^>]*>(.*?)</body>', html, re.S).group(1)
        head = re.sub(r'<title>.*?</title>|<meta name="viewport"[^>]*>', '', head, flags=re.S)   # keep the charset meta: the file holds UTF-8 text
        html = '<meta charset="utf-8">\n<title>F1 Simulator</title>\n' + head.replace('<meta charset="utf-8">', '').strip() + '\n' + body.strip() + '\n'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'wrote {out}: {os.path.getsize(out) / 1e6:.2f} MB, {len(order)} modules: ' + ', '.join(order))


if __name__ == '__main__':
    main()
