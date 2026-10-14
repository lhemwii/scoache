// Page d’accueil du dépôt : présente les propositions côte à côte (outil de présentation client).
module.exports.render = ({ C, versions }) => {
  const card = (v, i) => `
  <article class="prop" id="${v.dir}">
    <a class="prop__shot" href="${v.dir}/index.html"><img src="assets/img/previews/${v.dir}.jpg" alt="Aperçu de la proposition ${i + 1} — ${v.label}" loading="${i < 2 ? 'eager' : 'lazy'}"></a>
    <div class="prop__body">
      <p class="prop__num">Proposition ${i + 1}</p>
      <h2>${v.label}</h2>
      <p class="prop__insp">Inspirée de <b>${v.inspiration}</b> · ${v.mood}</p>
      <p>${v.pitch}</p>
      <ul class="prop__pal">${v.palette.map(([hex, n]) => `<li><span style="background:${hex}"></span><b>${n}</b><code>${hex}</code></li>`).join('')}</ul>
      <dl class="prop__eval"><div><dt>Pour</dt><dd>${v.pros}</dd></div><div><dt>Point d’attention</dt><dd>${v.watch}</dd></div></dl>
      <p class="prop__type">Typographie : ${v.type}</p>
      <a class="prop__cta" href="${v.dir}/index.html">Ouvrir la proposition →</a>
    </div>
  </article>`;
  const pages = [
    ['Home', ''], ['Offre', 'offre/'], ['Coaching de dirigeant', 'coaching-de-dirigeant/'],
    ...C.scales.map((s) => [`↳ ${s.name}`, `coaching-de-dirigeant/${s.slug}/`]),
    ['Formations — catalogue', 'formations/'],
    ...C.formations.map((f) => [`↳ ${f.name}`, `formations/${f.slug}/`]),
    ['Cas d’usage', 'cas-usage/'], ['À propos', 'a-propos/'], ['Nous contacter', 'nous-contacter/'],
  ];
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scoaché — Refonte du site</title>
<meta name="robots" content="noindex">
<link rel="icon" href="assets/img/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
<style>
  :root { --bg:#F5F3EF; --ink:#16161A; --muted:#64636B; --line:#E2DED7; --accent:#C2385F; --blue:#3A52B8; }
  * { box-sizing: border-box; } body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.6 "Hanken Grotesk", system-ui, sans-serif; -webkit-font-smoothing:antialiased; }
  img { max-width:100%; display:block; } a { color:inherit; }
  .wrap { max-width:1320px; margin:0 auto; padding:0 clamp(16px,4vw,40px); }
  header { padding:clamp(48px,7vw,96px) 0 32px; display:grid; gap:18px; }
  .kicker { font-size:13px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); margin:0; }
  h1 { font-size:clamp(40px,6vw,80px); line-height:1.02; letter-spacing:-.03em; font-weight:600; margin:0; }
  header > p { max-width:840px; color:var(--muted); font-size:clamp(17px,1.5vw,20px); margin:0; }
  .colors { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:16px 0 0; max-width:860px; }
  .colors div { display:flex; align-items:center; gap:12px; background:#fff; border-radius:14px; padding:14px; font-size:14.5px; line-height:1.35; }
  .sw { display:flex; flex:none; } .sw span { width:30px; height:30px; border-radius:50%; border:2px solid #fff; margin-left:-8px; } .sw span:first-child { margin-left:0; }
  .jump { display:flex; flex-wrap:wrap; gap:8px; margin:28px 0 0; padding:0; list-style:none; }
  .jump a { display:inline-flex; gap:8px; align-items:center; padding:10px 16px; border-radius:999px; background:#fff; border:1px solid var(--line); text-decoration:none; font-weight:600; font-size:15px; }
  .jump a:hover { border-color:var(--ink); }
  .jump b { display:grid; place-items:center; width:22px; height:22px; border-radius:50%; background:var(--ink); color:#fff; font-size:12px; }
  .props { display:grid; gap:28px; padding:24px 0 40px; }
  .prop { display:grid; grid-template-columns:1.3fr 1fr; background:#fff; border-radius:24px; overflow:hidden; border:1px solid var(--line); scroll-margin-top:24px; }
  .prop:nth-child(even) { grid-template-columns:1fr 1.3fr; } .prop:nth-child(even) .prop__shot { order:2; }
  .prop__shot { display:block; background:#ddd; overflow:hidden; aspect-ratio:16/11; }
  .prop__shot img { width:100%; height:100%; object-fit:cover; object-position:top; transition:transform .8s cubic-bezier(.2,.7,.2,1); }
  .prop__shot:hover img { transform:scale(1.03); }
  .prop__body { padding:clamp(24px,3.5vw,44px); display:grid; gap:14px; align-content:center; }
  .prop__body p { margin:0; } .prop__num { font-size:13px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
  .prop h2 { margin:0; font-size:clamp(30px,3.4vw,44px); letter-spacing:-.025em; line-height:1.05; font-weight:600; }
  .prop__insp { color:var(--muted); font-size:15px; }
  .prop__pal { list-style:none; padding:0; margin:4px 0 0; display:flex; flex-wrap:wrap; gap:10px 16px; }
  .prop__pal li { display:grid; grid-template-columns:22px auto; column-gap:8px; font-size:13px; line-height:1.25; }
  .prop__pal span { grid-row:span 2; width:22px; height:22px; border-radius:50%; border:1px solid rgba(0,0,0,.12); align-self:center; }
  .prop__pal code { color:var(--muted); font-size:11.5px; }
  .prop__eval { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:4px 0 0; }
  .prop__eval div { background:var(--bg); border-radius:12px; padding:12px 14px; }
  .prop__eval dt { font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
  .prop__eval dd { margin:4px 0 0; font-size:14.5px; line-height:1.45; }
  .prop__type { font-size:14px; color:var(--muted); }
  .prop__cta { justify-self:start; margin-top:6px; padding:13px 22px; background:var(--ink); color:#fff; border-radius:999px; text-decoration:none; font-weight:600; }
  .prop__cta:hover { background:var(--accent); }
  section.map { padding:24px 0 96px; }
  section.map h2 { font-size:28px; letter-spacing:-.02em; margin:0 0 8px; font-weight:600; }
  section.map > .wrap > p { color:var(--muted); margin:0 0 24px; max-width:760px; }
  .tbl { overflow-x:auto; border-radius:16px; }
  table { width:100%; border-collapse:collapse; background:#fff; font-size:15px; min-width:760px; }
  th, td { text-align:left; padding:12px 16px; border-bottom:1px solid var(--line); vertical-align:top; white-space:nowrap; }
  th { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); background:#FBFAF8; }
  td a { text-decoration:none; font-weight:600; } td a:hover { color:var(--accent); }
  td code { font-size:13px; color:var(--muted); }
  @media (max-width:900px) { .prop, .prop:nth-child(even) { grid-template-columns:1fr; } .prop:nth-child(even) .prop__shot { order:0; } .colors, .prop__eval { grid-template-columns:1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <p class="kicker">Scoaché · Refonte du site · Octobre 2026</p>
    <h1>${versions.length} propositions,<br>une seule sitemap.</h1>
    <p>Toutes les propositions suivent la sitemap validée dans Figma : quatre entrées de navigation (Offre, Cas d’usage, À propos, Nous contacter), dix pages, quatre fiches formation et quinze cas d’usage. Seule la direction artistique change. Dans tous les cas, on garde le rouge et le bleu de Scoaché, mais on les adoucit.</p>
    <div class="colors">
      <div><span class="sw"><span style="background:#D60B52"></span><span style="background:#C2385F"></span><span style="background:#B93A5F"></span><span style="background:#C8325E"></span><span style="background:#EC5C85"></span></span><span><b>Rouge</b> : de #D60B52 (actuel) vers des framboises moins saturées, ajustées au fond de chaque version.</span></div>
      <div><span class="sw"><span style="background:#0031FF"></span><span style="background:#3A52B8"></span><span style="background:#2E47C4"></span><span style="background:#151C3F"></span><span style="background:#A7B4FF"></span></span><span><b>Bleu</b> : de #0031FF (actuel) vers un bleu plus profond, un bleu nuit, une pervenche ou une lavande.</span></div>
    </div>
    <ul class="jump">${versions.map((v, i) => `<li><a href="#${v.dir}"><b>${i + 1}</b>${v.label}</a></li>`).join('')}</ul>
  </header>
  <div class="props">
    ${versions.map(card).join('')}
  </div>
</div>
<section class="map">
  <div class="wrap">
    <h2>Les pages</h2>
    <p>Chaque page existe dans toutes les propositions. Une fois sur une page, utilisez le sélecteur en bas de l’écran pour comparer la même page d’une version à l’autre.</p>
    <div class="tbl"><table>
      <thead><tr><th>Page</th><th>URL</th>${versions.map((v, i) => `<th>${i + 1} · ${v.label}</th>`).join('')}</tr></thead>
      <tbody>
        ${pages.map(([n, p]) => `<tr><td>${n}</td><td><code>/${p}</code></td>${versions.map((v) => `<td><a href="${v.dir}/${p}index.html">Voir →</a></td>`).join('')}</tr>`).join('')}
      </tbody>
    </table></div>
  </div>
</section>
</body>
</html>
`;
};
