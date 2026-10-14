// Briques HTML partagées. Chaque proposition les habille avec sa propre feuille de style,
// et peut en remplacer certaines (voir versions/*.js → parts).

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const icons = {
  arrow: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  out: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevron: '<svg class="ico ico--chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  menu: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  close: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  pin: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  phone: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  mail: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  linkedin: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9.5v8M6.5 6.5v.01M10.5 17.5v-8m0 3.5a3.5 3.5 0 0 1 7 0v4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  person: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 20a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  people: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8.5" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16.5" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M14 14.2a4.5 4.5 0 0 1 6.5 4.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  building: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V5l8-2v17M12 9l8 2v9M3 20h18M7.5 8v.01M7.5 12v.01M7.5 16v.01M16 14v.01M16 17v.01" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  shield: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  google: '<svg class="ico ico--google" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3" fill="#4285F4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22" fill="#34A853"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z" fill="#FBBC05"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1" fill="#EA4335"/></svg>',
};
const scaleIcon = { individuel: icons.person, collectif: icons.people, organisation: icons.building };

const btn = (label, href, cls = 'btn--primary', icon = icons.arrow) =>
  `<a class="btn ${cls}" href="${href}"><span>${label}</span>${icon || ''}</a>`;

const secHead = ({ num, eyebrow, title, lead, cls = '' }) => `
<header class="sec-head ${cls}">
  ${num || eyebrow ? `<p class="eyebrow">${num ? `<span class="eyebrow__num">${num}</span>` : ''}${eyebrow || ''}</p>` : ''}
  ${title ? `<h2 class="h2">${title}</h2>` : ''}
  ${lead ? `<p class="lead">${lead}</p>` : ''}
</header>`;

const themeName = (C, slug) => (C.themes.find((t) => t.slug === slug) || {}).name;
const scaleOf = (C, slug) => C.scales.find((s) => s.slug === slug);
const casesOf = (C, scale) => C.cases.filter((c) => c.scale === scale);
const caseId = (c, C) => 'cas-' + (C.cases.indexOf(c) + 1);

// ——— Cartes ———
function scaleCard(ctx, s) {
  const n = casesOf(ctx.C, s.slug).length;
  return `
<article class="scale-card scale-card--${s.color}">
  <a class="scale-card__link" href="${ctx.href('scale:' + s.slug)}">
    <figure class="scale-card__media"><img src="${ctx.img(s.image)}" alt="" loading="lazy"></figure>
    <div class="scale-card__body">
      <p class="scale-card__kicker">${scaleIcon[s.slug]}<span>${s.name}</span></p>
      <h3 class="h3">${s.short}</h3>
      <p class="scale-card__text">${s.promise}</p>
      <p class="scale-card__more"><span>Découvrir · ${n} cas d’usage</span>${icons.arrow}</p>
    </div>
  </a>
</article>`;
}
const scaleCards = (ctx) => `<div class="scale-grid">${ctx.C.scales.map((s) => scaleCard(ctx, s)).join('')}</div>`;

function caseCard(ctx, c, { full = false } = {}) {
  const s = scaleOf(ctx.C, c.scale);
  const id = caseId(c, ctx.C);
  const href = ctx.href('cas', `?echelle=${c.scale}#${id}`);
  const tags = `<p class="case-card__tags"><span class="tag tag--${s.color}">${s.name}</span><span class="tag tag--plain">${themeName(ctx.C, c.theme)}</span></p>`;
  if (!full) {
    return `
<article class="case-card case-card--${s.color}">
  <a class="case-card__link" href="${href}">
    ${tags}
    <h3 class="h4">${c.title}</h3>
    <p class="case-card__profile">${c.profile}</p>
    <p class="case-card__more"><span>Lire le cas</span>${icons.arrow}</p>
  </a>
</article>`;
  }
  return `
<article class="case-card case-card--full case-card--${s.color}" id="${id}" data-scale="${c.scale}" data-theme="${c.theme}">
  ${tags}
  <h3 class="h4">${c.title}</h3>
  <p class="case-card__profile">${c.profile}</p>
  <details class="case-card__details" name="cas">
    <summary><span>Contexte, objectif, dispositif, résultat</span>${icons.plus}</summary>
    <dl class="case-card__dl">
      <div><dt>Contexte</dt><dd>${c.context}</dd></div>
      <div><dt>Objectif</dt><dd>${c.goal}</dd></div>
      <div><dt>Dispositif</dt><dd>${c.setup}</dd></div>
      <div><dt>Résultat</dt><dd>${c.result}</dd></div>
    </dl>
  </details>
</article>`;
}
const caseGrid = (ctx, list) => `<div class="case-grid">${list.map((c) => caseCard(ctx, c)).join('')}</div>`;
const featuredCases = (C) => [C.cases[0], C.cases[6], C.cases[12]];

