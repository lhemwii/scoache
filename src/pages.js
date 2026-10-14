// Composition des pages selon la sitemap Figma (« Contenu des pages »).
// La home est propre à chaque proposition ; les pages intérieures partagent leur structure
// et prennent l’habillage (hero, cartes, blocs) de la proposition courante.
const base = require('./parts');

const sec = (inner, cls = '', id = '') => `<section class="section ${cls}"${id ? ` id="${id}"` : ''}><div class="container">${inner}</div></section>`;
const n2 = (i) => String(i).padStart(2, '0');

function render(type, slug, ctx) {
  const P = { ...base, ...(ctx.V.parts || {}) };
  ctx.P = P;
  switch (type) {
    case 'home': return ctx.V.home(ctx, P);
    case 'offre': return offre(ctx, P);
    case 'coaching': return coaching(ctx, P);
    case 'scale': return scale(ctx, P, ctx.C.scales.find((s) => s.slug === slug));
    case 'formations': return formations(ctx, P);
    case 'formation': return formation(ctx, P, ctx.C.formations.find((f) => f.slug === slug));
    case 'cas': return cas(ctx, P);
    case 'apropos': return apropos(ctx, P);
    case 'contact': return contact(ctx, P);
    default: throw new Error('Type de page inconnu : ' + type);
  }
}

function offre(ctx, P) {
  const { C } = ctx;
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: 'Offre', title: 'Deux portes d’entrée.',
      lead: 'Le coaching de dirigeant, pour traverser une situation à fort enjeu et franchir un cap. Des formations certifiées Qualiopi, pour développer une compétence précise.',
      crumbs: [['Accueil', 'home'], ['Offre']],
    }),
    sec(`
<div class="doors">
  <a class="door door--main" href="${ctx.href('coaching')}">
    <p class="door__kicker">Le cœur de l’offre</p>
    <h2 class="h2">Coaching de dirigeant</h2>
    <p>Exercer sa fonction dans une situation à fort enjeu, franchir un cap. En tête-à-tête, en équipe de direction ou à l’échelle de l’entreprise.</p>
    <ul class="door__list">${C.scales.map((s) => `<li>${P.scaleIcon[s.slug]}<span><b>${s.name}</b> — ${s.short}</span></li>`).join('')}</ul>
    <span class="door__more">Découvrir le coaching de dirigeant ${P.icons.arrow}</span>
  </a>
  <a class="door" href="${ctx.href('formations')}">
    <p class="door__kicker">Certifiées Qualiopi</p>
    <h2 class="h2">Formations</h2>
    <p>Quatre parcours de 4 à 10 h, individualisés, finançables par votre OPCO.</p>
    <ul class="door__list">${C.formations.map((f) => `<li>${P.icons.check}<span>${f.name}</span></li>`).join('')}</ul>
    <span class="door__more">Voir le catalogue ${P.icons.arrow}</span>
  </a>
</div>`),
    sec(P.secHead({ eyebrow: 'Coaching de dirigeant', title: 'Trois échelles, une même méthode.', lead: 'Formats, tarifs et financement sont détaillés dans chaque page.' }) + P.scaleCards(ctx), 'section--alt'),
    sec(P.secHead({ eyebrow: 'Formations', title: 'Quatre formations, un seul niveau d’exigence.' }) + P.formationGrid(ctx)),
    P.ctaBlock(ctx),
  ].join('\n');
}

