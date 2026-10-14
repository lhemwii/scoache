// Proposition 5 — « Sérénité » : chaleureuse et humaine, dans l’esprit des plateformes de coaching
// haut de gamme (réf. betterup.com) : arches, halos pastel, ton rassurant, parcours guidé.
const P = require('../parts');

const V = {
  id: 'v5', dir: 'v5-serenite', label: 'Sérénité', inspiration: 'betterup.com',
  css: 'v5.css',
  mood: 'Humain · chaleureux · rassurant',
  type: 'Bricolage Grotesque + Figtree',
  pitch: 'Le point de vue de la personne coachée : un ton qui rassure, des photos en arches, des halos rose et lavande, des formes douces. Le site guide pas à pas, de « Quelle est votre situation ? » à la prise de contact. Le rouge devient une framboise douce, le bleu une lavande.',
  pros: 'La plus chaleureuse : elle parle autant au dirigeant qu’à la personne accompagnée, et le parcours est très guidé.',
  watch: 'Moins « corporate » : à équilibrer pour les achats grands comptes (preuves, logos, Qualiopi bien visibles).',
  palette: [['#FBF8F4', 'Lin'], ['#2A2233', 'Prune'], ['#C94B70', 'Framboise douce'], ['#F6DDE5', 'Rose thé'], ['#DEE2FA', 'Lavande']],
  fonts: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Figtree:wght@400;500;600;700&display=swap',
};

const arch = (ctx, src, cls = '') => `<figure class="arch ${cls}"><img src="${ctx.img(src)}" alt="" loading="lazy"></figure>`;
const squiggle = '<svg class="squiggle" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true"><path d="M2 12 C 40 2, 70 18, 110 9 S 180 2, 220 10 S 280 16, 298 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';

V.header = (ctx) => `
<header class="site-header" data-header>
  <div class="container">${P.navBar(ctx, { logo: 'brand/logo-prune.png' })}</div>
</header>`;

V.footer = (ctx) => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="${ctx.img('brand/logo-prune.png')}" alt="Scoaché" width="132" height="37">
        <p>On n’a pas à franchir les caps qui comptent tout seul. Coaching de dirigeant & formations, à Paris et à distance.</p>
        <a class="footer-social" href="${ctx.C.site.linkedin}" target="_blank" rel="noopener" aria-label="Scoaché sur LinkedIn">${P.icons.linkedin}</a>
      </div>
      ${P.footerLinks(ctx)}
      <div class="foot-col"><p class="foot-col__title">Nous joindre</p>${P.coordinates(ctx)}</div>
    </div>
    <div class="footer-legal"><span>© 2026 Scoaché</span><a href="#">Mentions légales</a><a href="#">Cookies</a><a href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">Certificat Qualiopi</a></div>
  </div>
</footer>`;

V.pageHero = (ctx, o) => {
  if (o.statement) {
    return `
<section class="page-hero page-hero--statement">
  <div class="glow" aria-hidden="true"></div>
  <div class="container">
    ${P.crumbs(ctx, o.crumbs)}
    <p class="pill-label rise">${o.eyebrow} · Pourquoi se faire coacher</p>
    <p class="statement statement--hero rise-2">${o.statement}</p>
  </div>
</section>`;
  }
  const actions = (o.actions || []).map(([l, h, c]) => P.btn(l, h, c || 'btn--primary')).join('');
  return `
<section class="page-hero${o.image ? ' page-hero--media' : ''}">
  <div class="glow" aria-hidden="true"></div>
  <div class="container page-hero__inner">
    <div class="page-hero__text">
      ${P.crumbs(ctx, o.crumbs)}
      <p class="pill-label rise">${o.eyebrow}</p>
      <h1 class="h1 rise-2">${o.title}</h1>
      ${o.lead ? `<p class="lead rise-3">${o.lead}</p>` : ''}
      ${actions ? `<div class="actions rise-4">${actions}</div>` : ''}
    </div>
    ${o.image ? arch(ctx, o.image, 'page-hero__media rise-3') : ''}
  </div>
</section>`;
};

V.parts = {
  scaleCard: (ctx, s) => `
<article class="scale-card scale-card--${s.color}">
  <a class="scale-card__link" href="${ctx.href('scale:' + s.slug)}">
    ${arch(ctx, s.image, 'scale-card__media')}
    <div class="scale-card__body">
      <p class="scale-card__kicker">${P.scaleIcon[s.slug]}<span>${s.name}</span></p>
      <h3 class="h3">${s.short}</h3>
      <p class="scale-card__text">${s.promise}</p>
      <p class="scale-card__more"><span>${P.casesOf(ctx.C, s.slug).length} cas d’usage</span>${P.icons.arrow}</p>
    </div>
  </a>
</article>`,
  ctaBlock: (ctx, o = {}) => `
