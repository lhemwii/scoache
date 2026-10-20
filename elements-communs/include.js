/* Scoaché : injection des partiels partagés.
   Usage dans une page : <div data-include="header"></div>
   Charge /partials/<nom>.html, remplace le placeholder, marque le lien de la page
   courante, puis prévient script.js (événement « scoache:partiels »).
   Fonctionne sur Vercel et en local via un serveur HTTP (pas en file://). */
(function () {
  'use strict';

  function normaliser(chemin) {
    chemin = (chemin || '/').replace(/index\.html$/, '').replace(/\.html$/, '');
    if (chemin.length > 1) chemin = chemin.replace(/\/+$/, '');
    return chemin || '/';
  }

  function marquerPageCourante() {
    var ici = normaliser(window.location.pathname);
    document.querySelectorAll('header a[href^="/"], footer a[href^="/"]').forEach(function (lien) {
      var cible = normaliser(lien.getAttribute('href').split('#')[0]);
      if (cible === ici && lien.getAttribute('href').indexOf('#') === -1) lien.setAttribute('aria-current', 'page');
    });
    // Rubrique active de la navbar
    var rubriques = [
      { prefixes: ['/offre', '/coaching-de-dirigeant', '/formations'], cible: '#toggle-offre' },
      { prefixes: ['/cas-clients'], cible: '#toggle-cas' },
      { prefixes: ['/a-propos'], cible: '.nav-pill__link[href="/a-propos"]' }
    ];
    rubriques.forEach(function (r) {
      var actif = r.prefixes.some(function (p) { return ici === p || ici.indexOf(p + '/') === 0; });
      var el = document.querySelector(r.cible);
      if (actif && el) el.classList.add('is-current');
    });
  }

  function terminer() {
    marquerPageCourante();
    window.ScoachePartielsPrets = true;
    document.documentElement.classList.add('partiels-ok');
    document.dispatchEvent(new CustomEvent('scoache:partiels'));
  }

  function charger() {
    var cibles = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    if (!cibles.length) { terminer(); return; }

    Promise.all(cibles.map(function (el) {
      var nom = el.getAttribute('data-include');
      // URL propre d'abord (Vercel, serve.py), puis .html (python3 -m http.server).
      return fetch('/partials/' + nom, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r : fetch('/partials/' + nom + '.html', { credentials: 'same-origin' }); })
        .then(function (r) {
          if (!r.ok) throw new Error('Partiel introuvable : ' + nom + ' (' + r.status + ')');
          return r.text();
        })
        .then(function (html) {
          var gabarit = document.createElement('template');
          gabarit.innerHTML = html.trim();
          el.replaceWith(gabarit.content);
        })
        .catch(function (err) {
          console.error(err);
          el.removeAttribute('data-include');
        });
    })).then(terminer);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', charger);
  else charger();
})();