function coaching(ctx, P) {
  const { C } = ctx;
  const formatsTable = `
<div class="compare">
  ${C.scales.map((s) => `
  <article class="compare__col compare__col--${s.color}">
    <h3 class="h4">${P.scaleIcon[s.slug]} ${s.name}</h3>
    ${P.facts(s.formats)}
    <p class="compare__price">${s.pricing}</p>
    <a class="link" href="${ctx.href('scale:' + s.slug)}">En savoir plus ${P.icons.arrow}</a>
  </article>`).join('')}
</div>`;
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: 'Coaching de dirigeant',
      title: 'Exercer sa fonction dans une situation à fort enjeu. Franchir un cap.',
      lead: 'Le cœur de notre métier : accompagner celles et ceux qui dirigent, seuls ou en équipe, quand le moment compte.',
      image: 'photos/hero-3.jpg',
      crumbs: [['Accueil', 'home'], ['Offre', 'offre'], ['Coaching de dirigeant']],
      actions: [['Parler de ma situation', ctx.href('contact')], ['Voir les cas d’usage', ctx.href('cas'), 'btn--ghost']],
    }),
    sec(`<p class="statement">${C.why}</p>`, 'section--statement'),
    sec(P.secHead({ num: '01', eyebrow: 'Trois échelles', title: 'Du tête-à-tête à toute l’organisation.' }) + P.scaleCards(ctx)),
    sec(P.secHead({ num: '02', eyebrow: 'La Méthode Scoaché ©', title: 'Plus besoin de choisir entre coaching et formation.', lead: C.method.intro }) + P.methodPillars(ctx), 'section--alt'),
    sec(P.secHead({ num: '03', eyebrow: 'Cas d’usage', title: 'Ce que ça change, concrètement.' }) + P.caseGrid(ctx, P.featuredCases(C)) + `<p class="sec-foot">${P.btn('Les 15 cas d’usage', ctx.href('cas'), 'btn--ghost')}</p>`),
    sec(P.secHead({ num: '04', eyebrow: 'Formats, tarifs, financement', title: 'Un dispositif à la mesure de la situation.' }) + formatsTable, 'section--alt'),
    sec(P.secHead({ eyebrow: 'Ils en parlent', title: 'On dirait bien qu’on les a scoachés.' }) + P.testimonialSlider(ctx)),
    P.ctaBlock(ctx),
  ].join('\n');
}

function scale(ctx, P, s) {
  const { C } = ctx;
  const list = P.casesOf(C, s.slug);
  const others = C.scales.filter((o) => o !== s);
  const t = C.testimonials[C.scales.indexOf(s) % C.testimonials.length];
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: `Coaching de dirigeant · ${s.name}`, title: s.promise, lead: s.lead, image: s.image, scale: s,
      crumbs: [['Accueil', 'home'], ['Coaching de dirigeant', 'coaching'], [s.name]],
      actions: [['Parler de ma situation', ctx.href('contact')], [`Voir les ${list.length} cas d’usage`, ctx.href('cas', `?echelle=${s.slug}`), 'btn--ghost']],
    }),
    sec(`
<div class="split">
  <div>${P.secHead({ num: '01', eyebrow: 'Pour qui', title: s.short + '.' })}
    <ul class="chips">${s.who.map((w) => `<li class="chip">${w}</li>`).join('')}</ul>
  </div>
  <div>
    <p class="eyebrow">Situations typiques</p>
    <ul class="situations">${list.map((c) => `<li><a href="${ctx.href('cas', `?echelle=${s.slug}#${P.caseId(c, C)}`)}"><span>${c.title}</span>${P.icons.arrow}</a></li>`).join('')}</ul>
  </div>
</div>`),
    sec(P.secHead({ num: '02', eyebrow: 'Le dispositif', title: 'Comment ça se passe.' }) + P.steps(s.steps), 'section--alt'),
    sec(`
<div class="split">
  <div>${P.secHead({ num: '03', eyebrow: 'Formats, tarifs, financement', title: 'Le cadre.' })}<p class="price-note">${s.pricing}</p></div>
  <div>${P.facts(s.formats)}${s.slug !== 'collectif' ? P.qualiopi(ctx, { compact: true }) : ''}</div>
</div>`),
    sec(P.quote(ctx, t, 'quote--feature'), 'section--quote'),
    sec(P.secHead({ num: '04', eyebrow: 'Cas d’usage', title: `Les cas d’usage · ${s.name}.` }) + P.caseGrid(ctx, list) + `<p class="sec-foot">${P.btn(`Lire les ${list.length} cas en détail`, ctx.href('cas', `?echelle=${s.slug}`), 'btn--ghost')}</p>`, 'section--alt'),
    sec(P.secHead({ eyebrow: 'Les autres échelles' }) + `<div class="scale-grid scale-grid--2">${others.map((o) => P.scaleCard(ctx, o)).join('')}</div>`),
    P.ctaBlock(ctx),
  ].join('\n');
}

