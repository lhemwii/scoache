// Proposition 4 — « Signature » : une DA tirée du logo Scoaché lui-même.
// Capitales condensées comme le logotype, mots posés dans des blocs (le « S » encadré),
// l’accent du « É » devenu motif en biais, aplats framboise / bleu, photos en duotone, grille suisse.
const P = require('../parts');

const V = {
  id: 'v4', dir: 'v4-signature', label: 'Signature', inspiration: 'le logo Scoaché',
  css: 'v4.css',
  mood: 'Identitaire · graphique · reconnaissable',
  type: 'Barlow Condensed + Barlow',
  pitch: 'La DA découle du logo : capitales condensées comme le logotype, mots posés dans des blocs comme le « S », l’accent du « É » devenu motif en biais. Aplats framboise et bleu, photos en duotone (déjà présent sur le site actuel), grille suisse à filets noirs.',
  pros: 'La plus propriétaire : on la reconnaît sans voir le logo. Elle donne enfin un système graphique à la marque.',
  watch: 'Très graphique : elle demande de la discipline dans la production des visuels (duotones, blocs).',
  palette: [['#F5F3EE', 'Papier'], ['#121214', 'Encre'], ['#C8325E', 'Framboise'], ['#2E47C4', 'Bleu'], ['#F2C9D4', 'Rose']],
  fonts: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600&display=swap',
};

const n2 = (i) => String(i).padStart(2, '0');
const slash = '<span class="slash" aria-hidden="true"></span>';
const duo = (ctx, src, tone = 'blue', cls = '') => `<figure class="duo duo--${tone} ${cls}"><img src="${ctx.img(src)}" alt="" loading="lazy"></figure>`;

V.header = (ctx) => `
<header class="site-header" data-header>
  <div class="container">${P.navBar(ctx)}</div>
</header>`;

V.footer = (ctx) => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <p class="footer-claim">Franchir le cap<br><span>qui compte.</span></p>
      ${P.btn('Nous contacter', ctx.href('contact'), 'btn--accent')}
    </div>
    <div class="footer-grid">
      ${P.footerLinks(ctx)}
      <div class="foot-col"><p class="foot-col__title">Contact</p>${P.coordinates(ctx)}</div>
      <div class="foot-col"><p class="foot-col__title">Certifié Qualiopi</p><p>Actions de formation et bilans de compétences. Formations finançables par votre OPCO.</p><a class="foot-q" href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">Le certificat ↗</a></div>
    </div>
    <img class="footer-logo" src="${ctx.img('brand/logo-blanc.png')}" alt="Scoaché" width="1198" height="332" loading="lazy">
    <div class="footer-legal"><span>© 2026 Scoaché</span><a href="#">Mentions légales</a><a href="#">Cookies</a><a href="${ctx.C.site.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a></div>
  </div>
</footer>`;

V.pageHero = (ctx, o) => {
  if (o.statement) {
    return `
<section class="page-hero page-hero--statement">
  <div class="container">
    ${P.crumbs(ctx, o.crumbs)}
    <p class="label">${o.eyebrow} · Pourquoi se faire coacher</p>
    <p class="statement statement--hero rise">${o.statement}</p>
  </div>
</section>`;
  }
  const actions = (o.actions || []).map(([l, h, c]) => P.btn(l, h, c || 'btn--primary')).join('');
  const tone = o.scale ? ({ blue: 'blue', rose: 'rose', violet: 'ink' })[o.scale.color] : 'blue';
  return `
<section class="page-hero${o.image ? ' page-hero--media' : ''}">
  <div class="container page-hero__inner">
    <div class="page-hero__text">
      ${P.crumbs(ctx, o.crumbs)}
      <p class="label rise">${o.eyebrow}</p>
      <h1 class="h1 rise-2">${o.title}</h1>
      ${o.lead ? `<p class="lead rise-3">${o.lead}</p>` : ''}
      ${actions ? `<div class="actions rise-4">${actions}</div>` : ''}
    </div>
    ${o.image ? duo(ctx, o.image, tone, 'page-hero__media') : ''}
  </div>
</section>`;
};

// Échelles : trois colonnes séparées par des filets, qui se remplissent au survol
const scaleCol = (ctx, s, i) => `
<article class="col col--${s.color}">
  <a class="col__link" href="${ctx.href('scale:' + s.slug)}">
    <span class="col__num">${n2(i + 1)}</span>
    <h3 class="col__title">${s.name}</h3>
    <p class="col__short">${s.short}</p>
    <p class="col__text">${s.promise}</p>
    <ul class="col__list">${s.who.slice(0, 3).map((w) => `<li>${w}</li>`).join('')}</ul>
    <span class="col__more">${P.casesOf(ctx.C, s.slug).length} cas d’usage ${P.icons.arrow}</span>
  </a>
</article>`;

// Formations : tableau à filets
const formationTable = (ctx, only) => `
<div class="ftable" role="list">
  <div class="ftable__head" aria-hidden="true"><span>N°</span><span>Formation</span><span>Objectif</span><span>Durée</span><span></span></div>
  ${(only || ctx.C.formations).map((f) => {
    const i = ctx.C.formations.indexOf(f);
    return `<a class="ftable__row ftable__row--${f.color}" role="listitem" href="${ctx.href('formation:' + f.slug)}"><span class="ftable__num">${n2(i + 1)}</span><span class="ftable__name">${f.name}</span><span class="ftable__obj">${f.objective}</span><span class="ftable__dur">4 – 10 h</span><span class="ftable__go">${P.icons.arrow}</span></a>`;
  }).join('')}
