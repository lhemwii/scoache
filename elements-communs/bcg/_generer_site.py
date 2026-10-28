# Usage : python3 bcg/_generer_site.py (depuis elements-communs). Génère le site d'essai « version BCG » : elements-communs/bcg/<page>.html pour chaque page du site,
# plus bcg/index.html (l'accueil BCG, fabriqué par gen.py). Rien n'est modifié dans les pages d'origine.
import os, re, subprocess, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAUTER = {'404.html', 'elements-communs.html', 'accueil-bcg.html', 'index.html'}

def lien_bcg(m):
    attr, h = m.group(1), m.group(2)
    if not h.startswith('/') or h.startswith('//'): return m.group(0)
    if re.match(r'^/(bcg([/?#]|$)|assets/|css/|js/|partials/)', h): return m.group(0)
    if re.search(r'\.[a-z0-9]{2,4}$', re.split(r'[?#]', h)[0], re.I): return m.group(0)
    if h == '/': h2 = '/bcg'
    elif h[1] in '#?': h2 = '/bcg' + h[1:]
    else: h2 = '/bcg' + h
    return f'{attr}="{h2}"'

def convertir(s):
    s = s.replace('family=Outfit:wght@400;500;600', 'family=Outfit:wght@200;300;400;500;600')
    s = re.sub(r'(<script>document\.documentElement\.classList\.add\(\'js\'\);</script>)',
               r'<link rel="stylesheet" href="/css/bcg.css">\n  \1', s, count=1)
    s = s.replace('<script src="/script.js" defer></script>', '<script src="/script.js" defer></script>\n  <script src="/js/bcg.js" defer></script>', 1)
    s = re.sub(r'<body class="([^"]*)"', lambda m: f'<body class="{m.group(1)} page-bcg"', s, count=1)
    if '<body>' in s: s = s.replace('<body>', '<body class="page-bcg">', 1)
    s = s.replace('data-include="header"', 'data-include="header-bcg"').replace('data-include="temoignages"', 'data-include="temoignages-bcg"')
    s = re.sub(r'(href)="([^"]*)"', lien_bcg, s)
    s = re.sub(r'<title>(.*?)</title>', r'<title>\1 (version BCG)</title>', s, count=1)
    assert 'css/bcg.css' in s and 'js/bcg.js' in s and 'page-bcg' in s, 'injection ratée'
    return s

n = 0
for racine, dossiers, fichiers in os.walk(R):
    rel = os.path.relpath(racine, R)
    if rel.split(os.sep)[0] in ('bcg', 'partials', 'assets', 'css', 'js', 'node_modules', '.git'): continue
    for f in fichiers:
        if not f.endswith('.html'): continue
        chemin = os.path.normpath(os.path.join(rel, f))
        if chemin in SAUTER: continue
        s = open(os.path.join(R, chemin), encoding='utf-8').read()
        out = os.path.join(R, 'bcg', chemin)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w', encoding='utf-8').write(convertir(s))
        n += 1
# Accueil : produit par gen.py dans bcg/index.html, liens passés en /bcg
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), '_generer_accueil.py')], check=True)
acc = os.path.join(R, 'bcg', 'index.html')
s = open(acc, encoding='utf-8').read()
s = re.sub(r'(href)="([^"]*)"', lien_bcg, s)
open(acc, 'w', encoding='utf-8').write(s)
print('pages', n + 1)
