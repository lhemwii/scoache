// Proposition 2 — « Conseil » : la DA Scoaché passée au filtre d’un cabinet de conseil (réf. bcg.com).
// Titres serif, grands blocs arrondis bleu nuit, cartes photo à étiquettes vitrées, boutons-pastilles.
const P = require('../parts');

const V = {
  id: 'v2', dir: 'v2-conseil', label: 'Conseil', inspiration: 'bcg.com',
  css: 'v2.css',
  fonts: 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&family=Instrument+Sans:wght@400;500;600;700&display=swap',
};

const pill = (label, href, cls = 'btn--primary', icon = P.icons.arrow) => P.btn(label, href, cls, icon);

V.header = (ctx) => `
<header class="site-header" data-header>
  <div class="container"><div class="nav-shell">${P.navBar(ctx, { logo: 'brand/logo-nuit.png' })}</div></div>
</header>`;

V.footer = (ctx) => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <p class="footer-tagline">Accompagner celles et ceux qui dirigent, quand le moment compte.</p>
      <div class="footer-links">${P.footerLinks(ctx)}</div>
      <div class="footer-help">
        <p class="footer-help__title">Comment pouvons-nous vous aider ?</p>
        <p>Dirigeant, RH ou manager : décrivez-nous votre situation, nous revenons vers vous sous 48 h.</p>
        ${pill('Nous contacter', ctx.href('contact'))}
      </div>
    </div>
    <div class="footer-bottom">
      <img src="${ctx.img('brand/logo-nuit.png')}" alt="Scoaché" width="120" height="33">
      <ul class="footer-legal"><li><a href="#">Mentions légales</a></li><li><a href="#">Cookies</a></li><li><a href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">Certificat Qualiopi</a></li><li><a href="${ctx.href('contact')}">Contact</a></li></ul>
      <p class="footer-follow">Suivre <a href="${ctx.C.site.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${P.icons.linkedin}</a></p>
    </div>
    <p class="footer-small">${ctx.C.site.address}, ${ctx.C.site.city} · ${ctx.C.site.phone} · ${ctx.C.site.email}<br>© 2026 Scoaché. Organisme de formation certifié Qualiopi au titre des actions de formation et des bilans de compétences.</p>
  </div>
</footer>`;

V.pageHero = (ctx, o) => {
  if (o.statement) {
    return `
<section class="page-hero page-hero--statement">
  <div class="container">
    ${P.crumbs(ctx, o.crumbs)}
    <p class="eyebrow">${o.eyebrow}</p>
    <p class="statement statement--hero">${o.statement}</p>
  </div>
</section>`;
  }
  const actions = (o.actions || []).map(([l, h, c]) => pill(l, h, c || 'btn--primary')).join('');
  return `
<section class="page-hero${o.image ? ' page-hero--media' : ''}">
  <div class="container page-hero__inner">
    <div class="page-hero__text">
      ${P.crumbs(ctx, o.crumbs)}
      <p class="eyebrow">${o.eyebrow}</p>
      <h1 class="h1">${o.title}</h1>
      ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
    ${o.image ? `<figure class="page-hero__media"><img src="${ctx.img(o.image)}" alt=""></figure>` : ''}
  </div>
</section>`;
};

// Cartes photo à étiquette vitrée (façon « M&A Report »)
const glassCard = (ctx, { href, img, tag, kicker, title, cls = '' }) => `
<a class="glass-card ${cls}" href="${href}">
  <img src="${ctx.img(img)}" alt="" loading="lazy">
  ${tag ? `<span class="glass-card__tag">${tag}</span>` : ''}
  <span class="glass-card__label"><small>${kicker}</small><span>${title}</span></span>
