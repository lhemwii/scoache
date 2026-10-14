// Proposition 1 — « Évolution » : on repart du site actuel et on le modernise.
// Même grammaire (fond blanc, Graphik-like, cartes à liseré de couleur, bouton noir),
// rouge et bleu adoucis, plus d’air, la nouvelle arborescence.
const P = require('../parts');

const V = {
  id: 'v1', dir: 'v1-evolution', label: 'Évolution', inspiration: 'scoache.com',
  css: 'v1.css',
  mood: 'Familier · rassurant · continuité',
  type: 'Hanken Grotesk',
  pitch: 'On garde ce qui marche sur le site actuel — fond blanc, cartes à liseré de couleur, bouton noir, bandeau Qualiopi — et on modernise : plus d’air, typographie plus fine, photos plus grandes, sélecteur « Quelle est votre situation ? » et la nouvelle arborescence.',
  pros: 'Continuité totale avec le site actuel : aucune rupture pour les clients, et la migration la plus simple.',
  watch: 'La moins différenciante : elle reste proche d’un site d’organisme de formation.',
  palette: [['#FFFFFF', 'Blanc'], ['#16161A', 'Encre'], ['#C2385F', 'Framboise'], ['#3A52B8', 'Bleu'], ['#F6F5F2', 'Grège']],
  fonts: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap',
};

V.header = (ctx) => `
<header class="site-header" data-header>
  <p class="announce"><a href="${ctx.href('formations')}">Nos formations sont certifiées Qualiopi et finançables par votre OPCO <span>En savoir plus</span></a></p>
  <div class="container">${P.navBar(ctx)}</div>
</header>`;

V.footer = (ctx) => `
<footer class="site-footer">
  <div class="footer-band">
    <div class="container footer-band__inner">
      ${P.qualiopi(ctx, { compact: true })}
      ${P.coordinates(ctx)}
    </div>
  </div>
  <div class="footer-main">
    <div class="container footer-main__inner">
      <div class="footer-brand">
        <img src="${ctx.img('brand/logo-blanc.png')}" alt="Scoaché" width="140" height="39">
        <p>Coaching de dirigeant & formations soft skills. Paris — et partout à distance.</p>
        <a class="footer-social" href="${ctx.C.site.linkedin}" target="_blank" rel="noopener" aria-label="Scoaché sur LinkedIn">${P.icons.linkedin}</a>
      </div>
      ${P.footerLinks(ctx)}
    </div>
    <div class="container footer-legal"><span>Scoaché © 2026</span><a href="#">Mentions légales</a><a href="#">Politique de cookies</a></div>
  </div>
</footer>`;

V.pageHero = (ctx, o) => {
  if (o.statement) {
    return `
<section class="page-hero page-hero--statement">
  <div class="container">
    ${P.crumbs(ctx, o.crumbs)}
    <p class="eyebrow"><span class="eyebrow__num">01</span>${o.eyebrow} · Pourquoi se faire coacher</p>
    <p class="statement statement--hero">${o.statement}</p>
  </div>
</section>`;
  }
  const actions = (o.actions || []).map(([l, h, c]) => P.btn(l, h, c || 'btn--primary')).join('');
  return `
<section class="page-hero${o.image ? ' page-hero--media' : ''}">
  <div class="container page-hero__inner">
    <div class="page-hero__text">
      ${P.crumbs(ctx, o.crumbs)}
      <p class="eyebrow">${o.scale ? `<span class="dot dot--${o.scale.color}"></span>` : ''}${o.eyebrow}</p>
      <h1 class="h1">${o.title}</h1>
      ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
    ${o.image ? `<figure class="page-hero__media"><img src="${ctx.img(o.image)}" alt=""></figure>` : ''}
  </div>
</section>`;
};