function formations(ctx, P) {
  const { C } = ctx;
  const F = C.sharedFormation;
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: '01 · Formations', title: 'Nos formations, certifiées Qualiopi.',
      lead: 'Quatre parcours individualisés de 4 à 10 h, qui mêlent coaching et formation. Tout tient sur une page : pas besoin de filtre.',
      image: 'photos/hero-5.jpg',
      crumbs: [['Accueil', 'home'], ['Offre', 'offre'], ['Formations']],
      actions: [['Demander un devis', ctx.href('contact')], ['Le certificat Qualiopi', C.site.qualiopiPdf, 'btn--ghost']],
    }),
    sec(P.secHead({ num: '02', eyebrow: 'Le catalogue', title: 'Les quatre formations.' }) + P.formationGrid(ctx)),
    sec(`
<div class="split">
  <div>${P.secHead({ num: '03', eyebrow: 'Modalités & délais d’accès', title: 'Comment ça se passe.' })}</div>
  ${P.facts([['Durée', F.duration], ['Sessions', F.sessions], ['Format', F.format], ['Public', F.audience.join(', ')], ['Prérequis', 'Aucun — entretien de positionnement en amont'], ['Délais d’accès', F.access]])}
</div>`, 'section--alt'),
    sec(`
<div class="split">
  <div>${P.secHead({ num: '04', eyebrow: 'Financement', title: 'Finançable par votre OPCO.', lead: 'Nos formations s’inscrivent dans le plan de développement des compétences de votre entreprise. Nous vous accompagnons dans le montage du dossier.' })}</div>
  ${P.steps([['Premier échange', 'Votre besoin, votre contexte, le parcours adapté.'], ['Devis & programme', 'Envoyés sous 48 h, prêts à être transmis à votre OPCO.'], ['Accord de prise en charge', 'Votre OPCO valide le financement — nous répondons à ses questions.'], ['Démarrage', 'Sous 2 à 4 semaines après accord.']])}
</div>`),
    sec(P.secHead({ num: '05', eyebrow: 'Indicateurs de résultats', title: 'Mesurés, publiés, tenus.' }) + P.stats(C), 'section--alt'),
    sec(`
<div class="split">
  <div>${P.secHead({ num: '06', eyebrow: 'Accessibilité & handicap', title: 'Une formation adaptée à chacun.' })}</div>
  <div class="prose"><p>${F.accessibility}</p><p>Référente handicap : <b>${C.coach.name}</b> — <a href="mailto:${C.site.email}">${C.site.email}</a> · <a href="${C.site.phoneHref}">${C.site.phone}</a></p></div>
</div>`),
    sec(P.secHead({ num: '07', eyebrow: 'Certificat Qualiopi' }) + P.qualiopi(ctx), 'section--alt'),
    P.ctaBlock(ctx, { title: 'Une formation à financer ?', text: 'Dites-nous qui est concerné et pour quel objectif : vous recevez le programme et le devis sous 48 h.', label: 'Demander un devis' }),
  ].join('\n');
}

