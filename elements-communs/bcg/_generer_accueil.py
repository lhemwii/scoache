# Génère bcg/index.html, l'accueil « version BCG », à partir de index.html (contenus réels).
# Lancé par _generer_site.py.
import json, re, os, html
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(f'{R}/index.html', encoding='utf-8').read()
cas = json.loads(re.search(r'<script type="application/json" id="cas-apercus">(.*?)</script>', src, re.S).group(1))
esc = lambda s: html.escape(s, quote=True)
def img(slug):
    return f'/assets/cas/{slug}.jpg' if os.path.exists(f'{R}/assets/cas/{slug}.jpg') else f'/assets/home/cas/{slug}.jpg'
def logo(slug, h=28):
    d = cas[slug]; l, hh = d['logo']['l'], d['logo']['h']
    return f'<img src="/assets/cas/logos/{slug}.png" alt="{esc(d["nom"])}" width="{round(l*h/hh)}" height="{h}" loading="lazy" decoding="async">'
def echelle_court(slug):
    return cas[slug]['echelle'].replace('Coaching d’', '').replace('Coaching ', '').capitalize()
ARROW = '<svg class="ico" width="16" height="16" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg>'
def ico(n, s=20): return f'<svg class="ico" width="{s}" height="{s}" aria-hidden="true"><use href="/assets/icones.svg#i-{n}"/></svg>'

# ---------- Hero : cartes qui défilent ----------
HERO = ['chanel', 'le-lab-rh', 'mazars', 'vinci-airports', 'ilek', 'cic', 'manomano', 'biborg', 'croix-rouge-francaise']
cartes = []
for i, s in enumerate(HERO):
    d = cas[s]
    cartes.append(f'''            <li class="bcg-defile__carte" data-carte>
              <a class="bcg-defile__lien" href="/cas-clients/{s}" tabindex="-1">
                <img class="bcg-defile__image" src="{img(s)}" alt="" width="564" height="800"{' fetchpriority="high"' if i < 3 else ' loading="lazy"'} decoding="async">
                <span class="bcg-defile__etiquette">{esc(d['echelle'])}</span>
                <span class="bcg-defile__verre">
                  <span class="bcg-defile__logo">{logo(s, 26)}</span>
                  <span class="bcg-defile__titre">{esc(d['titre'])}</span>
                  <span class="bcg-defile__lire">Lire le cas {ARROW}</span>
                </span>
              </a>
            </li>''')
hero = f'''    <!-- Hero « version BCG » : titre centré, cartes de cas clients qui défilent (la carte du centre
         est grande et porte son panneau en verre), commandes pause / précédent / suivant. bcg.js -->
    <section class="bcg-hero" aria-labelledby="hero-titre">
      <div class="bcg-hero__tete">
        <p class="bcg-surtitre">Coaching de dirigeants et d’équipes de direction</p>
        <h1 class="bcg-hero__titre" id="hero-titre">Prendre sa place, pas seulement un poste.</h1>
      </div>
      <div class="bcg-defile" role="region" aria-roledescription="carrousel" aria-label="Cas clients" data-bcg-defile>
        <ul class="bcg-defile__piste">
{chr(10).join(cartes)}
        </ul>
        <div class="bcg-defile__commandes">
          <button type="button" class="bcg-commande" data-defile-pause aria-label="Mettre en pause le défilement">{ico('pause', 16).replace('class="ico"', 'class="ico ico-pause"')}{ico('play', 16).replace('class="ico"', 'class="ico ico-lecture"')}</button>
          <button type="button" class="bcg-commande" data-defile-prec aria-label="Cas précédent">{ico('chevron-left', 18)}</button>
          <button type="button" class="bcg-commande" data-defile-suiv aria-label="Cas suivant">{ico('chevron-right', 18)}</button>
        </div>
      </div>
      <nav class="bcg-situations" aria-label="Situations fréquentes">
        <span class="bcg-situations__label">Vos situations</span>
        <a href="/coaching-de-dirigeant/individuel">Prendre un poste de direction</a>
        <a href="/coaching-de-dirigeant/collectif">Souder un CODIR recomposé</a>
        <a href="/coaching-de-dirigeant/organisation">Traverser une réorganisation</a>
      </nav>
    </section>
'''

# ---------- Logos ----------
logos = re.search(r'(    <!-- Logos clients.*?</section>\n)', src, re.S).group(1)
logos = re.sub(r' data-cas-ouvrir="[^"]+"', '', logos)
logos = logos.replace('<section class="home-logos"', '<section class="home-logos bcg-logos"', 1)
logos = logos.replace('<!-- Logos clients (Figma 1222:7982) : défilement continu, en pause au survol ; un clic ouvre le cas dans le carrousel -->',
                      '<!-- Logos clients : défilement continu, logos en noir adouci (couleur au survol) -->')

