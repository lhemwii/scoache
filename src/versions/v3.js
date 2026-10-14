// Proposition 3 — « Studio » : la DA Scoaché passée au filtre d’un studio de design (réf. wjystudios.com).
// Fond noir, capitales géantes, rail vertical, menu plein écran, liste de clients monumentale, bloc pervenche.
const P = require('../parts');

const V = {
  id: 'v3', dir: 'v3-studio', label: 'Studio', inspiration: 'wjystudios.com',
  css: 'v3.css',
  mood: 'Affirmé · contemporain · mémorable',
  type: 'Archivo (Black / Expanded)',
  pitch: 'L’énergie d’un studio. Fond noir, typographie géante en capitales, liste de clients monumentale, rail de navigation vertical, bloc pervenche plein écran. Le rouge passe en framboise vive sur noir : fort, mais jamais criard.',
  pros: 'Mémorable et très contemporaine : Scoaché ne ressemble plus à aucun concurrent.',
  watch: 'Le fond noir est moins « bienveillant » et peut surprendre une cible RH.',
  palette: [['#0D0D10', 'Noir'], ['#EC5C85', 'Framboise vive'], ['#A7B4FF', 'Pervenche'], ['#F5ECE0', 'Crème'], ['#3A3A41', 'Graphite']],
  fonts: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&display=swap',
};

const n2 = (i) => String(i).padStart(2, '0');
const homeSteps = [['intro', 'Intro'], ['preuves', 'Preuves'], ['approche', 'Approche'], ['offre', 'Offre'], ['cas', 'Cas'], ['formations', 'Formations'], ['contact', 'Contact']];

V.header = (ctx) => {
  const isHome = ctx.route.key === 'home';
  const steps = isHome
    ? `<ol class="rail__steps">${homeSteps.map(([id, l], i) => `<li><a href="#${id}" data-rail-link${i === 0 ? ' aria-current="true"' : ''}><span>${n2(i + 1)}</span><b>${l}</b></a></li>`).join('')}</ol>`
    : `<p class="rail__page">${ctx.route.title}</p>`;
  return `
<header class="site-header" data-header>
  <div class="rail">
    <button class="rail__burger" type="button" aria-expanded="false" aria-controls="overlay" data-overlay-toggle><span class="sr-only">Menu</span>${P.icons.menu}</button>
    ${steps}
    <a class="rail__cta" href="${ctx.href('contact')}"><span>Parlons-en</span>${P.icons.out}</a>
  </div>
  <div class="topbar">
    <a class="topbar__logo" href="${ctx.href('home')}" aria-label="Scoaché — accueil"><img src="${ctx.img('brand/logo-blanc.png')}" alt="Scoaché" width="112" height="31"></a>
    <nav class="topbar__nav" aria-label="Navigation principale">
      <a href="${ctx.href('offre')}"${ctx.is('offre') || ctx.is('coaching') || ctx.is('scale') || ctx.is('formations') || ctx.is('formation') ? ' aria-current="page"' : ''}>Offre</a>
      <a href="${ctx.href('cas')}"${ctx.is('cas') ? ' aria-current="page"' : ''}>Cas d’usage</a>
      <a href="${ctx.href('apropos')}"${ctx.is('apropos') ? ' aria-current="page"' : ''}>À propos</a>
      <a class="topbar__cta" href="${ctx.href('contact')}">Nous contacter</a>
    </nav>
    <button class="topbar__burger" type="button" aria-expanded="false" aria-controls="overlay" data-overlay-toggle><span class="sr-only">Menu</span>${P.icons.menu}</button>
  </div>
  <div class="overlay" id="overlay" inert>
    <button class="overlay__close" type="button" data-overlay-toggle aria-label="Fermer le menu">${P.icons.close}</button>
    <div class="overlay__inner">
      <ul class="overlay__big">
        <li><a href="${ctx.href('offre')}"><span>01</span>Offre</a></li>
        <li><a href="${ctx.href('cas')}"><span>02</span>Cas d’usage</a></li>
        <li><a href="${ctx.href('apropos')}"><span>03</span>À propos</a></li>
        <li><a href="${ctx.href('contact')}"><span>04</span>Nous contacter</a></li>
      </ul>
      <div class="overlay__mega">
        <div class="mega__group"><p class="overlay__label">Offre</p><div class="mega__inner">${P.megaOffre(ctx)}</div></div>
        <div class="mega__group"><p class="overlay__label">Cas d’usage</p><div class="mega__inner">${P.megaCas(ctx)}</div></div>
      </div>
    </div>
  </div>
</header>`;
};