function formationCard(ctx, f, i) {
  return `
<article class="formation-card formation-card--${f.color}">
  <a class="formation-card__link" href="${ctx.href('formation:' + f.slug)}">
    <figure class="formation-card__media"><img src="${ctx.img(f.image)}" alt="" loading="lazy"></figure>
    <div class="formation-card__body">
      <p class="formation-card__num">${String(i + 1).padStart(2, '0')}</p>
      <h3 class="h4">${f.name}</h3>
      <p class="formation-card__text">${f.objective}</p>
      <ul class="formation-card__meta"><li>${ctx.C.sharedFormation.duration.replace('Parcours de ', '')}</li><li>Présentiel ou distanciel</li></ul>
      <p class="formation-card__more"><span>Voir le programme</span>${icons.arrow}</p>
    </div>
  </a>
</article>`;
}
const formationGrid = (ctx) => `<div class="formation-grid">${ctx.C.formations.map((f, i) => formationCard(ctx, f, i)).join('')}</div>`;

// ——— Preuves ———
const stars = () => `<span class="stars" aria-label="5 étoiles sur 5">${icons.star.repeat(5)}</span>`;
const ratingBadges = (C) => `
<ul class="badges">
  <li class="badge">${icons.google}<span><b>${C.site.googleRating}</b> sur Google<small>${C.site.googleReviews}</small></span></li>
  <li class="badge"><b class="badge__big">${C.site.satisfaction}</b><span>${C.site.satisfactionLabel}</span></li>
</ul>`;

const stats = (C) => `
<dl class="stats">
  <div class="stat"><dt>Note Google</dt><dd>${C.site.googleRating}</dd><p>${C.site.googleReviews}</p></div>
  <div class="stat"><dt>Satisfaction 2025</dt><dd>${C.site.satisfaction}</dd><p>sur nos formations</p></div>
  <div class="stat"><dt>Cas d’usage</dt><dd>${C.cases.length}</dd><p>à trois échelles</p></div>
</dl>`;

function avatar(ctx, t) {
  if (t.photo) return `<img class="quote__avatar" src="${ctx.img(t.photo)}" alt="" loading="lazy">`;
  const initials = t.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return `<span class="quote__avatar quote__avatar--initials" aria-hidden="true">${initials}</span>`;
}
const quote = (ctx, t, cls = '') => `
<figure class="quote ${cls}">
  ${stars()}
  <blockquote><p>${t.text}</p></blockquote>
  <figcaption>${avatar(ctx, t)}<span><b>${t.name}</b><small>${t.role} · ${t.company}</small></span></figcaption>
</figure>`;

const testimonialSlider = (ctx, list = ctx.C.testimonials) => `
<div class="slider" data-slider>
  <div class="slider__track" tabindex="0" aria-label="Témoignages clients">
    ${list.map((t) => `<div class="slider__slide">${quote(ctx, t)}</div>`).join('')}
  </div>
  <div class="slider__nav">
    <button class="slider__btn" type="button" data-dir="-1" aria-label="Témoignage précédent">${icons.arrow}</button>
    <button class="slider__btn" type="button" data-dir="1" aria-label="Témoignage suivant">${icons.arrow}</button>
  </div>
</div>`;

const logoMarquee = (ctx) => {
  const items = ctx.C.clientLogos.map(([f, n]) => `<li><img src="${ctx.img('clients/' + f + '.png')}" alt="${n}" loading="lazy"></li>`).join('');
  return `<div class="marquee" aria-label="Ils nous font confiance"><ul class="marquee__track">${items}</ul><ul class="marquee__track" aria-hidden="true">${items}</ul></div>`;
};

