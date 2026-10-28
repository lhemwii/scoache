# Génère les pages « Vos enjeux » du site d'essai BCG : bcg/enjeux.html (vue d'ensemble) et
# bcg/enjeux/<slug>.html (une page par enjeu). Textes repris mot pour mot du bloc « Vos enjeux »
# de index.html (les six enjeux d'Ilana) ; cas clients liés lus dans le même bloc.
# Lancé par _generer_site.py.
import html, json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(R, 'index.html'), encoding='utf-8').read()
cas = json.loads(re.search(r'<script type="application/json" id="cas-apercus">(.*?)</script>', src, re.S).group(1))
esc = lambda s: html.escape(s, quote=True)
FLECHE = '<svg class="ico" width="16" height="16" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg>'


def ico(n, s=20):
    return f'<svg class="ico" width="{s}" height="{s}" aria-hidden="true"><use href="/assets/icones.svg#i-{n}"/></svg>'


def img_cas(slug):
    return f'/assets/cas/{slug}.jpg' if os.path.exists(f'{R}/assets/cas/{slug}.jpg') else f'/assets/home/cas/{slug}.jpg'


def logo(slug, h=26):
    d = cas[slug]; l, hh = d['logo']['l'], d['logo']['h']
    return f'<img src="/assets/cas/logos/{slug}.png" alt="{esc(d["nom"])}" width="{round(l * h / hh)}" height="{h}" loading="lazy" decoding="async">'


# slug de page, nom court, photo du haut, photo « ce qui se joue »
META = [
    ('prise-de-fonction', 'Prise de fonction', '/assets/offre/hero-individuel.jpg', '/assets/home/offre-individuel.jpg'),
    ('posture-et-influence', 'Posture et influence', '/assets/hero-accueil.jpg', '/assets/home/offre-organisation.jpg'),
    ('pratiques-manageriales', 'Pratiques managériales', '/assets/offre/echelle-individuel.jpg', '/assets/offre/hero-coaching-de-dirigeant.jpg'),
    ('equipes-de-direction', 'Équipes de direction', '/assets/offre/echelle-collectif.jpg', '/assets/home/offre-collectif.jpg'),
    ('transformations', 'Transformations', '/assets/offre/hero-coaching-de-dirigeant.jpg', '/assets/offre/echelle-collectif.jpg'),
    ('decision-sous-pression', 'Décider sous pression', '/assets/offre/cas-michael-page.jpg', '/assets/offre/hero-organisation.jpg'),
]

blocs = re.findall(r'<li class="enjeu">(.*?)</li>\s*(?=<li class="enjeu">|</ul>\s*</div>\s*</section>)', src, re.S)
assert len(blocs) == 6, len(blocs)
ENJEUX = []
for i, b in enumerate(blocs):
    slug, court, photo, photo2 = META[i]
    texte = re.search(r'<p class="enjeu__texte">(.*?)</p>', b, re.S).group(1)
    debut = re.search(r'<span class="enjeu__texte-debut">(.*?)</span>', texte, re.S).group(1).strip()
    suite = re.sub(r'<span class="enjeu__texte-debut">.*?</span>', '', texte, flags=re.S).strip()
    parler = re.search(r'<a class="link-caps enjeu__parler" href="([^"]+)" data-prefill="([^"]+)" data-prefill-message="([^"]+)"', b)
    ENJEUX.append({
        'n': i + 1, 'slug': slug, 'court': court, 'photo': photo, 'photo2': photo2,
        'icone': re.search(r'#i-([a-z-]+)"', b).group(1),
        'titre': re.search(r'carte-lien__titre">(.*?)</span>', b).group(1),
        'debut': debut, 'suite': suite,
        'cas': re.findall(r'<a class="enjeu-cas" href="/cas-clients/([^"]+)">', b),
        'contact': '/bcg' + parler.group(1), 'sujet': parler.group(2), 'message': parler.group(3),
    })


def tete(titre, description):
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titre} (version BCG)</title>
  <meta name="description" content="{esc(description)}">
  <meta name="robots" content="noindex">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/css/bcg.css">
  <script>document.documentElement.classList.add('js');</script>
  <script src="/include.js" defer></script>
  <script src="/script.js" defer></script>
  <script src="/js/bcg.js" defer></script>
</head>
<body class="page-enjeux page-bcg">
<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="page">
  <div data-include="header-bcg"></div>

  <main id="contenu" tabindex="-1">'''


PIED = '''
    <div data-include="temoignages-bcg"></div>
    <div data-include="contact"></div>
  </main>

  <div data-include="footer"></div>
