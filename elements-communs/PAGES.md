# Site Scoaché : guide pour les agents de pages

Ce dossier est la base du site. Site statique, sans build ni dépendance, déployé sur Vercel
(projet `scoache-site-web`, https://scoache-site-web.vercel.app/) à chaque push sur la branche
`claude/vibrant-gates-pkqruw`. Référence visuelle : Figma `F329a0sXQJxBKyrLljpb2F`, page « SIte »,
home v3 `1222:7935`. Démonstration vivante de tous les composants : `/elements-communs`.

## 1. Règle de propriété des fichiers

- Chaque agent crée **uniquement** les fichiers de son groupe (tableau ci-dessous), plus sa feuille
  `css/<groupe>.css` et, si besoin, ses images dans `assets/<groupe>/`.
- **Ne jamais modifier les fichiers partagés** : `styles.css`, `script.js`, `include.js`,
  `partials/*`, `vercel.json`, `404.html`, `elements-communs.html`, `assets/icones.svg`,
  `assets/cas/`, `assets/temoins/`, ce fichier. Besoin d'un changement partagé : le signaler.
- Pour adapter un composant à une page, surcharger dans `css/<groupe>.css`, avec un sélecteur
  préfixé par une classe de page (ex. `.page-offre .carte-lien { ... }`).
- JavaScript propre à une page : éviter. Si indispensable, `js/<groupe>.js`, branché sur
  `document.addEventListener('scoache:partiels', ...)`.

| Groupe | Fichiers | CSS |
|---|---|---|
| accueil | `index.html` | `css/accueil.css` |
| offre | `offre.html`, `coaching-de-dirigeant.html`, `coaching-de-dirigeant/individuel.html`, `coaching-de-dirigeant/collectif.html`, `coaching-de-dirigeant/organisation.html` | `css/offre.css` |
| cas-clients | `cas-clients.html`, `cas-clients/<slug>.html` | `css/cas-clients.css` |
| formations | `formations.html`, `formations/<slug>.html` | `css/formations.css` |
| a-propos | `a-propos.html`, `nous-contacter.html` | `css/a-propos.css` |
| legal | `mentions-legales.html`, `confidentialite.html`, `accessibilite.html` | `css/legal.css` |

## 2. Routes

`vercel.json` active `cleanUrls` : le fichier `offre.html` répond sur `/offre`, et
`cas-clients/chanel.html` sur `/cas-clients/chanel`. Dans les liens, écrire toujours l'URL propre,
sans `.html`, en chemin absolu.

- `/` accueil, `/offre`, `/coaching-de-dirigeant`, `/coaching-de-dirigeant/individuel`,
  `/coaching-de-dirigeant/collectif`, `/coaching-de-dirigeant/organisation`
- `/cas-clients` : hub (mur de logos en couleur et choix d'une échelle), puis les pages d'échelle
  `/cas-clients/individuel`, `/cas-clients/collectif`, `/cas-clients/organisation`, et
  `/cas-clients/<slug>` avec les slugs : `chanel`, `vinci-airports`, `mazars`, `cic`,
  `croix-rouge-francaise`, `michael-page`, `ilek`, `biborg`, `le-lab-rh`, `fintecture`, `manomano`,
  `schoolab`, `jobteaser`, `groupe-nice-matin`, `homeexchange`, `enseignement-catholique-de-paris`,
  `michael-page-collectif`. Tout est généré par `cas-clients/_generer.py` (qui met aussi à jour le
  JSON `#cas-apercus` de l'accueil) : modifier les données, puis relancer le script.
  Gabarit d'une page cas : hero (logo, profil et échelle, titre = le problème), bande « En 30
  secondes » (le défi, ce que nous avons fait, ce qui a changé : extraits mot pour mot), « Ce que ce
  cas démontre », puis le détail (situation, enjeux, accompagnement, évolutions), le carrousel
  « D’autres situations proches » et le bloc contact. `<body data-cas="<slug>">` affiche dans ce
  bloc la ligne « Vous vivez une situation proche ? », qui pré-remplit le message avec le cas.
- `/formations` (catalogue avec ancres `#leadership`, `#management`, `#communication`,
  `#efficacite-personnelle`), puis `/formations/<slug>` : une page par formation du catalogue,
  plus `cadre-relationnel-et-performance` et `gestion-de-conflit` (générées par `formations/_generer.py`)
- `/a-propos` (ancres `#fondatrice`, `#methode` pour « La méthode », `#qualite` pour Qualiopi), `/nous-contacter`, `/mentions-legales`,
  `/confidentialite` (ancre `#cookies`), `/accessibilite`
- Une page absente renvoie `404.html`.

**Recherche** : l'icône de la navbar, Ctrl+K (ou Cmd+K) et le bouton du panneau mobile ouvrent
la recherche (script.js, `initRecherche`). Elle lit `/search-index.json`, généré par
`python3 _index-recherche.py` (exclu du déploiement) : **relancer ce script après toute
modification de contenu**, puis le commiter avec les pages.

**Chemins absolus partout** (`/styles.css`, `/assets/...`, `/partials/...`) : les pages imbriquées
(`/cas-clients/chanel`) doivent fonctionner.

**En local** : `python3 serve.py` dans ce dossier, puis http://127.0.0.1:8000/ (mêmes URL propres
que Vercel). Un simple `python3 -m http.server` marche aussi, mais il faut alors taper `.html`.
Les partiels ne se chargent pas en `file://`.

## 3. Modèle de page

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Coaching collectif, Scoaché</title>
  <meta name="description" content="Une phrase qui décrit la page.">
  <meta name="robots" content="noindex">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/css/offre.css">
  <script>document.documentElement.classList.add('js');</script>
  <script src="/include.js" defer></script>
  <script src="/script.js" defer></script>
</head>
<body class="page-offre">
<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="page">
  <div data-include="header"></div>
  <main id="contenu" tabindex="-1">
    <nav class="fil-ariane" aria-label="Fil d’Ariane"> ... </nav>
    <!-- sections de la page -->
    <div data-include="temoignages"></div>   <!-- optionnel -->
    <div data-include="contact"></div>
  </main>
  <div data-include="footer"></div>
</div>
</body>
</html>
```

Placeholders disponibles : `header`, `footer`, `contact` (bloc « Parlons de votre situation » avec
formulaire, une seule fois par page), `temoignages` (« Ils en parlent »). `include.js` les injecte,
marque le lien de la page courante (`aria-current`, rubrique active de la navbar), puis envoie
l'événement `scoache:partiels` ; `script.js` branche alors menus, menu mobile, formulaire,
carrousels et FAQ (`Scoache.init()`, rappelable sans risque).

Icônes : sprite Lucide `/assets/icones.svg`, toujours avec `aria-hidden="true"` :
`<svg class="ico" width="16" height="16" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg>`.
Noms : `i-arrow`, `i-arrow-bold`, `i-chevron` (bas), `i-chevron-left`, `i-chevron-right`, `i-plus`,
`i-minus`, `i-check`, `i-star`, `i-search`, `i-menu`, `i-x`, `i-layers`, `i-book`, `i-user`,
`i-user-round`, `i-users-round`, `i-building`, `i-compass`, `i-sparkle`, `i-gauge`, `i-message`,
`i-list-checks`, `i-mail`, `i-linkedin`, `i-external`. Icône manquante : la demander, ou l'inclure
en SVG inline Lucide dans la page.

## 4. Composants (copier-coller)

Voir le rendu sur `/elements-communs`. Largeurs : la page fait 1440 px max, chaque section a
40 px de marge latérale (0 sous 900 px), les en-têtes de section 36 px de plus.

### Sections
`<section class="section">` : bloc standard (56 px au-dessus, 24 px dessous).
`section--plateau` : bloc qui n'est qu'un plateau (hero, FAQ). `section--serre` : 16 px au-dessus.

### Fil d'Ariane
```html
<nav class="fil-ariane" aria-label="Fil d’Ariane">
  <ol>
    <li><a href="/">Accueil</a></li>
    <li><a href="/offre">Offre</a></li>
    <li aria-current="page">Coaching collectif</li>
  </ol>
</nav>
```

### En-tête de section (eyebrow, titre 44 px, lien à droite optionnel)
```html
<div class="section-head">
  <div class="section-head__text">
    <p class="eyebrow">Cas clients</p>
    <h2 class="section-head__title">Ils nous ont confié leurs dirigeants</h2>
  </div>
  <a class="link-caps section-head__link" href="/cas-clients">Voir tous les cas clients</a>
</div>
```
Variante de lien violet : `link-caps link-caps--accent`. Typo utile : `titre-1` (64), `titre-2` (44),
`titre-3` (30), `titre-4` (24), `chapo` (18, gris), `texte`, `texte-petit`, `eyebrow`, `eyebrow--lg`.

### Plateau greige et cartes blanches
```html
<section class="section section--plateau">
  <div class="plateau">
    <div class="plateau__texte">
      <div class="plateau__intro">
        <p class="eyebrow eyebrow--lg">Vos enjeux</p>
        <h2 class="titre-2">Qu’est-ce qui change pour vous en ce moment ?</h2>
        <p class="chapo">Texte d’introduction.</p>
      </div>
    </div>
    <div class="carte carte--flex"> ... </div>
  </div>
</section>
```
Variantes : `plateau--10` (padding et gouttière 10), `plateau--colonne`. Grilles de cartes :
`<div class="grille grille--2">` (aussi `grille--3`, `grille--4`).

### Hero (plateau, colonne texte, carte blanche avec photo et carte vitrée)
```html
<section class="section section--plateau">
  <div class="plateau hero">
    <div class="hero__texte">
      <div class="hero__intro">
        <p class="eyebrow eyebrow--lg">Coaching de dirigeant, transitions de leadership</p>
        <h1 class="titre-1 hero__titre">Prendre sa place, pas seulement un poste.</h1>
        <p class="chapo hero__lead">Phrase d’accroche.</p>
        <div class="hero__actions">
          <a class="btn btn--noir btn--lg" href="/nous-contacter">Nous contacter <svg class="ico" width="18" height="18" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg></a>
          <a class="link-caps" href="/offre">Découvrir l’offre</a>
        </div>
      </div>
      <p class="hero__preuve"><svg class="ico" width="14" height="14" aria-hidden="true"><use href="/assets/icones.svg#i-star"/></svg>4,9/5 sur Google, 94 % de satisfaction en 2025</p>
    </div>
    <div class="carte hero__carte">
      <div class="hero__carte-contenu">
        <p class="eyebrow">Les situations que nous accompagnons</p>
        <p class="titre-4">Exercer sa fonction dans une situation à fort enjeu.</p>
        <ul class="mega-links">
          <li><a class="mega-link" href="/coaching-de-dirigeant/individuel"><svg class="ico" width="20" height="20" aria-hidden="true"><use href="/assets/icones.svg#i-user-round"/></svg><span class="mega-link__text"><span class="mega-link__title">Prendre un poste de direction</span><span class="mega-link__sub">Coaching individuel</span></span><svg class="ico mega-link__arrow" width="16" height="16" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg></a></li>
        </ul>
        <a class="link-caps" href="/cas-clients">Voir tous les cas clients</a>
      </div>
      <a class="photo hero__photo" href="/cas-clients">
        <img src="/assets/hero-accueil.jpg" alt="" width="680" height="940">
        <span class="carte-verre">
          <span class="carte-verre__eyebrow">Cas clients</span>
          <span class="carte-verre__titre">De CHANEL à HomeExchange, nos accompagnements racontés</span>
          <span class="carte-verre__lien">Lire les cas</span>
        </span>
      </a>
    </div>
  </div>
</section>
```
`ul.mega-links > li > a.mega-link` est aussi la **liste de liens** standard (filets, flèche grise).

### Carte photo avec carte vitrée et puce logo
```html
<a class="photo carte-photo" href="/cas-clients/chanel">
  <img src="/assets/cas/chanel.jpg" alt="" width="564" height="800" loading="lazy">
  <span class="logo-puce"><img src="/assets/cas/logo-chanel.png" alt="CHANEL" width="96" height="32"></span>
  <span class="carte-verre">
    <span class="carte-verre__eyebrow">Individuel, dirigeante senior</span>
    <span class="carte-verre__titre">Renforcer l’influence d’une dirigeante dans des interactions à forts enjeux</span>
    <span class="carte-verre__lien">Lire le cas</span>
  </span>
</a>
```
`.photo` seule : image en fond avec le dégradé violet léger du Figma, contenu en bas
(`photo--entre` : contenu réparti haut et bas). Photos et logos partagés dans `assets/cas/`
(chanel, mazars, manomano, vinci-airports, croix-rouge-francaise) ; les autres cas ajoutent les
leurs dans `assets/cas-clients/`.

### Carrousel (progression, flèches, filtres optionnels) : JS fourni
```html
<div data-carrousel>
  <div class="section-head">
    <div class="section-head__text"> ... </div>
    <div class="filtres" role="group" aria-label="Filtrer par échelle">
      <button type="button" class="filtre" aria-pressed="true" data-carrousel-filtre="tous">Tous</button>
      <button type="button" class="filtre" aria-pressed="false" data-carrousel-filtre="individuel">Individuel</button>
    </div>
  </div>
  <div class="carrousel">
    <ul class="carrousel__piste" tabindex="0" aria-label="Cas clients">
      <li class="carrousel__item" data-echelle="individuel"> <!-- une a.photo.carte-photo --> </li>
    </ul>
    <div class="carrousel__pied">
      <div class="carrousel__progression" aria-hidden="true"><span></span></div>
      <div class="carrousel__commandes">
        <div class="carrousel__fleches">
          <button type="button" class="fleche" data-carrousel-prec aria-label="Précédent"><svg class="ico" width="20" height="20" aria-hidden="true"><use href="/assets/icones.svg#i-chevron-left"/></svg></button>
          <button type="button" class="fleche" data-carrousel-suiv aria-label="Suivant"><svg class="ico" width="20" height="20" aria-hidden="true"><use href="/assets/icones.svg#i-chevron-right"/></svg></button>
        </div>
        <a class="link-caps" href="/cas-clients">Voir tous les cas clients</a>
      </div>
    </div>
  </div>
</div>
```

### Pastilles d'icône
```html
<span class="pastille"><svg class="ico" width="18" height="18" aria-hidden="true"><use href="/assets/icones.svg#i-compass"/></svg></span>
```
36 px gris clair par défaut ; `pastille--lg` (44 px, icône 22), `pastille--noir`, `pastille--accent`.

### Carte lien (situation, échelle)
```html
<a class="carte-lien" href="/coaching-de-dirigeant/individuel">
  <span class="carte-lien__haut"><span class="pastille pastille--lg"><svg class="ico" width="22" height="22" aria-hidden="true"><use href="/assets/icones.svg#i-user-round"/></svg></span><svg class="ico" width="20" height="20" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg></span>
  <span class="carte-lien__corps"><span class="carte-lien__titre">Je prends un poste de direction</span><span class="carte-lien__texte">Passer d’expert à dirigeant, asseoir sa légitimité.</span></span>
</a>
```
Variante lavande discrète (expertises) : `carte-lien carte-lien--accent`.

### Barre (texte et « Nous contacter »), à poser dans un plateau
```html
<div class="barre">
  <p class="barre__texte"><svg class="ico" width="18" height="18" aria-hidden="true"><use href="/assets/icones.svg#i-message"/></svg>Une situation à discuter ? Parlons-en, sans engagement.</p>
  <a class="btn btn--noir" href="/nous-contacter">Nous contacter <svg class="ico" width="16" height="16" aria-hidden="true"><use href="/assets/icones.svg#i-arrow"/></svg></a>
</div>
```

### Carte chiffre
```html
<div class="stat stat--lg"><span class="stat__valeur">94 %</span><span class="stat__libelle">de satisfaction en 2025</span></div>
```
Petite version sur photo : `stat stat--verre` (comme le « Chiffre clé » des cas clients).

### FAQ (accordéon) : JS fourni
```html
<section class="section section--serre">
  <div class="plateau" data-faq>
    <div class="faq__intro">
      <h2 class="titre-3">Questions fréquentes</h2>
      <p class="texte-petit">Les réponses aux questions qu’on nous pose avant de démarrer.</p>
    </div>
    <div class="carte faq__liste">
      <div class="faq__item">
        <h3 class="titre-reset"><button type="button" class="faq__question" aria-expanded="false" aria-controls="faq-1">
          <svg class="ico faq__signe faq__signe--plus" width="18" height="18" aria-hidden="true"><use href="/assets/icones.svg#i-plus"/></svg>
          <svg class="ico faq__signe faq__signe--moins" width="18" height="18" aria-hidden="true"><use href="/assets/icones.svg#i-minus"/></svg>
          Comment financer un accompagnement ?
        </button></h3>
        <div class="faq__reponse" id="faq-1" hidden><p>Réponse.</p></div>
      </div>
    </div>
  </div>
</section>
```
Question ouverte au chargement : `faq__item is-open`, `aria-expanded="true"`, sans `hidden`.
Identifiants `faq-…` uniques dans la page.

### Autres éléments déjà stylés
Boutons `btn btn--noir` (et `btn--lg`), lien majuscule souligné `link-caps`, élément de menu
`mega-item` (avec `is-active`), filtres `filtre`, puces de cases `checks`.

## 5. Règles de design (obligatoires)

- Police **Outfit** (Google Fonts), poids 400, 500 et 600.
- Boutons **noirs**. `#4744C1` seulement en **petit accent** (eyebrows, liens, chiffres, pastilles) :
  jamais de grand bloc bleu ou violet. Plateaux greige `#E7E6E1`, gris clair `#F1EFEB`, filets
  `#DAD7D0`, texte secondaire `#4F4F4F`, cartes blanches arrondies 12 px.
- Ne jamais écrire « · », « • » ni « ▾ », nulle part (textes, alt, commentaires). Chevrons et puces
  en SVG Lucide.
- Aucun numéro de téléphone, aucune adresse postale.
- Un seul appel à l'action : **« Nous contacter »** (lien `/nous-contacter`). « Envoyer » reste le
  bouton du formulaire.
- Aucun décompte des cas ou des coachings : pas de « 15 cas », « quinze accompagnements »,
  « 9 individuels ». Dire « nos cas clients », « tous les cas clients ».
- Formations **discrètes** : un onglet dans le menu « Offre », une section sur `/offre` et un lien
  dans le pied de page, comme dans le Figma ; jamais dans les héros.
- Photos de cas : toujours la puce logo du client, jamais un chiffre (les chiffres restent dans le texte).
- Logos clients toujours en couleur, sans filtre ni transparence.
- Pastilles numérotées toujours claires (`#F1EFEB`, texte noir), jamais une pastille sombre parmi des claires.
- Pas de barre « Parlons-en » juste au-dessus du bloc « Parlons de votre situation ».
- Menu « Cas clients » : les trois échelles, quelques thèmes et un lien vers la page de l'échelle ;
  jamais la liste des cas (personne ne doit pouvoir les compter).
- Ne pas inventer de clients ni de témoignages : utiliser le Figma (et, à défaut, `src/content.js` à la racine du dépôt, sans en reprendre le téléphone ni l'adresse).
- Texte en **français**, apostrophes typographiques (’) et espaces avant « : ? ! ».
- Accessibilité : un seul `h1` par page, titres dans l'ordre, `alt` vide pour les photos
  décoratives, `alt` = nom du client pour un logo, liens explicites.

## 6. Mouvement et interactions partagés (script.js, styles.css)

Tout respecte « réduire les animations » (rien ne bouge) et reste visible sans JavaScript.
Durées de 0,3 à 0,6 s ; seuls le zoom du hero et le Ken Burns des cas sont lents et continus.

- **Apparitions au défilement** : automatiques sur les blocs principaux (en-têtes de section,
  plateaux, cartes, barres, témoignages, footer), en cascade. À la main : `data-reveal`
  (montée) ou `data-reveal="glisse"` (entrée latérale) ; `data-no-reveal` exclut un conteneur.
- **Titre ligne par ligne** : `data-lignes` sur un titre en texte simple.
- **Liste en cascade au chargement** : `data-cascade` sur une liste.
- **Chiffres** : chaque `.stat__valeur` simple compte jusqu'à sa valeur ; dans un texte,
  `<span data-compte>94</span> %`.
- **Bandeau de logos** : `<div class="marquee" data-marquee><div class="marquee__defile"><ul class="marquee__piste">…</ul></div></div>`,
  pause au survol. Un logo `<a href="/cas-clients/<slug>" data-cas-ouvrir="<slug>">` ouvre ce cas
  dans le carrousel de la page.
- **Carrousel** : `data-carrousel-auto="5000"` (barre de progression synchronisée, pause au
  survol et au focus, arrêt après action). Une carte `data-cas-carte="<slug>"` s'élargit sur place
  avec situation, enjeux, chiffre clé et « Ce que ce cas démontre » si la page contient
  `<script type="application/json" id="cas-apercus">` (voir l'accueil). Grand écran : hauteur
  fixe de 400 px (le corps du détail défile), animation en transform et clip-path seulement,
  interruptible (double clic, autre carte pendant l'animation). Mobile : la carte s'allonge vers
  le bas (grid-template-rows).
- **Enjeux ouvrables** (les six enjeux d'Ilana Porteret, mot pour mot) : `<ul data-enjeux>` de `li.enjeu` (bouton `.enjeu__bouton` +
  `.enjeu__panneau > .enjeu__interieur > .enjeu__contenu`), une seule carte ouverte à la fois,
  mise en avant tournante au repos. `li.enjeu` est en `display: contents` : script.js place le
  panneau sur une rangée pleine largeur sous la rangée de sa carte (propriété `order`), la carte
  ne change jamais de taille et le panneau s'ouvre en grid-template-rows (0fr vers 1fr).
- **Témoignages** : le partiel tourne seul toutes les 8 s et un clic sur un petit témoignage le
  passe en grand.
- **Pré-remplissage du contact** : tout lien `data-prefill="<sujet>"` (et/ou
  `data-prefill-cas="<slug>"`, `data-prefill-message="…"`) fait défiler jusqu'au formulaire de la
  page et écrit une phrase de départ modifiable dans le message. Son `href` pointe vers
  `/nous-contacter?sujet=…&cas=…`, qui pré-remplit aussi à l'arrivée. Sujets : `prise-de-fonction`,
  `posture`, `comite`, `transformation`, `equipe`, `autre`. Un sujet libre, comme le nom d'une
  formation (`/nous-contacter?sujet=Gestion%20du%20stress`), donne « Bonjour, je souhaite en savoir
  plus sur la formation « Gestion du stress ». ». Le formulaire porte
  `data-formulaire-contact` et son message `data-message` ; il n'y a plus de puces de sujet.
- **Formulaire** : `data-frappe="exemple 1||exemple 2"` sur un champ tape ses exemples en
  placeholder ; une coche apparaît sur chaque champ valide (`.field__saisie` + `.field__ok`) ;
  le bouton `.btn-envoi` devient la confirmation.
