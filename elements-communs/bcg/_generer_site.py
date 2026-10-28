# Usage : python3 bcg/_generer_site.py (depuis elements-communs).
# Génère le site d'essai « version BCG » : bcg/<page>.html pour chaque page du site, plus bcg/index.html
# (l'accueil BCG, fabriqué par _generer_accueil.py). Rien n'est modifié dans les pages d'origine.
# En plus du thème (css/bcg.css), chaque page reçoit : une sous-navigation de rubrique encadrée,
# un haut de page en bande beige (photo large ou deux colonnes), et finit par « Ils en parlent » puis le contact.
# Les pages « Vos enjeux » n'existent que dans cette version (_generer_enjeux.py).
import os, re, subprocess, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAUTER = {'404.html', 'elements-communs.html', 'accueil-bcg.html', 'index.html'}
FLECHE = '<svg class="ico" width="16" height="16" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg>'


def lien_bcg(m):
    attr, h = m.group(1), m.group(2)
    if not h.startswith('/') or h.startswith('//'): return m.group(0)
    if re.match(r'^/(bcg([/?#]|$)|assets/|css/|js/|partials/)', h): return m.group(0)
    if re.search(r'\.[a-z0-9]{2,4}$', re.split(r'[?#]', h)[0], re.I): return m.group(0)
    if h == '/': h2 = '/bcg'
    elif h[1] in '#?': h2 = '/bcg' + h[1:]
    else: h2 = '/bcg' + h
    return f'{attr}="{h2}"'


# ---------- Sous-navigation de rubrique, encadrée comme chez BCG (« BCG IN FRANCE : … ») ----------
RUBRIQUES = [
    ('Nos offres', ('/offre', '/coaching-de-dirigeant', '/formations'), [
        ('Vue d’ensemble', '/offre'), ('Coaching de dirigeant', '/coaching-de-dirigeant'),
        ('Individuel', '/coaching-de-dirigeant/individuel'), ('Collectif', '/coaching-de-dirigeant/collectif'),
        ('Organisation', '/coaching-de-dirigeant/organisation'), ('Formations', '/formations')]),
    ('Cas clients', ('/cas-clients',), [
        ('Tous les cas', '/cas-clients'), ('Individuel', '/cas-clients/individuel'),
        ('Collectif', '/cas-clients/collectif'), ('Organisation', '/cas-clients/organisation')]),
    ('Scoaché', ('/a-propos', '/nous-contacter'), [('À propos', '/a-propos'), ('Nous contacter', '/nous-contacter')]),
    ('Informations', ('/mentions-legales', '/confidentialite', '/accessibilite'), [
        ('Mentions légales', '/mentions-legales'), ('Confidentialité', '/confidentialite'), ('Accessibilité', '/accessibilite')]),
]


def rubrique(url):
    for nom, prefixes, liens in RUBRIQUES:
        if any(url == x or url.startswith(x + '/') for x in prefixes): return nom, liens
    return None, None


def sousnav(url, s):
    nom, liens = rubrique(url)
    if not nom: return ''
    actif = url
    if url.startswith('/formations/'): actif = '/formations'
    elif url.startswith('/cas-clients/') and url not in [h for _, h in liens]:
        # Fiche de cas : on allume son échelle, lue dans le fil d'Ariane
        ariane = s.split('class="fil-ariane"', 1)[-1].split('</nav>', 1)[0]
        m = re.search(r'href="(/cas-clients/(?:individuel|collectif|organisation))"', ariane)
        actif = m.group(1) if m else '/cas-clients'
    items = ''.join('<li><a href="%s"%s>%s</a></li>' % (h, ' aria-current="true"' if h == actif else '', t) for t, h in liens)
    return '\n    <nav class="bcg-sousnav" aria-label="%s"><span class="bcg-sousnav__label">%s :</span><ul>%s</ul></nav>' % (nom, nom, items)


# ---------- Fiches de cas : la situation et les enjeux de départ, illustrés par une photo ----------
PHOTOS_ECHELLE = {'individuel': '/assets/offre/hero-individuel.jpg', 'collectif': '/assets/offre/echelle-collectif.jpg',
                  'organisation': '/assets/offre/hero-coaching-de-dirigeant.jpg'}
PHOTOS_ENJEUX = {'individuel': '/assets/home/offre-organisation.jpg', 'collectif': '/assets/home/offre-collectif.jpg',
                 'organisation': '/assets/offre/echelle-individuel.jpg'}


def illustrer_cas(s, slug):
    ariane = s.split('class="fil-ariane"', 1)[-1].split('</nav>', 1)[0]
    m = re.search(r'href="/cas-clients/(individuel|collectif|organisation)"', ariane)
    echelle = m.group(1) if m else 'individuel'
    for ident, photo in (('situation', PHOTOS_ECHELLE[echelle]), ('enjeux', PHOTOS_ENJEUX[echelle])):
        motif = re.compile(r'(<section class="section" id="%s"[^>]*>.*?<div class="plateau)(">)(.*?)(\n      </div>\n    </section>)' % ident, re.S)
        s, n = motif.subn(lambda m: m.group(1) + ' bcg-illustre' + m.group(2) + m.group(3) +
                          '\n        <div class="photo bcg-illustre__photo"><img src="%s" alt="" loading="lazy" decoding="async"></div>' % photo + m.group(4), s, count=1)
    return s


def mode_entete(s):
    m = re.search(r'<section class="section section--plateau"[^>]*>(.*?)</section>', s, re.S)
    if not m: return None
    h = m.group(1)
    return 'photo' if ('class="photo' in h and '<dl' not in h and '<form' not in h) else 'colonnes'


def convertir(s, url='/'):
    mode = mode_entete(s)
    if mode:
        s = s.replace('<section class="section section--plateau"', '<section class="section section--plateau bcg-entete bcg-entete--%s"' % mode, 1)
    s = s.replace('<main id="contenu" tabindex="-1">', '<main id="contenu" tabindex="-1">' + sousnav(url, s), 1)
    # Fin de page : « Ils en parlent », puis le contact, et rien d'autre
    if '<div data-include="contact"></div>' in s:
        s = re.sub(r'\n?[ \t]*<div data-include="temoignages"></div>', '', s)
        s = s.replace('    <div data-include="contact"></div>', '    <div data-include="temoignages"></div>\n    <div data-include="contact"></div>', 1)
    if url.startswith('/cas-clients/') and url.count('/') == 2:
        s = illustrer_cas(s, url.split('/')[-1])
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
        url = '/' + chemin[:-5].replace(os.sep, '/')
        open(out, 'w', encoding='utf-8').write(convertir(s, url))
        n += 1
# Accueil : produit par _generer_accueil.py dans bcg/index.html, liens passés en /bcg
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), '_generer_accueil.py')], check=True)
acc = os.path.join(R, 'bcg', 'index.html')
s = open(acc, encoding='utf-8').read()
s = re.sub(r'(href)="([^"]*)"', lien_bcg, s)
open(acc, 'w', encoding='utf-8').write(s)
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), '_generer_enjeux.py')], check=True)
print('pages', n + 1 + 7)