function formation(ctx, P, f) {
  const { C } = ctx;
  const F = C.sharedFormation;
  const i = C.formations.indexOf(f);
  const others = C.formations.filter((o) => o !== f);
  const block = (num, title, inner, note) => `
<section class="sheet__block" id="b${num}">
  <h2 class="sheet__title"><span class="sheet__num">${n2(num)}</span>${title}${note ? `<small class="mandatory">${note}</small>` : ''}</h2>
  <div class="sheet__content">${inner}</div>
</section>`;
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: `Formation ${n2(i + 1)} · Certifiée Qualiopi`, title: f.name, lead: f.tagline, image: f.image,
      crumbs: [['Accueil', 'home'], ['Formations', 'formations'], [f.name]],
    }),
    `<section class="section"><div class="container sheet">
  <div class="sheet__main">
    ${block(1, 'Objectif', `<p class="sheet__promise">${f.objective}.</p>`)}
    ${block(2, 'Public visé & prérequis', `<ul class="chips">${F.audience.map((a) => `<li class="chip">${a}</li>`).join('')}</ul><p>${F.prerequisites}</p>`)}
    ${block(3, 'Objectifs pédagogiques', `<ol class="goals">${f.goals.map((g) => `<li>${g}</li>`).join('')}</ol>`)}
    ${block(4, 'Programme & déroulé des séances', P.steps(f.program), )}
    ${block(5, 'Durée & format', P.facts([['Durée', F.duration], ['Sessions', F.sessions], ['Format', F.format]]))}
    ${block(6, 'Modalités pédagogiques', `<ul class="chips">${F.methods.map((m) => `<li class="chip">${m}</li>`).join('')}</ul><p>Outils : ${F.tools.join(', ')}.</p>`)}
    ${block(7, 'Modalités d’évaluation', `<ul class="checks">${F.evaluation.map((e) => `<li>${P.icons.check}<span>${e}</span></li>`).join('')}</ul>`)}
    ${block(8, 'Tarif', `<p class="sheet__price">${F.price}</p><p>${F.priceNote}</p>`)}
    ${block(9, 'Délais d’accès', `<p>${F.access}</p>`)}
    ${block(10, 'Accessibilité & handicap', `<p>${F.accessibility}</p><p>Référente handicap : ${C.coach.name} — <a href="mailto:${C.site.email}">${C.site.email}</a></p>`)}
    ${block(11, 'Indicateurs de résultats', `<dl class="mini-stats">${F.indicators.map(([v, l]) => `<div><dd>${v}</dd><dt>${l}</dt></div>`).join('')}</dl>`)}
  </div>
  <aside class="sheet__aside">
    <div class="summary">
      <p class="summary__title">${f.name}</p>
      ${P.facts([['Durée', '4 h à 10 h'], ['Format', 'Présentiel ou distanciel'], ['Tarif', 'Sur devis, sous 48 h'], ['Délai', '2 à 4 semaines'], ['Financement', 'OPCO']])}
      ${P.btn('Demander un devis', ctx.href('contact'), 'btn--primary')}
      ${P.btn('Être rappelé·e', ctx.href('contact', '#formulaire'), 'btn--ghost', P.icons.phone)}
      <p class="summary__q">${P.icons.shield} Certifié Qualiopi · <a href="${C.site.qualiopiPdf}" target="_blank" rel="noopener">certificat</a></p>
    </div>
  </aside>
</div></section>`,
    sec(P.secHead({ eyebrow: 'Les autres formations' }) + `<div class="formation-grid formation-grid--3">${others.map((o) => P.formationCard(ctx, o, C.formations.indexOf(o))).join('')}</div>`, 'section--alt'),
    P.ctaBlock(ctx, { title: 'Un devis ou un rappel ?', text: 'Programme détaillé et proposition chiffrée sous 48 h. Ou un appel de 15 minutes pour vérifier que la formation répond à votre besoin.', label: 'Demander un devis' }),
  ].join('\n');
}

