"""Carry source changes into dist/artifact.html when the published Artifact has moved on from src/ (it was patched in
place: the pool club's Version 93 lives there and not in src/). A plain `bundle.py --artifact` would throw those away.

    py -3 tools/splice_artifact.py <base commit>

What it does:
  * builds the bundle of src/ as it was at <base commit> and as it is now (bundle.py --artifact --out, in a temp dir);
  * for every module that changed between the two: if the Artifact's copy of it is still exactly the base build's,
    it is replaced by the new build's; if the Artifact's copy has its own changes, the source change is merged into it
    (git merge-file, three-way) - and the script stops on a conflict;
  * a module new since the base is inserted where the new build has it (before the first module after it that the
    Artifact has);
  * GeoJSON data scripts (<script id="geojson-*">) new since the base are added; changed ones replaced;
  * the page's own markup (index.html's body: the menus) is patched the same way.
"""
import os, re, subprocess, sys, tempfile, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, 'dist', 'artifact.html')
MOD_RE = re.compile(r"\n// ---- (src/[^\n]+)\n")


def modules(text):
    parts = MOD_RE.split(text)
    head, mods, order = parts[0], {}, []
    for i in range(1, len(parts), 2):
        mods[parts[i]] = '\n// ---- ' + parts[i] + '\n' + parts[i + 1]
        order.append(parts[i])
    return head, mods, order


def build(tree, out):
    subprocess.run([sys.executable, os.path.join(tree, 'tools', 'bundle.py'), '--artifact', '--out', out], check=True, cwd=tree, stdout=subprocess.DEVNULL)
    return open(out, encoding='utf-8').read()


def patch_text(old, new, target, label):
    """the old -> new change merged into target, which has changes of its own (a three-way merge: a change made on
    both sides alike - a fix ported back to src/ - merges cleanly)"""
    with tempfile.TemporaryDirectory() as d:
        a, b, t = (os.path.join(d, x) for x in ('base', 'new', 'artifact'))
        for p, s in ((a, old), (b, new), (t, target)):
            open(p, 'w', encoding='utf-8').write(s)
        r = subprocess.run(['git', 'merge-file', '-p', t, a, b], capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit(f'{label}: {r.returncode} conflict(s) merging the source change into the Artifact\'s copy')
        return r.stdout


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    base = sys.argv[1]
    tmp = tempfile.mkdtemp()
    try:
        # the base tree (src, index.html, data, the bundler) from git
        bt = os.path.join(tmp, 'base'); os.makedirs(bt)
        tar = subprocess.run(['git', 'archive', base, 'src', 'index.html', 'data', 'tools/bundle.py'], cwd=ROOT, capture_output=True, check=True).stdout
        subprocess.run(['tar', '-x', '-C', bt], input=tar, check=True)
        shutil.copy(os.path.join(ROOT, 'tools', 'bundle.py'), os.path.join(bt, 'tools', 'bundle.py'))   # (the same bundler both times)
        old = build(bt, os.path.join(tmp, 'old.html'))
        new = build(ROOT, os.path.join(tmp, 'new.html'))
    finally:
        pass
    art = open(ART, encoding='utf-8').read()
    oh, om, _ = modules(old)
    nh, nm, norder = modules(new)
    ah, am, aorder = modules(art)
    report = []
    for k in norder:
        if k in om and om[k] == nm[k]:
            continue
        if k not in om:   # new module
            if k in am:
                continue
            after = norder[norder.index(k) + 1:]
            nxt = next((x for x in after if x in am), None)
            idx = aorder.index(nxt) if nxt else len(aorder)
            aorder.insert(idx, k); am[k] = nm[k]; report.append(f'+ {k}')
        elif am.get(k) == om[k]:
            am[k] = nm[k]; report.append(f'= {k}')
        else:
            am[k] = patch_text(om[k], nm[k], am[k], k); report.append(f'~ {k} (patched onto the Artifact\'s own version)')
    # the page around the modules: GeoJSON scripts and the markup (head = everything before the first module)
    geo_re = re.compile(r'<script id="geojson-([a-z0-9]+)" type="application/json">.*?</script>', re.S)
    ogeo = {m.group(1): m.group(0) for m in geo_re.finditer(oh)}
    for m in geo_re.finditer(nh):
        name, block = m.group(1), m.group(0)
        if ogeo.get(name) == block:
            continue
        cur = next((x for x in geo_re.finditer(ah) if x.group(1) == name), None)
        if cur:
            ah = ah.replace(cur.group(0), block); report.append(f'= geojson-{name}')
        else:
            last = list(geo_re.finditer(ah))[-1]
            ah = ah[:last.end()] + '\n' + block + ah[last.end():]; report.append(f'+ geojson-{name}')
    strip = lambda h: geo_re.sub('', h)
    if strip(oh) != strip(nh):
        geos = {m.group(1): m.group(0) for m in geo_re.finditer(ah)}
        body = patch_text(strip(oh), strip(nh), strip(ah), 'the page markup')
        # (put the data back where the stripped copy had nothing: right before the module script)
        first = '<script type="module">'
        ah = body.replace(first, '\n'.join(geos.values()) + '\n' + first, 1) if first in body else body
        report.append('~ page markup')
    # the module script's tail (after the last module) comes from the Artifact
    out = ah + ''.join(am[k] for k in aorder)
    open(ART, 'w', encoding='utf-8').write(out)
    shutil.rmtree(tmp, ignore_errors=True)
    print('\n'.join(report) or 'nothing changed')
    print(f'wrote {ART}: {len(out) / 1e6:.2f} MB')


if __name__ == '__main__':
    main()