V.home = (ctx) => {
  const { C } = ctx;
  return `
<section class="hero">
  <div class="container hero__inner">
    <div class="hero__text">
      <p class="eyebrow rise">Des dirigeants sereins. Performants. Engagés.</p>
      <h1 class="h1 h1--hero rise-2">Donnez-vous les moyens de <em>franchir le cap.</em></h1>
      <p class="lead rise-3">Mieux qu’une formation, plus qu’un coaching : Scoaché accompagne dirigeants, équipes de direction et organisations avec une méthode unique, 100 % adaptative.</p>
      <div class="actions">
        ${P.btn('Le coaching de dirigeant', ctx.href('coaching'))}
        ${P.btn('Nous contacter', ctx.href('contact'), 'btn--ghost', null)}
      </div>
      ${P.ratingBadges(C)}
    </div>
    <div class="hero__visual rise-2">
      <figure class="hero__photo"><img src="${ctx.img('photos/hero-3.jpg')}" alt="Un dirigeant réfléchit devant un mur de post-it"></figure>
      <div class="hero__float hero__float--method">
        <p class="hero__float-kicker">La Méthode Scoaché ©</p>
        <p>Un objectif et des KPIs par talent. 100 % adaptative.</p>
      </div>
      <div class="hero__float hero__float--quote">
        ${P.stars()}
        <p>« Il y aura un avant et un après dans mes prises de parole. »</p>
        <small>Lead Growth Engineer</small>
      </div>
    </div>
  </div>
</section>

<section class="section section--logos" aria-label="Ils nous font confiance">
  <p class="logos-label">Ils nous font confiance</p>
  ${P.logoMarquee(ctx)}
</section>

<section class="section">
  <div class="container">
    ${P.secHead({ eyebrow: 'Le coaching de dirigeant', title: 'Quelle est votre situation ?', lead: 'Trois échelles pour franchir un cap — seul, en équipe de direction ou à l’échelle de toute l’entreprise. Choisissez ce qui vous ressemble.' })}
    ${P.situationPicker(ctx)}
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="sec-row">
      ${P.secHead({ eyebrow: 'Cas d’usage', title: 'Ils ont franchi le cap.', lead: 'Quinze situations réelles, racontées de près : contexte, objectif, dispositif, résultat.' })}
      ${P.btn('Les 15 cas d’usage', ctx.href('cas'), 'btn--ghost')}
    </div>
    ${P.caseGrid(ctx, P.featuredCases(C))}
  </div>
</section>

<section class="section">
  <div class="container method-brief">
    <div class="method-brief__text">
      ${P.secHead({ eyebrow: 'La méthode en bref', title: 'Une méthode unique, des parcours multiples.', lead: 'Nous adaptons chaque parcours au profil, au besoin et au contexte de chacun — et de votre organisation.' })}
      <ul class="checks">
        <li>${P.icons.check}<span><b>Pour tous vos talents</b> — dirigeants, top & middle managers, seniors & juniors</span></li>
        <li>${P.icons.check}<span><b>Plusieurs formats</b> — parcours de 4, 6, 8 ou 12 sessions d’une heure</span></li>
        <li>${P.icons.check}<span><b>Un rythme adapté</b> — au contexte et aux contraintes de chacun</span></li>
      </ul>
      <p class="sec-foot">${P.btn('Découvrir notre méthode', ctx.href('apropos', '#methode'), 'btn--ghost')}</p>
    </div>
    ${P.methodPillars(ctx)}
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="sec-row">
      ${P.secHead({ eyebrow: 'Formations', title: 'Nos best-sellers, certifiés Qualiopi.', lead: 'Quatre parcours individualisés de 4 à 10 h, finançables par votre OPCO.' })}
      ${P.btn('Voir le catalogue', ctx.href('formations'), 'btn--ghost')}
    </div>
    ${P.formationGrid(ctx)}
  </div>
</section>

<section class="section">
  <div class="container">
    ${P.secHead({ eyebrow: 'Nos clients parlent de nous', title: 'On dirait bien qu’on les a scoachés !' })}
    ${P.testimonialSlider(ctx)}
  </div>
</section>

<section class="section section--alt section--qualiopi">
  <div class="container">
    ${P.secHead({ eyebrow: 'La qualité garantie', title: 'Une équipe de coachs certifiés. La certification Qualiopi.' })}
    ${P.qualiopi(ctx)}
  </div>
</section>

${P.ctaBlock(ctx)}`;
};

module.exports = V;