</div>
</body>
</html>
'''


def sousnav(actif):
    items = [('Tous les enjeux', '/bcg/enjeux')] + [(e['court'], f'/bcg/enjeux/{e["slug"]}') for e in ENJEUX]
    lis = ''.join('<li><a href="%s"%s>%s</a></li>' % (h, ' aria-current="true"' if h == actif else '', t) for t, h in items)
    return f'\n    <nav class="bcg-sousnav" aria-label="Vos enjeux"><span class="bcg-sousnav__label">Vos enjeux :</span><ul>{lis}</ul></nav>\n'


def cartes_cas(slugs):
    fiches = []
    for i, s in enumerate(slugs):
        d = cas[s]
        puce = ''
        if d.get('kpi') and '/10' in d['kpi'][0]:
            puce = f'<span class="bcg-impact__puce"><span class="bcg-impact__chiffre">{esc(d["kpi"][0])}</span><span class="bcg-impact__unite">{esc(d["kpi"][1])}</span></span>'
        echelle = d['echelle'].replace('Coaching d’', '').replace('Coaching ', '').lower()
        fiches.append(f'''          <li class="bcg-impact{' is-grand' if i == 0 else ''}"><a class="bcg-impact__carte" href="/bcg/cas-clients/{s}">
            <img class="bcg-impact__image" src="{img_cas(s)}" alt="" width="564" height="800" loading="lazy" decoding="async">
            {puce}
            <div class="bcg-impact__verre">
              <span class="bcg-impact__logo">{logo(s, 24)}</span>
              <p class="bcg-impact__surtitre">Cas client, {esc(echelle)}</p>
              <h3 class="bcg-impact__titre">{esc(d['titre'])}</h3>
              <p class="bcg-impact__texte">{esc(d['situation'])}</p>
              <span class="bcg-btn bcg-btn--noir bcg-impact__btn">Lire le cas {FLECHE}</span>
            </div>
          </a></li>''')
    return '\n'.join(fiches)


ECHELLES = [
    ('Individuel', 'Coaching individuel', 'Dirigeants et managers, en tête-à-tête, pour traverser une situation à fort enjeu.', '/bcg/coaching-de-dirigeant/individuel', '/assets/home/offre-individuel.jpg'),
    ('Collectif', 'Coaching collectif', 'CODIR, COMEX et groupes de pairs : faire d’un groupe une équipe qui décide.', '/bcg/coaching-de-dirigeant/collectif', '/assets/home/offre-collectif.jpg'),
    ('Organisation', 'Coaching d’organisation', 'Un socle de leadership commun, déployé à l’échelle de l’entreprise.', '/bcg/coaching-de-dirigeant/organisation', '/assets/home/offre-organisation.jpg'),
]


def page_enjeu(e):
    lignes = ''.join(
        f'<li><a class="bcg-verre-cas" href="/bcg/cas-clients/{s}"><span class="bcg-verre-cas__logo">{logo(s, 22)}</span>'
        f'<span class="bcg-verre-cas__titre">{esc(cas[s]["titre"])}</span>{FLECHE}</a></li>' for s in e['cas'])
    tuiles = ''.join(
        f'<a class="bcg-tuile" href="{h}"><span class="bcg-tuile__image"><img src="{im}" alt="" loading="lazy" decoding="async"></span>'
        f'<span class="bcg-tuile__corps"><span class="bcg-tuile__surtitre">{sur}</span><span class="bcg-tuile__titre">{t}</span>'
        f'<span class="bcg-tuile__texte">{txt}</span><span class="bcg-tuile__lien">Découvrir {FLECHE}</span></span></a>'
        for sur, t, txt, h, im in ECHELLES)
    return tete(e['titre'], e['debut']) + sousnav(f'/bcg/enjeux/{e["slug"]}') + f'''
    <!-- Haut de page : l'enjeu, en mots d'Ilana, sur une photo large avec les cas proches -->
    <section class="section section--plateau bcg-entete bcg-entete--photo" aria-labelledby="titre-page">
      <div class="plateau">
        <div class="bcg-entete__texte">
          <p class="eyebrow">Enjeu 0{e['n']}</p>
          <h1 class="inst-titre-hero" id="titre-page">{e['titre']}</h1>
          <p class="chapo">{e['debut']}</p>
          <div class="bcg-entete__actions">
            <a class="btn btn--noir btn--lg" href="{e['contact']}" data-prefill="{e['sujet']}" data-prefill-message="{e['message']}">En parler avec Ilana {FLECHE}</a>
            <a class="link-caps" href="#cas">Voir les cas proches</a>
          </div>
        </div>
        <div class="photo">
          <img src="{e['photo']}" alt="" width="1400" height="900" decoding="async">
          <div class="carte-verre bcg-verre-liste">
            <p class="carte-verre__eyebrow">Des situations proches, dans nos cas clients</p>
            <ul>{lignes}</ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Ce qui se joue : le texte complet de l'enjeu, à côté d'une photo -->
    <section class="bcg-section bcg-duo" aria-labelledby="titre-joue">
      <div class="bcg-duo__texte">
        <p class="eyebrow">Ce qui se joue</p>
        <h2 class="bcg-titre bcg-titre--moyen" id="titre-joue">{e['court']} : ce que vit le dirigeant</h2>
        <p class="bcg-duo__chapo">{e['debut']}</p>
        <p class="bcg-duo__suite">{e['suite']}</p>
      </div>
      <div class="bcg-duo__image"><img src="{e['photo2']}" alt="" loading="lazy" decoding="async"></div>
    </section>

    <!-- Trois échelles d'accompagnement -->
    <section class="bcg-section bcg-tuiles" aria-labelledby="titre-echelles">
      <p class="eyebrow">Comment nous accompagnons</p>
      <h2 class="bcg-titre bcg-titre--moyen" id="titre-echelles">Une personne, une équipe ou toute l’organisation</h2>
      <div class="bcg-tuiles__grille">{tuiles}</div>
    </section>

    <!-- Cas clients liés : défilent seuls, la carte active s'agrandit -->
    <section class="bcg-section bcg-cas" id="cas" aria-labelledby="cas-titre">
      <div class="bcg-cas__fond">
        <div class="bcg-tete bcg-tete--ligne">
          <div>
            <h2 class="bcg-titre" id="cas-titre">Ils l’ont vécu</h2>
            <p class="bcg-chapo">Des situations proches, dans nos cas clients : la situation de départ, l’accompagnement et les évolutions observées.</p>
          </div>
          <a class="link-caps" href="/bcg/cas-clients">Voir tous les cas clients</a>
        </div>
        <ul class="bcg-cas__piste" tabindex="0" aria-label="Cas clients, faire défiler horizontalement" data-bcg-cas>
{cartes_cas(e['cas'])}
        </ul>
        <div class="bcg-cas__commandes">
          <button type="button" class="bcg-commande" data-cas-prec aria-label="Cas précédent">{ico('chevron-left', 18)}</button>
          <button type="button" class="bcg-commande" data-cas-suiv aria-label="Cas suivant">{ico('chevron-right', 18)}</button>
        </div>
      </div>
    </section>