const qualiopi = (ctx, { compact = false } = {}) => `
<div class="qualiopi${compact ? ' qualiopi--compact' : ''}">
  <img class="qualiopi__logo" src="${ctx.img('brand/qualiopi.png')}" alt="Qualiopi — processus certifié, République française" loading="lazy">
  <div class="qualiopi__text">
    <p class="qualiopi__title">Certifié Qualiopi</p>
    <p>La certification qualité a été délivrée au titre des actions de formation et des bilans de compétences. Nos formations sont finançables par votre OPCO.</p>
    <a class="link" href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">Consulter le certificat (PDF)${icons.out}</a>
  </div>
</div>`;

const methodPillars = (ctx) => `
<ol class="pillars">
  ${ctx.C.method.pillars.map((p, i) => `
  <li class="pillar">
    <p class="pillar__num">${String(i + 1).padStart(2, '0')}</p>
    <p class="pillar__key">${p.key}</p>
    <h3 class="h4">${p.name}</h3>
    <p>${p.text}</p>
  </li>`).join('')}
</ol>`;

const steps = (list) => `
<ol class="steps">
  ${list.map(([t, d], i) => `<li class="step"><span class="step__num">${String(i + 1).padStart(2, '0')}</span><h3 class="h4">${t}</h3><p>${d}</p></li>`).join('')}
</ol>`;

const facts = (list) => `<dl class="facts">${list.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

const faqList = (ctx) => `
<div class="faq">
  ${ctx.C.faq.map(([q, a], i) => `
  <details class="faq__item" name="faq"${i === 0 ? ' open' : ''}>
    <summary><span>${q}</span>${icons.plus}</summary>
    <div class="faq__answer"><p>${a}</p></div>
  </details>`).join('')}
</div>`;

const ctaBlock = (ctx, { title = 'Parlons de votre situation.', text = 'Un premier échange de 30 minutes, sans engagement, pour comprendre ce qui se joue et vous dire honnêtement si nous pouvons aider.', label = 'Nous contacter' } = {}) => `
<section class="cta">
  <div class="container cta__inner">
    <div class="cta__text">
      <h2 class="h2">${title}</h2>
      <p class="lead">${text}</p>
    </div>
    <div class="cta__actions">
      ${btn(label, ctx.href('contact'), 'btn--primary')}
      <a class="cta__phone" href="${ctx.C.site.phoneHref}">${icons.phone}<span>${ctx.C.site.phone}</span></a>
    </div>
  </div>
</section>`;

const contactForm = (ctx) => `
<form class="form" data-form novalidate>
  <fieldset class="form__group">
    <legend>Vous êtes</legend>
    <div class="choices">
      ${['Dirigeant·e', 'Responsable RH', 'Manager', 'Autre'].map((v, i) => `<label class="choice"><input type="radio" name="profil" value="${v}"${i === 0 ? ' checked' : ''}><span>${v}</span></label>`).join('')}
    </div>
  </fieldset>
  <fieldset class="form__group">
    <legend>Votre besoin</legend>
    <div class="choices">
      ${['Coaching individuel', 'Coaching collectif', 'Coaching d’organisation', 'Formation', 'Je ne sais pas encore'].map((v) => `<label class="choice"><input type="checkbox" name="besoin" value="${v}"><span>${v}</span></label>`).join('')}
    </div>
  </fieldset>
  <div class="form__row">
    <label class="field"><span>Prénom et nom</span><input name="nom" autocomplete="name" required></label>
    <label class="field"><span>Entreprise</span><input name="entreprise" autocomplete="organization"></label>
  </div>
  <div class="form__row">
    <label class="field"><span>E-mail professionnel</span><input type="email" name="email" autocomplete="email" required></label>
    <label class="field"><span>Téléphone <small>(facultatif)</small></span><input type="tel" name="tel" autocomplete="tel"></label>
  </div>
  <label class="field"><span>Votre situation, en quelques lignes</span><textarea name="message" rows="5" placeholder="Une prise de poste, une équipe à réaligner, une formation à financer…"></textarea></label>
  <div class="form__foot">
    <button class="btn btn--primary" type="submit"><span>Envoyer ma demande</span>${icons.arrow}</button>
    <p class="form__note">Réponse sous 48 h ouvrées. Vos données ne servent qu’à vous recontacter.</p>
  </div>
  <p class="form__success" role="status" hidden>Merci ! Votre message est bien parti — nous revenons vers vous sous 48 h. <small>(Maquette : aucun envoi réel.)</small></p>
