// Page d’accueil du dépôt : présente les trois propositions côte à côte (outil de présentation).
module.exports.render = ({ C, versions }) => {
  const palette = {
    'v1-evolution': [['#FFFFFF', 'Blanc'], ['#16161A', 'Encre'], ['#C2385F', 'Framboise'], ['#3A52B8', 'Bleu'], ['#F6F5F2', 'Grège']],
    'v2-conseil': [['#F4F1EB', 'Ivoire'], ['#151C3F', 'Bleu nuit'], ['#B93A5F', 'Framboise'], ['#F3C3D0', 'Rose poudré'], ['#DDE3F6', 'Bleu glacier']],
    'v3-studio': [['#0D0D10', 'Noir'], ['#EC5C85', 'Framboise vive'], ['#A7B4FF', 'Pervenche'], ['#F5ECE0', 'Crème'], ['#3A3A40', 'Graphite']],
  };
  const info = {
    'v1-evolution': { type: 'Hanken Grotesk', pitch: 'On garde ce qui marche sur le site actuel — fond blanc, cartes à liseré de couleur, bouton noir, bandeau Qualiopi — et on modernise : plus d’air, typographie plus fine, photos plus grandes, et la nouvelle arborescence centrée sur le coaching de dirigeant.', mood: 'Familier · rassurant · continuité' },
    'v2-conseil': { type: 'Newsreader + Instrument Sans', pitch: 'La rigueur d’un cabinet de conseil. Titres en serif, grands blocs arrondis bleu nuit, cartes photo à étiquettes vitrées, boutons-pastilles. Le rouge devient framboise et rose poudré, le bleu devient bleu nuit : on parle aux COMEX.', mood: 'Institutionnel · éditorial · haut de gamme' },
    'v3-studio': { type: 'Archivo (Black / Expanded)', pitch: 'L’énergie d’un studio. Fond noir, typographie géante en capitales, liste de clients monumentale, rail de navigation vertical, bloc pervenche plein écran. Le rouge passe en framboise vive sur noir : fort, mais jamais criard.', mood: 'Affirmé · contemporain · mémorable' },
  };
  const card = (v, i) => {
    const pal = palette[v.dir].map(([hex, n]) => `<li><span style="background:${hex}"></span><b>${n}</b><code>${hex}</code></li>`).join('');
    return `
  <article class="prop">
    <a class="prop__shot" href="${v.dir}/index.html"><img src="assets/img/previews/${v.dir}.jpg" alt="Aperçu de la proposition ${i + 1} — ${v.label}" loading="lazy"></a>
    <div class="prop__body">
      <p class="prop__num">Proposition ${i + 1}</p>
      <h2>${v.label}</h2>
      <p class="prop__insp">Inspirée de <b>${v.inspiration}</b> · ${info[v.dir].mood}</p>
      <p>${info[v.dir].pitch}</p>
      <ul class="prop__pal">${pal}</ul>
      <p class="prop__type">Typographie : ${info[v.dir].type}</p>
      <a class="prop__cta" href="${v.dir}/index.html">Ouvrir la proposition →</a>
    </div>
  </article>`;
  };
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
  header { padding:clamp(48px,7vw,96px) 0 40px; display:grid; gap:18px; }
  .kicker { font-size:13px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); }
  h1 { font-size:clamp(40px,6vw,76px); line-height:1.02; letter-spacing:-.03em; font-weight:600; margin:0; }
  header p { max-width:820px; color:var(--muted); font-size:clamp(17px,1.5vw,20px); margin:0; }
  .colors { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:24px 0 8px; max-width:820px; }
  .colors div { display:flex; align-items:center; gap:12px; background:#fff; border-radius:14px; padding:14px; font-size:14.5px; line-height:1.35; }
  .sw { display:flex; } .sw span { width:34px; height:34px; border-radius:50%; border:2px solid #fff; margin-left:-8px; } .sw span:first-child { margin-left:0; }
  .props { display:grid; gap:28px; padding-bottom:40px; }
  .prop { display:grid; grid-template-columns:1.25fr 1fr; background:#fff; border-radius:24px; overflow:hidden; border:1px solid var(--line); }
  .prop__shot { display:block; background:#ddd; overflow:hidden; aspect-ratio:16/11; }
  .prop__shot img { width:100%; height:100%; object-fit:cover; object-position:top; transition:transform .8s cubic-bezier(.2,.7,.2,1); }
  .prop__shot:hover img { transform:scale(1.03); }
  .prop__body { padding:clamp(24px,3.5vw,44px); display:grid; gap:14px; align-content:center; }
  .prop__body p { margin:0; } .prop__num { font-size:13px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
  .prop h2 { margin:0; font-size:clamp(30px,3.4vw,44px); letter-spacing:-.025em; line-height:1.05; font-weight:600; }
  .prop__insp { color:var(--muted); font-size:15px; }
  .prop__pal { list-style:none; padding:0; margin:6px 0 0; display:flex; flex-wrap:wrap; gap:10px 16px; }
  .prop__pal li { display:grid; grid-template-columns:22px auto; column-gap:8px; font-size:13px; line-height:1.25; }
  .prop__pal span { grid-row:span 2; width:22px; height:22px; border-radius:50%; border:1px solid rgba(0,0,0,.12); align-self:center; }
  .prop__pal code { color:var(--muted); font-size:11.5px; }
  .prop__type { font-size:14px; color:var(--muted); }
  .prop__cta { justify-self:start; margin-top:8px; padding:13px 22px; background:var(--ink); color:#fff; border-radius:999px; text-decoration:none; font-weight:600; }
  .prop__cta:hover { background:var(--accent); }
  section.map { padding:24px 0 96px; }
  section.map h2 { font-size:28px; letter-spacing:-.02em; margin:0 0 8px; font-weight:600; }
  section.map > .wrap > p { color:var(--muted); margin:0 0 24px; max-width:760px; }
  table { width:100%; border-collapse:collapse; background:#fff; border-radius:16px; overflow:hidden; font-size:15px; }
  th, td { text-align:left; padding:12px 16px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); background:#FBFAF8; }
  td a { text-decoration:none; font-weight:600; } td a:hover { color:var(--accent); }
  td code { font-size:13px; color:var(--muted); }
  @media (max-width:900px) { .prop { grid-template-columns:1fr; } .colors { grid-template-columns:1fr; } .hide-sm { display:none; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <p class="kicker">Scoaché · Refonte du site · Octobre 2026</p>
    <h1>Trois propositions,<br>une seule sitemap.</h1>
    <p>Les trois versions suivent la sitemap validée dans Figma : quatre entrées de navigation (Offre, Cas d’usage, À propos, Nous contacter), dix pages, quatre fiches formation et quinze cas d’usage. Seule la direction artistique change. Dans les trois cas, on garde le rouge et le bleu de Scoaché, mais on les adoucit.</p>
    <div class="colors">
      <div><span class="sw"><span style="background:#D60B52"></span><span style="background:#C2385F"></span><span style="background:#B93A5F"></span><span style="background:#EC5C85"></span></span><span><b>Rouge</b> : de #D60B52 (actuel) vers des framboises moins saturées, selon le fond.</span></div>
      <div><span class="sw"><span style="background:#0031FF"></span><span style="background:#3A52B8"></span><span style="background:#151C3F"></span><span style="background:#A7B4FF"></span></span><span><b>Bleu</b> : de #0031FF (actuel) vers un bleu plus profond, un bleu nuit ou une pervenche.</span></div>
    </div>
  </header>
  <div class="props">
    ${versions.map(card).join('')}
  </div>
</div>
<section class="map">
  <div class="wrap">
    <h2>Les pages</h2>
    <p>Chaque page existe dans les trois propositions. Une fois sur une page, utilisez le sélecteur en bas de l’écran pour comparer la même page d’une version à l’autre.</p>
    <table>
      <thead><tr><th>Page</th><th class="hide-sm">URL</th>${versions.map((v, i) => `<th>${i + 1} · ${v.label}</th>`).join('')}</tr></thead>
      <tbody>
        ${[
          ['Home', ''], ['Offre', 'offre/'], ['Coaching de dirigeant', 'coaching-de-dirigeant/'],
          ...C.scales.map((s) => [`↳ ${s.name}`, `coaching-de-dirigeant/${s.slug}/`]),
          ['Formations — catalogue', 'formations/'],
          ...C.formations.map((f) => [`↳ ${f.name}`, `formations/${f.slug}/`]),
          ['Cas d’usage', 'cas-usage/'], ['À propos', 'a-propos/'], ['Nous contacter', 'nous-contacter/'],
        ].map(([n, p]) => `<tr><td>${n}</td><td class="hide-sm"><code>/${p}</code></td>${versions.map((v) => `<td><a href="${v.dir}/${p}index.html">Voir →</a></td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>
</body>
</html>
`;
};
