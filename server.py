from __future__ import annotations

import socket
import threading
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


HOST = "127.0.0.1"
START_PORT = 8000
PROJECT_DIR = Path(__file__).resolve().parent


class SpiderVerseHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()


def find_open_port(start_port: int) -> int:
    port = start_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind((HOST, port))
                return port
            except OSError:
                port += 1


def main() -> None:
    port = find_open_port(START_PORT)
    handler = partial(SpiderVerseHandler, directory=str(PROJECT_DIR))
    server = ThreadingHTTPServer((HOST, port), handler)
    url = f"http://{HOST}:{port}/"

    print(f"Spider-Verse site running at {url}")
    print("Press Ctrl+C to stop the server.")

    threading.Timer(1.0, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