</form>`;

const coordinates = (ctx) => `
<ul class="coords">
  <li>${icons.phone}<a href="${ctx.C.site.phoneHref}">${ctx.C.site.phone}</a></li>
  <li>${icons.mail}<a href="mailto:${ctx.C.site.email}">${ctx.C.site.email}</a></li>
  <li>${icons.pin}<span>${ctx.C.site.address}<br>${ctx.C.site.city}</span></li>
</ul>`;

function caseFilters(ctx) {
  const C = ctx.C;
  const scaleBtns = [`<button type="button" class="filter" data-filter="echelle" data-value="" aria-pressed="true">Toutes <small>${C.cases.length}</small></button>`]
    .concat(C.scales.map((s) => `<button type="button" class="filter filter--${s.color}" data-filter="echelle" data-value="${s.slug}" aria-pressed="false">${s.name} <small>${casesOf(C, s.slug).length}</small></button>`)).join('');
  const themeBtns = [`<button type="button" class="filter" data-filter="theme" data-value="" aria-pressed="true">Toutes</button>`]
    .concat(C.themes.map((t) => `<button type="button" class="filter" data-filter="theme" data-value="${t.slug}" aria-pressed="false">${t.name}</button>`)).join('');
  return `
<div class="filters" data-filters>
  <div class="filters__row" role="group" aria-label="Filtrer par échelle"><span class="filters__label">Échelle</span>${scaleBtns}</div>
  <div class="filters__row" role="group" aria-label="Filtrer par thématique"><span class="filters__label">Thématique</span>${themeBtns}</div>
  <p class="filters__count" aria-live="polite"><span data-count>${C.cases.length}</span> cas affichés</p>
</div>`;
}

const caseList = (ctx) => `
<div class="case-list" data-cases>
  ${ctx.C.scales.map((s) => `
  <section class="case-group" data-group="${s.slug}">
    <h2 class="case-group__title"><span>${s.name}</span><small>${casesOf(ctx.C, s.slug).length} cas</small></h2>
    <div class="case-grid case-grid--full">${casesOf(ctx.C, s.slug).map((c) => caseCard(ctx, c, { full: true })).join('')}</div>
  </section>`).join('')}
  <p class="case-empty" hidden>Aucun cas ne correspond à cette combinaison. <button type="button" class="link" data-reset>Réinitialiser les filtres</button></p>
</div>`;

// ——— Navigation (contenu des méga-menus, commun aux trois propositions) ———
const megaOffre = (ctx) => `
<div class="mega__col">
  <p class="mega__title">Coaching de dirigeant</p>
  <ul>${ctx.C.scales.map((s) => `<li><a href="${ctx.href('scale:' + s.slug)}"><b>${s.name}</b><small>${s.short}</small></a></li>`).join('')}</ul>
  <a class="mega__all" href="${ctx.href('coaching')}">Voir le coaching de dirigeant ${icons.arrow}</a>
</div>
<div class="mega__col">
  <p class="mega__title">Formations</p>
  <ul>${ctx.C.formations.map((f) => `<li><a href="${ctx.href('formation:' + f.slug)}"><b>${f.name}</b></a></li>`).join('')}</ul>
  <a class="mega__all" href="${ctx.href('formations')}">Voir le catalogue ${icons.arrow}</a>
</div>
<aside class="mega__aside">
  <p class="mega__aside-title">Certifié Qualiopi</p>
  <p>Actions de formation. Nos formations sont finançables par votre OPCO.</p>
  <a class="mega__all" href="${ctx.C.site.qualiopiPdf}" target="_blank" rel="noopener">Le certificat ${icons.out}</a>