# ---------- Vos enjeux : cartes blanches à gauche, ouverture à droite ----------
blocs = re.findall(r'<li class="enjeu">(.*?)</li>\s*(?=<li class="enjeu">|</ul>\s*</div>\s*</section>)', src, re.S)
IMG_ENJEU = ['le-lab-rh', 'chanel', 'michael-page', 'michael-page-collectif', 'cic', 'jobteaser']
COURT = ['Sécuriser une prise de fonction', 'Renforcer sa posture et son influence', 'Faire évoluer ses pratiques managériales',
         'Renforcer une équipe de direction', 'Mobiliser dans une transformation', 'Décider et agir sous pression']
onglets, panneaux = [], []
for i, b in enumerate(blocs):
    n = i + 1
    icone = re.search(r'#i-([a-z-]+)"', b).group(1)
    titre = re.search(r'carte-lien__titre">(.*?)</span>', b).group(1)
    texte = re.search(r'<p class="enjeu__texte">(.*?)</p>', b, re.S).group(1)
    texte = re.sub(r'<span class="enjeu__texte-debut">(.*?)</span>', r'\1', texte)
    lis = re.findall(r'<a class="enjeu-cas" href="([^"]+)">\s*<img src="([^"]+)" alt="([^"]*)"[^>]*>\s*<span class="enjeu-cas__titre">(.*?)</span>', b, re.S)
    parler = re.search(r'(<a class="link-caps enjeu__parler".*?</a>)', b, re.S).group(1)
    parler = parler.replace('class="link-caps enjeu__parler"', 'class="bcg-btn bcg-btn--noir"')
    sel = 'true' if n == 1 else 'false'
    onglets.append(f'''          <li><button type="button" class="bcg-enjeu" role="tab" id="enjeu-onglet-{n}" aria-selected="{sel}" aria-controls="enjeu-{n}" tabindex="{0 if n == 1 else -1}" data-enjeu-onglet>
            <span class="bcg-enjeu__haut"><span class="pastille pastille--lg">{ico(icone, 24)}</span><span class="bcg-enjeu__num">0{n}</span></span>
            <span class="bcg-enjeu__titre">{titre}</span>
          </button></li>''')
    cas_html = '\n'.join(f'''                <li><a class="bcg-enjeu-cas" href="{h}"><span class="bcg-enjeu-cas__logo"><img src="{im}" alt="{a}" loading="lazy" decoding="async"></span><span class="bcg-enjeu-cas__titre">{t}</span>{ARROW}</a></li>''' for h, im, a, t in lis)
    slug = IMG_ENJEU[i]
    panneaux.append(f'''        <article class="bcg-enjeu-panneau" role="tabpanel" id="enjeu-{n}" aria-labelledby="enjeu-onglet-{n}" data-enjeu-panneau{'' if n == 1 else ' hidden'}>
          <img class="bcg-enjeu-panneau__image" src="{img(slug)}" alt="" width="564" height="800" loading="lazy" decoding="async">
          <div class="bcg-enjeu-panneau__verre">
            <p class="bcg-enjeu-panneau__surtitre">Enjeu 0{n}</p>
            <h3 class="bcg-enjeu-panneau__titre">{titre}</h3>
            <p class="bcg-enjeu-panneau__texte">{texte}</p>
            <p class="bcg-enjeu-panneau__label">Des situations proches, dans nos cas clients</p>
            <ul class="bcg-enjeu-panneau__cas">
{cas_html}
            </ul>
            {parler}
          </div>
        </article>''')
enjeux = f'''    <!-- Vos enjeux « version BCG » : les six cartes blanches à gauche, l'enjeu choisi s'ouvre à droite
         sur une photo, dans un panneau en verre. Textes d'Ilana repris mot pour mot. bcg.js -->
    <section class="bcg-section bcg-enjeux" id="enjeux" aria-labelledby="enjeux-titre">
      <div class="bcg-tete">
        <h2 class="bcg-titre" id="enjeux-titre">Vos enjeux</h2>
        <p class="bcg-chapo">Qu’est-ce qui change pour vous en ce moment ? Choisissez votre situation : nous vous montrons comment nous accompagnons celles et ceux qui la vivent.</p>
      </div>
      <div class="bcg-enjeux__corps" data-bcg-enjeux>
        <ul class="bcg-enjeux__liste" role="tablist" aria-label="Vos enjeux" aria-orientation="vertical">
{chr(10).join(onglets)}
        </ul>
        <div class="bcg-enjeux__scene">
{chr(10).join(panneaux)}
        </div>
      </div>
    </section>
'''

