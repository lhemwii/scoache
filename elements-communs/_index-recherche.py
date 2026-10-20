#!/usr/bin/env python3
"""Génère search-index.json, l'index statique de la recherche du site (script.js, initRecherche).

Usage : python3 _index-recherche.py   (depuis n'importe quel dossier)

Une entrée par page : titre, URL propre, type (Page, Cas client, Formation, Coaching),
intertitres et texte principal. À relancer après toute modification de contenu.
Ce script est exclu du déploiement (.vercelignore) ; le JSON, lui, est public.
"""
import html
import json
import os
import re

RACINE = os.path.dirname(os.path.abspath(__file__))
EXCLUS = {'404.html', 'elements-communs.html'}
LONGUEUR_TEXTE = 3000


def propre(texte):
    texte = html.unescape(re.sub(r'<[^>]+>', ' ', texte))
    return re.sub(r'\s+', ' ', texte).strip()


def type_de(chemin):
    if chemin.startswith('cas-clients/') and chemin not in (
            'cas-clients/individuel.html', 'cas-clients/collectif.html', 'cas-clients/organisation.html'):
        return 'Cas client'
    if chemin.startswith('formations/'):
        return 'Formation'
    if chemin.startswith('coaching-de-dirigeant'):
        return 'Coaching'
    return 'Page'


def url_de(chemin):
    if chemin == 'index.html':
        return '/'
    return '/' + chemin[:-len('.html')]


def entree(chemin):
    with open(os.path.join(RACINE, chemin), encoding='utf-8') as f:
        source = f.read()
    titre_doc = re.search(r'<title>(.*?)</title>', source, re.S)
    description = re.search(r'<meta name="description" content="([^"]*)"', source)
    debut = source.find('<main')
    fin = source.find('</main>')
    principal = source[debut:fin] if debut >= 0 and fin > debut else source
    principal = re.sub(r'<script\b.*?</script>', ' ', principal, flags=re.S)
    principal = re.sub(r'<nav class="fil-ariane".*?</nav>', ' ', principal, flags=re.S)
    principal = re.sub(r'<span class="visually-hidden">.*?</span>', ' ', principal, flags=re.S)
    h1 = re.search(r'<h1\b[^>]*>(.*?)</h1>', principal, re.S)
    titre = propre(h1.group(1)) if h1 else propre(titre_doc.group(1)).replace(', Scoaché', '')
    intertitres = []
    for m in re.finditer(r'<h([23])\b[^>]*>(.*?)</h\1>', principal, re.S):
        t = propre(m.group(2))
        if t and t not in intertitres and t != titre:
            intertitres.append(t)
    texte = propre(re.sub(r'<h[1-3]\b[^>]*>.*?</h[1-3]>', ' ', principal, flags=re.S))
    sortie = {
        'titre': titre,
        'url': url_de(chemin),
        'type': type_de(chemin),
        'description': html.unescape(description.group(1)) if description else '',
        'intertitres': intertitres[:24],
        'texte': texte[:LONGUEUR_TEXTE],
    }
    if sortie['type'] == 'Cas client':
        client = re.search(r'<li aria-current="page">(.*?)</li>', source, re.S)
        if client:
            sortie['client'] = propre(client.group(1))
    return sortie


def pages():
    for dossier, _, fichiers in os.walk(RACINE):
        rel = os.path.relpath(dossier, RACINE)
        if rel.split(os.sep)[0] in ('partials', 'assets', 'css', '.vercel'):
            continue
        for nom in sorted(fichiers):
            if not nom.endswith('.html'):
                continue
            chemin = nom if rel == '.' else f'{rel}/{nom}'
            if chemin in EXCLUS or nom.startswith('_'):
                continue
            yield chemin


if __name__ == '__main__':
    index = [entree(c) for c in sorted(pages())]
    ordre = {'Page': 0, 'Coaching': 1, 'Cas client': 2, 'Formation': 3}
    index.sort(key=lambda e: (ordre[e['type']], e['url']))
    with open(os.path.join(RACINE, 'search-index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',', ':'))
    print('search-index.json :', len(index), 'pages')
