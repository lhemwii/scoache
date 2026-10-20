#!/usr/bin/env python3
"""Serveur local du site Scoaché, avec les mêmes URL propres que Vercel.

Usage : python3 serve.py [port]   (par défaut 8000), depuis n'importe quel dossier.
/offre sert offre.html, /cas-clients/chanel sert cas-clients/chanel.html,
et une page absente renvoie 404.html.
"""
import http.server
import os
import sys

RACINE = os.path.dirname(os.path.abspath(__file__))


class Gestionnaire(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RACINE, **kwargs)

    def send_head(self):
        chemin = self.path.split('?', 1)[0].split('#', 1)[0]
        if chemin != '/' and chemin.endswith('/'):
            chemin = chemin.rstrip('/')
        local = os.path.join(RACINE, chemin.lstrip('/'))
        if chemin != '/' and not os.path.splitext(chemin)[1] and os.path.isfile(local + '.html'):
            self.path = chemin + '.html'
        elif chemin != '/' and not os.path.exists(local):
            self.send_response(404)
            corps = open(os.path.join(RACINE, '404.html'), 'rb').read()
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(corps)))
            self.end_headers()
            self.wfile.write(corps)
            return None
        return super().send_head()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print('Scoaché en local : http://127.0.0.1:%d/' % port)
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Gestionnaire).serve_forever()