''' + PIED


def page_liste():
    tuiles = ''.join(
        f'<a class="bcg-tuile bcg-tuile--enjeu" href="/bcg/enjeux/{e["slug"]}"><span class="bcg-tuile__image"><img src="{e["photo"]}" alt="" loading="lazy" decoding="async"></span>'
        f'<span class="bcg-tuile__corps"><span class="bcg-tuile__surtitre">Enjeu 0{e["n"]}</span><span class="bcg-tuile__titre">{e["titre"]}</span>'
        f'<span class="bcg-tuile__texte">{e["debut"]}</span><span class="bcg-tuile__lien">Découvrir l’enjeu {FLECHE}</span></span></a>'
        for e in ENJEUX)
    return tete('Vos enjeux', 'Les six enjeux que Scoaché accompagne chez les dirigeants et les équipes de direction.') + sousnav('/bcg/enjeux') + f'''
    <section class="section section--plateau bcg-entete bcg-entete--colonnes" aria-labelledby="titre-page">
      <div class="plateau">
        <div class="bcg-entete__texte">
          <p class="eyebrow">Vos enjeux</p>
          <h1 class="inst-titre-hero" id="titre-page">Qu’est-ce qui change pour vous en ce moment&nbsp;?</h1>
          <p class="chapo">Six situations que vivent celles et ceux qui dirigent. Choisissez la vôtre : nous vous montrons comment nous l’accompagnons, et les cas clients qui s’en rapprochent.</p>
          <div class="bcg-entete__actions">
            <a class="btn btn--noir btn--lg" href="/bcg/nous-contacter">Nous contacter {FLECHE}</a>
          </div>
        </div>
        <div class="photo bcg-entete__visuel"><img src="/assets/visuel-offre.jpg" alt="" width="1000" height="1100" decoding="async"></div>
      </div>
    </section>

    <section class="bcg-section bcg-tuiles" aria-labelledby="titre-six">
      <p class="eyebrow">Six enjeux</p>
      <h2 class="bcg-titre bcg-titre--moyen" id="titre-six">Les moments où l’on fait appel à nous</h2>
      <div class="bcg-tuiles__grille">{tuiles}</div>
    </section>
''' + PIED


os.makedirs(os.path.join(R, 'bcg', 'enjeux'), exist_ok=True)
open(os.path.join(R, 'bcg', 'enjeux.html'), 'w', encoding='utf-8').write(page_liste())
for e in ENJEUX:
    open(os.path.join(R, 'bcg', 'enjeux', e['slug'] + '.html'), 'w', encoding='utf-8').write(page_enjeu(e))
print('enjeux', len(ENJEUX) + 1)