</a>`;

V.parts = {
  scaleCard: (ctx, s) => `<article class="scale-card">${glassCard(ctx, { href: ctx.href('scale:' + s.slug), img: s.image, tag: `${P.casesOf(ctx.C, s.slug).length} cas d’usage`, kicker: `Coaching · ${s.name}`, title: s.short })}</article>`,
  formationCard: (ctx, f, i) => `<article class="formation-card">${glassCard(ctx, { href: ctx.href('formation:' + f.slug), img: f.image, tag: 'Certifiée Qualiopi', kicker: `Formation ${String(i + 1).padStart(2, '0')} · 4 à 10 h`, title: f.name })}</article>`,
};
V.parts.scaleCards = (ctx) => `<div class="scale-grid">${ctx.C.scales.map((s) => V.parts.scaleCard(ctx, s)).join('')}</div>`;
V.parts.formationGrid = (ctx) => `<div class="formation-grid">${ctx.C.formations.map((f, i) => V.parts.formationCard(ctx, f, i)).join('')}</div>`;

V.home = (ctx) => {
  const { C } = ctx;
  const c = C.cases;
  const heroCards = [
    { img: 'photos/hero-4.jpg', kicker: 'Collectif', title: c[6].short, href: ctx.href('cas', `?echelle=collectif#${P.caseId(c[6], C)}`), cls: 'glass-card--sm' },
    { img: 'formations/prise-de-parole.png', kicker: 'Formation', title: 'Prise de parole en public', href: ctx.href('formation:prise-de-parole-en-public'), cls: 'glass-card--md' },
    null,
    { img: 'photos/hero-2.jpg', kicker: 'Organisation', title: c[11].short, href: ctx.href('cas', `?echelle=organisation#${P.caseId(c[11], C)}`), cls: 'glass-card--md' },
    { img: 'formations/leadership.png', kicker: 'Individuel', title: c[1].short, href: ctx.href('cas', `?echelle=individuel#${P.caseId(c[1], C)}`), cls: 'glass-card--sm' },
  ];
  return `
<section class="hero">
  <div class="container">
    <div class="hero__head">
      <h1 class="h1 h1--hero">Franchir les caps qui comptent, sans les traverser seul.</h1>
      <div class="hero__side">
        <p class="lead">Coaching de dirigeant individuel, collectif et à l’échelle de l’organisation. Une méthode 100 % adaptative, entre coaching et formation.</p>
        <div class="actions">${pill('Le coaching de dirigeant', ctx.href('coaching'))}${pill('Nous contacter', ctx.href('contact'), 'btn--ghost', null)}</div>
      </div>
    </div>
  </div>
  <div class="hero__rail">
    ${heroCards.map((h) => h ? glassCard(ctx, h) : `
    <a class="hero__feature" href="${ctx.href('coaching')}">
      <span class="hero__feature-tag">La Méthode Scoaché ©</span>
      <span class="hero__feature-title">Un objectif et des KPIs par talent. 100 % adaptative.</span>
      <span class="hero__feature-more">Découvrir ${P.icons.arrow}</span>
    </a>`).join('')}
  </div>
  <div class="container"><nav class="hero__spot" aria-label="Accès rapides"><span>À la une</span><a href="${ctx.href('scale:individuel')}">Prise de poste</a><a href="${ctx.href('scale:collectif')}">CODIR & COMEX</a><a href="${ctx.href('formations')}">Formations Qualiopi</a></nav></div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="impact">
      <h2 class="h2">Un impact mesuré, séance après séance.</h2>
      <div class="impact__side">
        <p>Chaque accompagnement part d’un objectif et d’indicateurs formulés par le talent, validés par son manager. Résultat : ${C.site.googleRating} sur Google (${C.site.googleReviews}) et ${C.site.satisfaction} ${C.site.satisfactionLabel}.</p>
        ${pill('Les cas d’usage', ctx.href('cas'))}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${P.secHead({ title: 'Le coaching de dirigeant, à trois échelles.', lead: 'Exercer sa fonction dans une situation à fort enjeu et franchir un cap : en tête-à-tête, en équipe de direction ou à l’échelle de toute l’entreprise.' })}
    ${V.parts.scaleCards(ctx)}
  </div>
</section>

<section class="section section--glacier">
  <div class="container method-feature">
    <div class="method-feature__text">
      <p class="eyebrow">La méthode en bref</p>
      <h2 class="h2">La Méthode Scoaché ©</h2>
      <p class="lead">${C.method.intro}</p>
      <ol class="method-feature__list">${C.method.pillars.map((p) => `<li><b>${p.name}</b></li>`).join('')}</ol>
      ${pill('Découvrir la méthode', ctx.href('apropos', '#methode'))}
    </div>
    <div class="spheres" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
  </div>
</section>

<section class="section">
  <div class="container duo">
    <a class="duo__card duo__card--photo" href="${ctx.href('apropos')}">
      <img src="${ctx.img('photos/hero-4.jpg')}" alt="" loading="lazy">
      <span class="duo__text"><small>À propos</small><b>Ilana Porteret, coach de dirigeants</b>${'<span class="pill-fake">Qui sommes-nous ' + P.icons.arrow + '</span>'}</span>
    </a>
    <a class="duo__card duo__card--dark" href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">
      <span class="duo__text"><small>La qualité garantie</small><b>Certifié Qualiopi, finançable par votre OPCO</b>${'<span class="pill-fake">Le certificat ' + P.icons.out + '</span>'}</span>
    </a>
  </div>
</section>

<section class="section">
  <div class="container feature-split">
    <figure class="feature-split__media"><img src="${ctx.img('photos/hero-2.jpg')}" alt="" loading="lazy"></figure>
    <div class="feature-split__text">
      <p class="eyebrow">Cas d’usage</p>
      <h2 class="h2">Quinze situations, racontées de près.</h2>
      <ul class="feature-list">${P.featuredCases(C).map((x) => `<li><a href="${ctx.href('cas', `?echelle=${x.scale}#${P.caseId(x, C)}`)}"><small>${P.scaleOf(C, x.scale).name}</small><span>${x.title}</span></a></li>`).join('')}</ul>
      ${pill('Tous les cas d’usage', ctx.href('cas'))}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    ${P.secHead({ eyebrow: 'Ils en parlent', title: 'On dirait bien qu’on les a scoachés.' })}
    ${P.testimonialSlider(ctx)}
  </div>
</section>

<section class="careers">
  <div class="careers__text">
    <p class="eyebrow">Catalogue formations</p>
    <h2 class="h2">Quatre formations, certifiées Qualiopi.</h2>
    <ul class="careers__list">${C.formations.map((f) => `<li><a href="${ctx.href('formation:' + f.slug)}">${f.name}${P.icons.arrow}</a></li>`).join('')}</ul>
    <div class="actions">${pill('Voir le catalogue', ctx.href('formations'), 'btn--ghost', P.icons.arrow)}${pill('Demander un devis', ctx.href('contact'))}</div>
  </div>
  <div class="careers__art"><figure><img src="${ctx.img('formations/communication-impactante.png')}" alt="" loading="lazy"></figure></div>
</section>

${ctaV2(ctx)}`;
};

const ctaV2 = (ctx, o = {}) => `
<section class="cta">
  <div class="cta__panel">
    <div class="cta__text">
      <p class="eyebrow">Nous contacter</p>
      <h2 class="h2">${o.title || 'Parlons de votre situation.'}</h2>
    </div>
    <figure class="cta__media"><img src="${ctx.img('photos/hero-3.jpg')}" alt="" loading="lazy"></figure>
    <div class="cta__bar">
      <p>${o.text || 'Un premier échange de 30 minutes, sans engagement, pour comprendre ce qui se joue.'}</p>
      <div class="cta__bar-actions">
        <a class="cta__phone" href="${ctx.C.site.phoneHref}">${P.icons.phone}<span>${ctx.C.site.phone}</span></a>
        ${pill(o.label || 'Nous contacter', ctx.href('contact'))}
      </div>
    </div>
  </div>
</section>`;
V.parts.ctaBlock = ctaV2;

module.exports = V;
