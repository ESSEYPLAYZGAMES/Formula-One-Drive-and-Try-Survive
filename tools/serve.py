"""Static dev server with caching disabled (ES modules otherwise get heuristically cached)."""
import functools, http.server, mimetypes, sys

mimetypes.add_type('text/javascript', '.js')
mimetypes.add_type('application/geo+json', '.geojson')


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def log_message(self, fmt, *args):
        if args and str(args[1]).startswith(('4', '5')):
            super().log_message(fmt, *args)


if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Handler, directory=root))
    print(f'serving {root} on http://127.0.0.1:{port}', flush=True)
    srv.serve_forever()