</aside>`;

const megaCas = (ctx) => `
${ctx.C.scales.map((s) => `
<div class="mega__col">
  <p class="mega__title mega__title--${s.color}">${s.name} · ${casesOf(ctx.C, s.slug).length}</p>
  <ul>${casesOf(ctx.C, s.slug).slice(0, 3).map((c) => `<li><a href="${ctx.href('cas', `?echelle=${s.slug}#${caseId(c, ctx.C)}`)}">${c.short}</a></li>`).join('')}</ul>
  <a class="mega__all" href="${ctx.href('cas', `?echelle=${s.slug}`)}">Les ${casesOf(ctx.C, s.slug).length} cas ${icons.arrow}</a>
</div>`).join('')}
<aside class="mega__aside">
  <p class="mega__aside-title">Les ${ctx.C.cases.length} cas d’usage</p>
  <p>Contexte, objectif, dispositif, résultat — filtrables par échelle et par thématique.</p>
  <a class="mega__all" href="${ctx.href('cas')}">Tout voir ${icons.arrow}</a>
</aside>`;

// Barre de navigation « classique » avec méga-menus (propositions 1 et 2)
const navBar = (ctx, { logo, ctaCls = 'btn--primary' } = {}) => `
<nav class="nav" aria-label="Navigation principale">
  <a class="nav__logo" href="${ctx.href('home')}" aria-label="Scoaché — accueil"><img src="${ctx.img(logo || 'brand/logo-noir.png')}" alt="Scoaché" width="120" height="33"></a>
  <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" data-nav-toggle><span class="sr-only">Menu</span>${icons.menu}${icons.close}</button>
  <div class="nav__menu" id="nav-menu">
    <ul class="nav__list">
      <li class="nav__item nav__item--mega${ctx.is('offre') || ctx.is('coaching') || ctx.is('scale') || ctx.is('formations') || ctx.is('formation') ? ' is-current' : ''}">
        <button class="nav__link" type="button" aria-expanded="false" data-mega>Offre ${icons.chevron}</button>
        <div class="mega"><div class="mega__inner">${megaOffre(ctx)}</div></div>
      </li>
      <li class="nav__item nav__item--mega${ctx.is('cas') ? ' is-current' : ''}">
        <button class="nav__link" type="button" aria-expanded="false" data-mega>Cas d’usage ${icons.chevron}</button>
        <div class="mega"><div class="mega__inner">${megaCas(ctx)}</div></div>
      </li>
      <li class="nav__item${ctx.is('apropos') ? ' is-current' : ''}"><a class="nav__link" href="${ctx.href('apropos')}">À propos</a></li>
    </ul>
    <a class="btn ${ctaCls} nav__cta" href="${ctx.href('contact')}"><span>Nous contacter</span></a>
  </div>
</nav>`;

const footerLinks = (ctx) => `
<div class="foot-col"><p class="foot-col__title">Offre</p><ul>
  <li><a href="${ctx.href('coaching')}">Coaching de dirigeant</a></li>
  ${ctx.C.scales.map((s) => `<li><a href="${ctx.href('scale:' + s.slug)}">${s.name}</a></li>`).join('')}
  <li><a href="${ctx.href('formations')}">Formations</a></li>
</ul></div>
<div class="foot-col"><p class="foot-col__title">Scoaché</p><ul>
  <li><a href="${ctx.href('cas')}">Cas d’usage</a></li>
  <li><a href="${ctx.href('apropos')}">À propos</a></li>
  <li><a href="${ctx.href('apropos', '#methode')}">La Méthode Scoaché ©</a></li>
  <li><a href="${ctx.href('contact')}">Nous contacter</a></li>
</ul></div>`;

const crumbs = (ctx, list) => `<nav class="crumbs" aria-label="Fil d’Ariane"><ol>${list.map(([label, key]) => key ? `<li><a href="${ctx.href(key)}">${label}</a></li>` : `<li aria-current="page">${label}</li>`).join('')}</ol></nav>`;

module.exports = {
  esc, icons, scaleIcon, btn, secHead, themeName, scaleOf, casesOf, caseId,
  scaleCard, scaleCards, caseCard, caseGrid, featuredCases, formationCard, formationGrid,
  stars, ratingBadges, stats, avatar, quote, testimonialSlider, logoMarquee, qualiopi, methodPillars,
  steps, facts, faqList, ctaBlock, contactForm, coordinates, caseFilters, caseList,
  megaOffre, megaCas, navBar, footerLinks, crumbs,
};