# ---------- Nos offres (contenu actuel, titre agrandi) ----------
offre = re.search(r'(    <!-- Offre : trois échelles.*?</section>\n)', src, re.S).group(1)
offre = offre.replace('''          <p class="eyebrow">Offre</p>
          <h2 class="section-head__title" id="offre-titre">Le coaching de dirigeant, à trois échelles</h2>
          <p class="section-head__intro">Pour une personne, une équipe de direction ou toute une organisation.</p>''',
'''          <h2 class="section-head__title" id="offre-titre">Nos offres</h2>
          <p class="section-head__intro">Le coaching de dirigeant, à trois échelles : pour une personne, une équipe de direction ou toute une organisation.</p>''')
assert 'Nos offres' in offre
offre = offre.replace('<section class="section home-offre"', '<section class="section home-offre bcg-offre" id="offres"', 1)

# ---------- Cas clients : cartes « client impact » ----------
CAS = ['le-lab-rh', 'ilek', 'biborg', 'chanel', 'mazars', 'fintecture', 'manomano', 'vinci-airports', 'schoolab', 'homeexchange']
fiches = []
for i, s in enumerate(CAS):
    d = cas[s]
    puce = ''
    if d.get('kpi') and '/10' in d['kpi'][0]:
        puce = f'''<span class="bcg-impact__puce"><span class="bcg-impact__chiffre">{esc(d['kpi'][0])}</span><span class="bcg-impact__unite">{esc(d['kpi'][1])}</span></span>'''
    fiches.append(f'''          <li class="bcg-impact{' bcg-impact--large' if i == 0 else ''}"><a class="bcg-impact__carte" href="/cas-clients/{s}">
            <img class="bcg-impact__image" src="{img(s)}" alt="" width="564" height="800" loading="lazy" decoding="async">
            {puce}
            <div class="bcg-impact__verre">
              <span class="bcg-impact__logo">{logo(s, 24)}</span>
              <p class="bcg-impact__surtitre">Cas client, {esc(echelle_court(s).lower())}</p>
              <h3 class="bcg-impact__titre">{esc(d['titre'])}</h3>
              <p class="bcg-impact__texte">{esc(d['situation'])}</p>
              <span class="bcg-btn bcg-btn--noir bcg-impact__btn">Lire le cas {ARROW}</span>
            </div>
          </a></li>''')
cas_sec = f'''    <!-- Cas clients « version BCG » : grand fond à angles droits, cartes photo ; au survol, le panneau
         en verre s'agrandit sur toute la carte et montre la situation et le bouton. bcg.js (flèches) -->
    <section class="bcg-section bcg-cas" id="cas" aria-labelledby="cas-titre">
      <div class="bcg-cas__fond">
        <div class="bcg-tete bcg-tete--ligne">
          <div>
            <h2 class="bcg-titre" id="cas-titre">Cas clients</h2>
            <p class="bcg-chapo">Ils nous ont confié leurs dirigeants : la situation de départ, l’accompagnement et les évolutions observées.</p>
          </div>
          <a class="link-caps" href="/cas-clients">Voir tous les cas clients</a>
        </div>
        <ul class="bcg-cas__piste" tabindex="0" aria-label="Cas clients, faire défiler horizontalement" data-bcg-cas>
{chr(10).join(fiches)}
        </ul>
        <div class="bcg-cas__commandes">
          <button type="button" class="bcg-commande" data-cas-prec aria-label="Cas précédents">{ico('chevron-left', 18)}</button>
          <button type="button" class="bcg-commande" data-cas-suiv aria-label="Cas suivants">{ico('chevron-right', 18)}</button>
        </div>
      </div>
    </section>
'''

page = f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scoaché, accueil (essai version BCG)</title>
  <meta name="description" content="Page d’essai : l’accueil de Scoaché retravaillé d’après le site du BCG.">
  <meta name="robots" content="noindex">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/css/home.css">
  <link rel="stylesheet" href="/css/bcg.css">
  <script>document.documentElement.classList.add('js');</script>
  <script src="/include.js" defer></script>
  <script src="/script.js" defer></script>
  <script src="/js/bcg.js" defer></script>
</head>
<body class="page-home page-bcg">
<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="page">
  <div data-include="header-bcg"></div>

  <main id="contenu" tabindex="-1">

{hero}
{logos}
{enjeux}
{offre}
{cas_sec}
    <div data-include="temoignages-bcg"></div>
    <div data-include="contact"></div>
  </main>

  <div data-include="footer"></div>
</div>
</body>
</html>
'''
os.makedirs(f'{R}/bcg', exist_ok=True); open(f'{R}/bcg/index.html', 'w', encoding='utf-8').write(page)
print('ok', len(page), 'enjeux', len(blocs))