<section class="cta">
  <div class="container">
    <div class="cta__card">
      <div class="cta__orbs" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="pill-label">Premier échange offert</p>
      <h2 class="h2">${o.title || 'Et si on en parlait ?'}</h2>
      <p class="lead">${o.text || 'Trente minutes, sans engagement, pour comprendre ce qui se joue — et vous dire honnêtement si nous pouvons vous aider.'}</p>
      <div class="actions">${P.btn(o.label || 'Prendre rendez-vous', ctx.href('contact'))}<a class="btn btn--ghost" href="${ctx.C.site.phoneHref}">${P.icons.phone}<span>${ctx.C.site.phone}</span></a></div>
    </div>
  </div>
</section>`,
};
V.parts.scaleCards = (ctx) => `<div class="scale-grid">${ctx.C.scales.map((s) => V.parts.scaleCard(ctx, s)).join('')}</div>`;

V.home = (ctx) => {
  const { C } = ctx;
  return `
<section class="hero">
  <div class="glow glow--hero" aria-hidden="true"></div>
  <div class="container hero__inner">
    <p class="pill-label rise">${P.icons.star}<span><b>${C.site.googleRating}</b> sur Google · ${C.site.googleReviews}</span></p>
    <h1 class="h1 h1--hero rise-2">Vous n’avez pas à franchir ce cap <span class="hl">seul·e${squiggle}</span>.</h1>
    <p class="lead rise-3">Prise de poste, décision qui divise, équipe à réaligner : Scoaché accompagne dirigeants, équipes de direction et organisations, avec une méthode 100 % adaptative entre coaching et formation.</p>
    <div class="actions rise-4">${P.btn('Trouver mon accompagnement', '#situation')}${P.btn('Nous contacter', ctx.href('contact'), 'btn--ghost', null)}</div>
  </div>
  <div class="container hero__arches rise-4">
    <div class="hero__arch hero__arch--1">${arch(ctx, 'photos/hero-4.jpg')}<span class="chip-float chip-float--rose">CODIR recomposé</span></div>
    <div class="hero__arch hero__arch--2">${arch(ctx, 'photos/hero-3.jpg')}<span class="chip-float">Prise de poste</span></div>
    <div class="hero__arch hero__arch--3">${arch(ctx, 'photos/hero-2.jpg')}<span class="chip-float chip-float--lav">Culture du feedback</span></div>
  </div>
</section>

<section class="section section--logos" aria-label="Ils nous font confiance">
  <p class="logos-label">Ils nous ont confié leurs dirigeants et leurs managers</p>
  ${P.logoMarquee(ctx)}
</section>

<section class="section section--picker" id="situation">
  <div class="container">
    ${P.secHead({ eyebrow: 'Le coaching de dirigeant', title: 'Quelle est votre situation ?', lead: 'Trois échelles, une même méthode. Choisissez ce qui vous ressemble : on vous montre comment on l’aborde, et des cas concrets.', cls: 'sec-head--center' })}
    ${P.situationPicker(ctx)}
  </div>
</section>

<section class="section">
  <div class="container">
    ${P.stats(C)}
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    ${P.secHead({ eyebrow: 'La méthode en bref', title: 'Comment ça se passe, concrètement.', lead: C.method.intro })}
    <ol class="journey">${C.method.pillars.map((p, i) => `<li class="journey__step"><span class="journey__dot">${i + 1}</span><p class="journey__key">${p.key}</p><h3 class="h4">${p.name}</h3><p>${p.text}</p></li>`).join('')}</ol>
    <figure class="coach-quote">
      <span class="coach-quote__avatar" aria-hidden="true">IP</span>
      <blockquote>« ${C.coach.quote} »</blockquote>
      <figcaption>${C.coach.name} · ${C.coach.role} — <a href="${ctx.href('apropos')}">en savoir plus</a></figcaption>
    </figure>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-row">
      ${P.secHead({ eyebrow: 'Cas d’usage', title: 'Ils sont passés par là.' })}
      ${P.btn('Les 15 cas d’usage', ctx.href('cas'), 'btn--ghost')}
    </div>
    ${P.caseGrid(ctx, P.featuredCases(C))}
  </div>
</section>

<section class="section section--rose">
  <div class="container">
    ${P.secHead({ eyebrow: 'Ils en parlent', title: 'On dirait bien qu’on les a scoachés.', cls: 'sec-head--center' })}
    ${P.testimonialSlider(ctx)}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-row">
      ${P.secHead({ eyebrow: 'Formations certifiées Qualiopi', title: 'Se former, à son rythme.', lead: 'Quatre parcours individualisés de 4 à 10 h, finançables par votre OPCO.' })}
      ${P.btn('Voir le catalogue', ctx.href('formations'), 'btn--ghost')}
    </div>
    ${P.formationGrid(ctx)}
    <div class="q-card">${P.qualiopi(ctx)}</div>
  </div>
</section>

${V.parts.ctaBlock(ctx)}`;
};

module.exports = V;