V.footer = (ctx) => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><img src="${ctx.img('brand/logo-blanc.png')}" alt="Scoaché" width="140" height="39"><p>Coaching de dirigeant & formations. Paris — et partout à distance.</p></div>
      ${P.footerLinks(ctx)}
      <div class="foot-col"><p class="foot-col__title">Contact</p>${P.coordinates(ctx)}</div>
    </div>
    <div class="footer-legal"><span>© 2026 Scoaché</span><a href="#">Mentions légales</a><a href="#">Cookies</a><a href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">Certificat Qualiopi ↗</a><a href="${ctx.C.site.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a></div>
  </div>
</footer>`;

V.pageHero = (ctx, o) => {
  if (o.statement) {
    return `
<section class="page-hero page-hero--statement">
  <div class="container">
    ${P.crumbs(ctx, o.crumbs)}
    <p class="eyebrow"><span class="eyebrow__num">01</span>${o.eyebrow} — Pourquoi se faire coacher</p>
    <p class="statement statement--hero">${o.statement}</p>
  </div>
</section>`;
  }
  const actions = (o.actions || []).map(([l, h, c]) => P.btn(l, h, c || 'btn--primary')).join('');
  return `
<section class="page-hero${o.image ? ' page-hero--media' : ''}">
  ${o.image ? `<figure class="page-hero__media"><img src="${ctx.img(o.image)}" alt=""></figure>` : ''}
  <div class="container page-hero__inner">
    ${P.crumbs(ctx, o.crumbs)}
    <p class="eyebrow">${o.eyebrow}</p>
    <h1 class="h1">${o.title}</h1>
    ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </div>
</section>`;
};

// Cartes « Three ways in » : la dernière en crème
const scaleCardV3 = (ctx, s) => {
  const list = P.casesOf(ctx.C, s.slug);
  return `
<article class="way way--${s.slug}">
  <a class="way__link" href="${ctx.href('scale:' + s.slug)}">
    <p class="way__kicker">${s.name} · ${list.length} cas</p>
    <h3 class="way__title">${s.short}.</h3>
    <ul class="way__list">${list.slice(0, 3).map((c) => `<li>${c.short}</li>`).join('')}</ul>
    <span class="way__more">Découvrir ${P.icons.arrow}</span>
  </a>
</article>`;
};

const formationRows = (ctx, only) => `
<ol class="rows">
  ${(only || ctx.C.formations).map((f) => {
    const i = ctx.C.formations.indexOf(f);
    return `
  <li class="row">
    <a href="${ctx.href('formation:' + f.slug)}">
      <span class="row__num">${n2(i + 1)}</span>
      <span class="row__title">${f.name}</span>
      <span class="row__meta">4 – 10 h · Qualiopi</span>
      <span class="row__arrow">${P.icons.arrow}</span>
      <img class="row__img" src="${ctx.img(f.image)}" alt="" loading="lazy">
    </a>
  </li>`;
  }).join('')}
</ol>`;

V.parts = {
  scaleCard: scaleCardV3,
  scaleCards: (ctx) => `<div class="ways">${ctx.C.scales.map((s) => scaleCardV3(ctx, s)).join('')}</div>`,
  formationGrid: (ctx) => formationRows(ctx),
  formationCard: (ctx, f) => formationRows(ctx, [f]),
  ctaBlock: (ctx, o = {}) => `
<section class="cta" id="contact">
  <div class="container">
    <p class="eyebrow">Nous contacter</p>
    <h2 class="cta__giant">${o.title ? o.title.replace(/\.$/, '') : 'Parlons de votre prochain cap'}<span>.</span></h2>
    <div class="cta__row">
      <p class="lead">${o.text || 'Un premier échange de 30 minutes, sans engagement, pour comprendre ce qui se joue et vous dire honnêtement si nous pouvons aider.'}</p>
      <div class="cta__links">
        <a class="cta__mail" href="mailto:${ctx.C.site.email}">${ctx.C.site.email}</a>
        ${P.btn(o.label || 'Nous contacter', ctx.href('contact'))}
      </div>
    </div>
  </div>
</section>`,
};

V.home = (ctx) => {
  const { C } = ctx;
  const hiNames = ['ManoMano', 'Schoolab', 'Jobteaser', 'Groupe Nice-Matin'];
  const logoFor = Object.fromEntries(C.clientLogos.map(([f, n]) => [n, f]));
  return `
<section class="hero" id="intro">
  <figure class="hero__photo"><img src="${ctx.img('photos/hero-3.jpg')}" alt=""></figure>
  <div class="hero__inner">
    <h1 class="hero__title">
      <span class="hero__line rise">Franchir</span>
      <span class="hero__line hero__line--indent rise-2"><small class="hero__by">Coaching de dirigeant<br>par Ilana Porteret</small>le cap</span>
      <span class="hero__line rise-3">qui compte.</span>
    </h1>
    <a class="hero__scroll" href="#preuves">Défiler pour découvrir</a>
  </div>
</section>

<section class="section proof" id="preuves">
  <div class="container">
    <p class="proof__text">${C.site.googleRating} sur Google. ${C.site.satisfaction} de satisfaction. Des dirigeants qui franchissent leurs caps — seuls, en équipe, à l’échelle.</p>
    <img class="proof__float proof__float--1" src="${ctx.img('photos/hero-4.jpg')}" alt="" loading="lazy">
    <img class="proof__float proof__float--2" src="${ctx.img('formations/prise-de-parole.png')}" alt="" loading="lazy">
    <img class="proof__float proof__float--3" src="${ctx.img('photos/hero-2.jpg')}" alt="" loading="lazy">
  </div>
</section>

<section class="section clients" aria-label="Ils nous font confiance">
  <div class="container clients__inner">
    <p class="clients__label">Ils nous font confiance</p>
    <ul class="clients__list">
      ${C.clientNames.map((n) => `<li${hiNames.includes(n) ? ' class="is-hi"' : ''}><span>${n}</span>${logoFor[n] ? `<img src="${ctx.img('clients/' + logoFor[n] + '.png')}" alt="" loading="lazy">` : ''}</li>`).join('')}
    </ul>
  </div>
</section>

<section class="section approach" id="approche">
  <div class="container">
    <div class="approach__head">
      <p class="eyebrow">Notre approche — La Méthode Scoaché ©</p>
      <h2 class="approach__title">${C.method.pillars.map((p, i) => `<span${i % 2 ? ' class="is-accent"' : ''}>${p.key}.</span>`).join(' ')}</h2>
      <a class="link" href="${ctx.href('apropos', '#methode')}">Toute la méthode ${P.icons.out}</a>
    </div>
    <div class="approach__photos">${['photos/hero-3.jpg', 'photos/hero-4.jpg', 'formations/prise-de-parole.png', 'photos/hero-2.jpg'].map((src) => `<img src="${ctx.img(src)}" alt="" loading="lazy">`).join('')}</div>
    <ol class="approach__cols">${C.method.pillars.map((p, i) => `<li><span>${n2(i + 1)}</span><h3>${p.key}</h3><p>${p.text}</p></li>`).join('')}</ol>
  </div>
</section>

<div class="band" aria-hidden="true"><div class="band__track">${'<span>Franchir le cap</span><span>Prendre de l’altitude</span><span>Décider sans se perdre</span><span>Refaire équipe</span>'.repeat(2)}</div><div class="band__track">${'<span>Franchir le cap</span><span>Prendre de l’altitude</span><span>Décider sans se perdre</span><span>Refaire équipe</span>'.repeat(2)}</div></div>

<section class="expertise" id="offre">
  <div class="container expertise__inner">
    <div class="expertise__head">
      <p class="eyebrow">Le cœur de l’offre</p>
      <h2 class="expertise__title">Le coaching de dirigeant</h2>
      ${P.btn('Voir l’offre', ctx.href('offre'), 'btn--dark')}
    </div>
    <div class="expertise__grid">
      ${C.scales.map((s) => `
      <a class="expertise__item" href="${ctx.href('scale:' + s.slug)}">
        <span class="expertise__ico">${P.scaleIcon[s.slug]}</span>
        <h3>${s.name}</h3>
        <ul>${s.who.map((w) => `<li>${w}</li>`).join('')}</ul>
      </a>`).join('')}
      <a class="expertise__item" href="${ctx.href('formations')}">
        <span class="expertise__ico">${P.icons.shield}</span>
        <h3>Formations</h3>
        <ul>${C.formations.map((f) => `<li>${f.name}</li>`).join('')}</ul>
      </a>
    </div>
  </div>
</section>

<section class="section" id="cas">
  <div class="container">
    <p class="eyebrow">Cas d’usage</p>
    <h2 class="h2">Trois échelles. Quinze cas.</h2>
    ${V.parts.scaleCards(ctx)}
    <p class="sec-foot">${P.btn('Les 15 cas d’usage', ctx.href('cas'), 'btn--ghost')}</p>
  </div>
</section>

<section class="section section--formations" id="formations">
  <div class="container">
    <div class="sec-split">
      <div><p class="eyebrow">Catalogue formations</p><h2 class="h2">Certifiées Qualiopi.</h2></div>
      <p class="lead">Quatre parcours individualisés de 4 à 10 h, mêlant coaching et formation. Finançables par votre OPCO.</p>
    </div>
    ${formationRows(ctx)}
  </div>
</section>

<section class="section section--quotes">
  <div class="container">
    <p class="eyebrow">Ils en parlent</p>
    ${P.testimonialSlider(ctx)}
  </div>
</section>

<section class="section section--q">
  <div class="container">${P.qualiopi(ctx)}</div>
</section>

${V.parts.ctaBlock(ctx)}`;
};

module.exports = V;