</div>`;

V.parts = {
  scaleCard: (ctx, s) => scaleCol(ctx, s, ctx.C.scales.indexOf(s)),
  scaleCards: (ctx) => `<div class="cols">${ctx.C.scales.map((s, i) => scaleCol(ctx, s, i)).join('')}</div>`,
  formationGrid: (ctx) => formationTable(ctx),
  formationCard: (ctx, f) => formationTable(ctx, [f]),
  ctaBlock: (ctx, o = {}) => `
<section class="cta">
  <div class="container cta__inner">
    ${slash}
    <h2 class="cta__title">${(o.title || 'Parlons de votre situation.').replace(/(\S+)\.$/, '<mark>$1</mark>.')}</h2>
    <div class="cta__side">
      <p>${o.text || 'Un premier échange de 30 minutes, sans engagement, pour comprendre ce qui se joue et vous dire honnêtement si nous pouvons aider.'}</p>
      <div class="actions">${P.btn(o.label || 'Nous contacter', ctx.href('contact'), 'btn--accent')}<a class="cta__phone" href="${ctx.C.site.phoneHref}">${P.icons.phone}<span>${ctx.C.site.phone}</span></a></div>
    </div>
  </div>
</section>`,
};

V.home = (ctx) => {
  const { C } = ctx;
  return `
<section class="hero">
  <div class="hero__grid">
    <div class="hero__block">
      ${slash}
      <p class="label label--light rise">Coaching de dirigeant · Paris</p>
      <h1 class="hero__title rise-2"><span>Franchir</span> <span><mark>le cap</mark></span> <span>qui compte.</span></h1>
      <p class="hero__lead rise-3">Prise de poste, décision qui divise, équipe à réaligner : Scoaché accompagne dirigeants, CODIR et organisations avec une méthode 100 % adaptative, entre coaching et formation.</p>
      <div class="actions rise-4">${P.btn('Le coaching de dirigeant', ctx.href('coaching'), 'btn--ink')}${P.btn('Nous contacter', ctx.href('contact'), 'btn--outline-light', null)}</div>
    </div>
    ${duo(ctx, 'photos/hero-3.jpg', 'blue', 'hero__photo')}
  </div>
  <div class="container">
    <dl class="kpis">
      <div><dt>Note Google</dt><dd data-countup>${C.site.googleRating}</dd><p>${C.site.googleReviews}</p></div>
      <div><dt>Satisfaction 2025</dt><dd data-countup>${C.site.satisfaction}</dd><p>sur nos formations</p></div>
      <div><dt>Cas d’usage</dt><dd data-countup>${C.cases.length}</dd><p>racontés de près</p></div>
      <div><dt>Échelles</dt><dd data-countup>3</dd><p>du tête-à-tête à l’organisation</p></div>
    </dl>
  </div>
</section>

<section class="section section--logos" aria-label="Ils nous font confiance">
  <div class="container logos-row"><p class="label">Ils nous font confiance</p>${P.logoMarquee(ctx)}</div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-index"><span>01</span><p class="label">Le coaching de dirigeant</p></div>
    <h2 class="h2">Trois échelles.<br><mark>Une méthode.</mark></h2>
    ${V.parts.scaleCards(ctx)}
  </div>
</section>

<section class="section section--blue">
  <div class="container">
    <div class="sec-index sec-index--light"><span>02</span><p class="label label--light">Cas d’usage</p></div>
    <div class="sec-split">
      <h2 class="h2">Votre situation<br>a déjà un nom.</h2>
      <p class="lead">Quinze situations réelles, racontées de près — contexte, objectif, dispositif, résultat. Choisissez celle qui vous ressemble.</p>
    </div>
    ${P.situationPicker(ctx, { media: false })}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-index"><span>03</span><p class="label">La Méthode Scoaché ©</p></div>
    <div class="sec-split">
      <h2 class="h2">Plus besoin de choisir entre <mark>coaching</mark> et formation.</h2>
      ${P.btn('Toute la méthode', ctx.href('apropos', '#methode'), 'btn--outline')}
    </div>
    <ol class="blocks">${C.method.pillars.map((p, i) => `<li class="block block--${i}"><span class="block__num">${n2(i + 1)}</span><h3 class="block__key">${p.key}</h3><p class="block__name">${p.name}</p><p class="block__text">${p.text}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="sec-index"><span>04</span><p class="label">Formations certifiées Qualiopi</p></div>
    <div class="sec-split">
      <h2 class="h2">Quatre formations.<br>Finançables OPCO.</h2>
      ${P.btn('Le catalogue', ctx.href('formations'), 'btn--outline')}
    </div>
    ${formationTable(ctx)}
  </div>
</section>

<section class="section section--rose">
  <div class="container quotes">
    <div class="sec-index sec-index--light"><span>05</span><p class="label label--light">Ils en parlent</p></div>
    ${P.testimonialSlider(ctx)}
  </div>
</section>

<section class="section section--q">
  <div class="container">${P.qualiopi(ctx)}</div>
</section>

${V.parts.ctaBlock(ctx)}`;
};

module.exports = V;
