#!/usr/bin/env node
// Générateur statique des trois propositions Scoaché.
// Usage : node src/build.js  →  écrit v1-evolution/, v2-conseil/, v3-studio/ et index.html
const fs = require('fs');
const path = require('path');
const C = require('./content');
const pages = require('./pages');
const overview = require('./overview');

const ROOT = path.resolve(__dirname, '..');
const versions = [require('./versions/v1'), require('./versions/v2'), require('./versions/v3')];

const routes = [
  { key: 'home', path: '', title: 'Coaching de dirigeant' },
  { key: 'offre', path: 'offre/', title: 'Offre' },
  { key: 'coaching', path: 'coaching-de-dirigeant/', title: 'Coaching de dirigeant' },
  ...C.scales.map((s) => ({ key: 'scale:' + s.slug, path: `coaching-de-dirigeant/${s.slug}/`, title: `Coaching ${s.name.toLowerCase()}` })),
  { key: 'formations', path: 'formations/', title: 'Formations' },
  ...C.formations.map((f) => ({ key: 'formation:' + f.slug, path: `formations/${f.slug}/`, title: f.name })),
  { key: 'cas', path: 'cas-usage/', title: 'Cas d’usage' },
  { key: 'apropos', path: 'a-propos/', title: 'À propos' },
  { key: 'contact', path: 'nous-contacter/', title: 'Nous contacter' },
];
const byKey = Object.fromEntries(routes.map((r) => [r.key, r]));

function makeCtx(V, route) {
  const depth = route.path.split('/').filter(Boolean).length; // profondeur dans le dossier de version
  const up = '../'.repeat(depth);
  const ctx = {
    C, V, route, versions,
    href: (key, extra = '') => {
      const r = byKey[key];
      if (!r) throw new Error('Route inconnue : ' + key);
      return up + r.path + 'index.html' + extra;
    },
    asset: (p) => up + '../assets/' + p,
    img: (p) => up + '../assets/img/' + p,
    overview: () => up + '../index.html',
    sibling: (vdir) => up + '../' + vdir + '/' + route.path + 'index.html',
    is: (prefix) => route.key === prefix || route.key.startsWith(prefix + ':'),
  };
  return ctx;
}

function switcher(ctx) {
  const items = ctx.versions.map((v, i) => `<a href="${ctx.sibling(v.dir)}"${v.id === ctx.V.id ? ' aria-current="true"' : ''} title="${v.label} — inspirée de ${v.inspiration}"><b>${i + 1}</b><span>${v.label}</span></a>`).join('');
  return `<nav class="proposal-switch" aria-label="Changer de proposition"><a class="proposal-switch__home" href="${ctx.overview()}" title="Vue d’ensemble des propositions">Propositions</a>${items}</nav>`;
}

function shell(ctx, body) {
  const { V, route } = ctx;
  const title = route.key === 'home' ? `Scoaché — Coaching de dirigeant & formations · Paris` : `${route.title} — Scoaché`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="Scoaché accompagne dirigeants, CODIR et organisations : coaching de dirigeant individuel, collectif et à l’échelle de l’entreprise, et formations certifiées Qualiopi.">
<meta name="robots" content="noindex">
<link rel="icon" href="${ctx.img('brand/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${V.fonts}">
<link rel="stylesheet" href="${ctx.asset('css/base.css')}">
<link rel="stylesheet" href="${ctx.asset('css/' + V.css)}">
</head>
<body class="${V.id} page-${route.key.split(':')[0]}">
<a class="skip" href="#contenu">Aller au contenu</a>
${V.header(ctx)}
<main id="contenu">
${body}
</main>
${V.footer(ctx)}
${switcher(ctx)}
<script src="${ctx.asset('js/site.js')}" defer></script>
</body>
</html>
`;
}

// Typographie française : espaces fines insécables avant : ; ! ? % » et après «
const typo = (html) => html.split(/(<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>)/).map((part, i) => i % 2 ? part
  : part.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([:;!?%»])/g, '\u202f$1').replace(/« /g, '«\u202f') + '<')).join('');

function write(rel, html) {
  html = typo(html);
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

let count = 0;
for (const V of versions) {
  fs.rmSync(path.join(ROOT, V.dir), { recursive: true, force: true });
  for (const route of routes) {
    const ctx = makeCtx(V, route);
    const [type, slug] = route.key.split(':');
    const body = pages.render(type, slug, ctx);
    write(`${V.dir}/${route.path}index.html`, shell(ctx, body));
    count++;
  }
}
write('index.html', overview.render({ C, versions, routes }));
console.log(`${count} pages générées pour ${versions.length} propositions + index.html`);