function cas(ctx, P) {
  const { C } = ctx;
  const verbatims = [C.testimonials[0], C.testimonials[1], C.testimonials[2]];
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: 'Cas d’usage', title: 'Quinze situations, trois échelles.',
      lead: 'Contexte, objectif, dispositif, résultat. Les cas sont rangés comme l’offre : un dirigeant venu de « Collectif » retrouve exactement ses cas.',
      crumbs: [['Accueil', 'home'], ['Cas d’usage']],
    }),
    `<section class="section section--logos" aria-label="Ils nous font confiance">${P.logoMarquee(ctx)}</section>`,
    sec(`<div class="quote-grid">${verbatims.map((t) => P.quote(ctx, t)).join('')}</div>`, 'section--alt'),
    sec(P.caseFilters(ctx) + P.caseList(ctx), 'section--cases', 'liste'),
    P.ctaBlock(ctx, { title: 'Votre situation ressemble à l’un de ces cas ?', text: 'Ou à aucun d’entre eux. Racontez-la nous : on vous dit en 30 minutes comment on l’aborderait.' }),
  ].join('\n');
}

function apropos(ctx, P) {
  const { C } = ctx;
  return [
    ctx.V.pageHero(ctx, { eyebrow: 'À propos', statement: C.why, crumbs: [['Accueil', 'home'], ['À propos']] }),
    sec(P.secHead({ num: '02', eyebrow: 'La Méthode Scoaché ©', title: '100 % adaptative. Un objectif et des KPIs par talent.', lead: C.method.intro }) + P.methodPillars(ctx), 'section--alt', 'methode'),
    sec(`
<div class="split">
  <div>${P.secHead({ num: '03', eyebrow: 'Pédagogie', title: 'Coaching, formation, et beaucoup de pratique.' })}<ul class="chips">${C.method.pedagogy.map((m) => `<li class="chip">${m}</li>`).join('')}</ul></div>
  <div>${P.secHead({ num: '04', eyebrow: 'Outils', title: 'Ici ou à distance.' })}<dl class="tools">${C.method.tools.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div>
</div>`),
    sec(`
<div class="coach">
  <figure class="coach__photo"><span class="coach__initials" aria-hidden="true">IP</span><figcaption>Portrait à venir</figcaption></figure>
  <div class="coach__text">
    <p class="eyebrow"><span class="eyebrow__num">05</span>La coach</p>
    <h2 class="h2">${C.coach.name}</h2>
    <p class="coach__role">${C.coach.role}</p>
    <p>${C.coach.bio}</p>
    <blockquote class="coach__quote">« ${C.coach.quote} »</blockquote>
    <a class="link" href="${C.site.linkedin}" target="_blank" rel="noopener">${P.icons.linkedin} Suivre Scoaché sur LinkedIn</a>
  </div>
</div>`, 'section--alt'),
    sec(P.secHead({ num: '06', eyebrow: 'Certification Qualiopi', title: 'Les critères qualité les plus exigeants.' }) + P.qualiopi(ctx)),
    sec(P.secHead({ num: '07', eyebrow: 'Les chiffres' }) + P.stats(C), 'section--alt'),
    P.ctaBlock(ctx),
  ].join('\n');
}

function contact(ctx, P) {
  const { C } = ctx;
  return [
    ctx.V.pageHero(ctx, {
      eyebrow: 'Nous contacter', title: 'Parlons de votre situation.',
      lead: 'Dirigeant, RH ou manager : décrivez-nous ce qui se joue. Premier échange de 30 minutes, sans engagement.',
      crumbs: [['Accueil', 'home'], ['Nous contacter']],
    }),
    `<section class="section" id="formulaire"><div class="container contact">
  <div class="contact__form">${P.contactForm(ctx)}</div>
  <aside class="contact__aside">
    <p class="eyebrow">Coordonnées</p>
    ${P.coordinates(ctx)}
    <div class="contact__card">
      <p><b>Vous préférez en parler de vive voix ?</b></p>
      <p>Appelez-nous du lundi au vendredi, de 9 h à 19 h.</p>
    </div>
    ${P.qualiopi(ctx, { compact: true })}
  </aside>
</div></section>`,
    sec(P.secHead({ eyebrow: 'FAQ', title: 'Questions fréquentes.' }) + P.faqList(ctx), 'section--alt'),
  ].join('\n');
}

module.exports = { render, sec };
