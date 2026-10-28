/* Scoaché : accueil d'essai « version BCG ».
   Hero à cartes qui défilent (la carte du centre est grande, ses voisines plus petites, en vague
   comme chez BCG), enjeux en deux colonnes, flèches des cas clients, rubrique de la navbar
   allumée selon la section affichée. */
(function () {
  'use strict';

  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  function toutes(sel, racine) { return Array.prototype.slice.call((racine || document).querySelectorAll(sel)); }

  /* ---------- Hero : cartes qui défilent ---------- */

  // Échelle de chaque carte selon sa distance au centre (0 = centre)
  var ECHELLES = [1, 0.6, 0.8, 0.6, 0.6];

  function initDefile(zone) {
    var piste = zone.querySelector('.bcg-defile__piste');
    var cartes = toutes('[data-carte]', zone);
    var n = cartes.length;
    var courant = 0, minuteur = null, enPause = false, survol = false;
    var boutonPause = zone.querySelector('[data-defile-pause]');
    var positions = cartes.map(function () { return null; });

    function mesures() {
      var largeur = zone.clientWidth;
      var ecart = 10;
      var places = largeur > 900 ? 5 : (largeur > 600 ? 3 : 1);
      var carte = places === 1 ? Math.round(largeur * 0.66) : (largeur - ecart * (places - 1)) / places;
      return { largeur: largeur, ecart: ecart, carte: carte, hauteur: Math.round(carte * 4 / 3) };
    }

    function placer(sansTransition) {
      var m = mesures();
      piste.style.setProperty('--larg-carte', m.carte + 'px');
      piste.style.setProperty('--haut-piste', m.hauteur + 'px');
      var centreX = (m.largeur - m.carte) / 2;
      cartes.forEach(function (carte, i) {
        var d = ((i - courant) % n + n) % n;
        if (d > n / 2) d -= n;
        var ad = Math.abs(d);
        var visible = ad <= 2;
        var s = ECHELLES[Math.min(ad, ECHELLES.length - 1)];
        var x = centreX + d * (m.carte + m.ecart);
        // Les cartes du bord se serrent vers le centre, comme chez BCG
        if (ad === 2) x -= Math.sign(d) * (1 - s) * m.carte / 2;
        if (ad > 2) x = centreX + Math.sign(d) * 3 * (m.carte + m.ecart);
        var saute = positions[i] !== null && Math.abs(positions[i] - d) > 2;
        carte.classList.toggle('sans-transition', !!sansTransition || saute);
        carte.style.transform = 'translateX(' + x + 'px) scale(' + s + ')';
        carte.style.opacity = visible ? '1' : '0';
        carte.style.zIndex = String(10 - ad);
        carte.classList.toggle('is-centre', d === 0);
        carte.setAttribute('aria-hidden', visible ? 'false' : 'true');
        var lien = carte.querySelector('a');
        lien.tabIndex = d === 0 ? 0 : -1;
        positions[i] = d;
      });
      // Les commandes s'alignent sous la première carte visible
      var gauche = Math.max(0, centreX - 2 * (m.carte + m.ecart) + (1 - ECHELLES[2]) * m.carte);
      zone.style.setProperty('--decal-commandes', (m.largeur > 900 ? gauche : 0) + 'px');
      if (sansTransition) { void piste.offsetWidth; cartes.forEach(function (c) { c.classList.remove('sans-transition'); }); }
    }

    function aller(i) { courant = (i % n + n) % n; placer(false); relancer(); }
    function suivant() { aller(courant + 1); }

    function relancer() {
      clearTimeout(minuteur);
      if (enPause || survol || mouvementReduit.matches) return;
      minuteur = setTimeout(suivant, 5000);
    }

    cartes.forEach(function (carte, i) {
      carte.querySelector('a').addEventListener('click', function (e) {
        if (i !== courant) { e.preventDefault(); aller(i); }
      });
    });
    zone.querySelector('[data-defile-suiv]').addEventListener('click', suivant);
    zone.querySelector('[data-defile-prec]').addEventListener('click', function () { aller(courant - 1); });
    boutonPause.setAttribute('aria-pressed', 'false');
    boutonPause.addEventListener('click', function () {
      enPause = !enPause;
      boutonPause.setAttribute('aria-pressed', enPause ? 'true' : 'false');
      boutonPause.setAttribute('aria-label', enPause ? 'Relancer le défilement' : 'Mettre en pause le défilement');
      relancer();
    });
    piste.addEventListener('mouseenter', function () { survol = true; clearTimeout(minuteur); });
    piste.addEventListener('mouseleave', function () { survol = false; relancer(); });
    zone.addEventListener('focusin', function () { survol = true; clearTimeout(minuteur); });
    zone.addEventListener('focusout', function () { survol = false; relancer(); });
    zone.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); suivant(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); aller(courant - 1); }
    });

    // Balayage au doigt
    var depart = null;
    piste.addEventListener('touchstart', function (e) { depart = e.touches[0].clientX; }, { passive: true });
    piste.addEventListener('touchend', function (e) {
      if (depart === null) return;
      var dx = e.changedTouches[0].clientX - depart;
      if (Math.abs(dx) > 40) aller(courant + (dx < 0 ? 1 : -1));
      depart = null;
    });

    var redim = null;
    window.addEventListener('resize', function () { clearTimeout(redim); redim = setTimeout(function () { placer(true); }, 80); });
    placer(true);
    relancer();
  }

  /* ---------- Vos enjeux : la carte choisie s'ouvre à droite ---------- */

  function initEnjeux(zone) {
    var onglets = toutes('[data-enjeu-onglet]', zone);
    var panneaux = toutes('[data-enjeu-panneau]', zone);
    var petitEcran = window.matchMedia('(max-width: 900px)');

    function activer(i, focus, defiler) {
      onglets.forEach(function (o, k) {
        var actif = k === i;
        o.setAttribute('aria-selected', actif ? 'true' : 'false');
        o.tabIndex = actif ? 0 : -1;
      });
      panneaux.forEach(function (p, k) {
        var actif = k === i;
        p.hidden = false;
        p.classList.toggle('is-actif', actif);
        p.inert = !actif;
        p.setAttribute('aria-hidden', actif ? 'false' : 'true');
      });
      if (focus) onglets[i].focus();
      if (defiler && petitEcran.matches) panneaux[i].scrollIntoView({ behavior: mouvementReduit.matches ? 'auto' : 'smooth', block: 'start' });
    }

    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { activer(i, false, true); });
      o.addEventListener('keydown', function (e) {
        var s = null, n = onglets.length;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') s = (i + 1) % n;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') s = (i - 1 + n) % n;
        if (e.key === 'Home') s = 0;
        if (e.key === 'End') s = n - 1;
        if (s !== null) { e.preventDefault(); activer(s, true, false); }
      });
    });

    function depuisAncre() {
      var m = /^#enjeu-(\d)$/.exec(window.location.hash);
      if (!m) return false;
      var i = Number(m[1]) - 1;
      if (!onglets[i]) return false;
      activer(i, false, false);
      var section = document.getElementById('enjeux');
      if (section) section.scrollIntoView({ behavior: mouvementReduit.matches ? 'auto' : 'smooth', block: 'start' });
      return true;
    }
    window.addEventListener('hashchange', depuisAncre);
    if (!depuisAncre()) activer(0, false, false);
  }

  /* ---------- Cas clients : flèches ---------- */

  function initCas(piste) {
    var section = piste.closest('.bcg-cas');
    function pas() {
      var carte = piste.querySelector('.bcg-impact:not(.bcg-impact--large)');
      return carte ? carte.getBoundingClientRect().width + 24 : 320;
    }
    section.querySelector('[data-cas-suiv]').addEventListener('click', function () { piste.scrollBy({ left: pas(), behavior: 'smooth' }); });
    section.querySelector('[data-cas-prec]').addEventListener('click', function () { piste.scrollBy({ left: -pas(), behavior: 'smooth' }); });
  }

  /* ---------- Navbar : la rubrique de la section affichée s'allume ---------- */

  function initRubriques() {
    if (!('IntersectionObserver' in window)) return;
    var liens = { enjeux: '#toggle-enjeux', offres: '#toggle-offres', cas: '#toggle-cas' };
    var actuelle = null;
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        var id = e.target.id;
        if (e.isIntersecting) actuelle = id;
        else if (actuelle === id) actuelle = null;
      });
      Object.keys(liens).forEach(function (id) {
        var el = document.querySelector(liens[id]);
        if (el) el.classList.toggle('is-current', id === actuelle);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    Object.keys(liens).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) observateur.observe(s);
    });
  }

  /* ---------- Site d'essai : tous les liens internes restent dans /bcg ---------- */

  function versBcg(href) {
    if (!href || href.charAt(0) !== '/' || href.charAt(1) === '/') return null;
    if (/^\/(bcg([\/?#]|$)|assets\/|css\/|js\/|partials\/)/.test(href)) return null;
    if (/\.[a-z0-9]{2,4}$/i.test(href.split(/[?#]/)[0])) return null;
    if (href === '/') return '/bcg';
    if (href.charAt(1) === '#' || href.charAt(1) === '?') return '/bcg' + href.slice(1);
    return '/bcg' + href;
  }
  function reecrire(racine) {
    toutes('a[href^="/"]', racine).forEach(function (a) {
      var cible = versBcg(a.getAttribute('href'));
      if (cible) a.setAttribute('href', cible);
    });
  }
  function initLiensBcg() {
    reecrire(document);
    // Liens fabriqués plus tard par script.js (recherche, aperçus de cas, parcours)
    new MutationObserver(function (changements) {
      changements.forEach(function (c) {
        c.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches('a[href^="/"]')) reecrire(n.parentNode);
          else reecrire(n);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  // Rubrique de la navbar allumée selon la page (le site d'origine le fait dans include.js)
  function rubriqueDeLaPage() {
    var ici = window.location.pathname.replace(/^\/bcg/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/';
    var regles = [
      [/^\/(offre|coaching-de-dirigeant|formations)(\/|$)/, '#toggle-offres'],
      [/^\/cas-clients(\/|$)/, '#toggle-cas'],
      [/^\/a-propos$/, '.nav-pill__link[href="/bcg/a-propos"]']
    ];
    regles.forEach(function (r) {
      var el = document.querySelector(r[1]);
      if (el && r[0].test(ici)) el.classList.add('is-current');
    });
  }

  function init() {
    toutes('[data-bcg-defile]').forEach(initDefile);
    toutes('[data-bcg-enjeux]').forEach(initEnjeux);
    toutes('[data-bcg-cas]').forEach(initCas);
  }

  function apresPartiels() {
    initLiensBcg();
    rubriqueDeLaPage();
    if (document.querySelector('[data-bcg-enjeux]')) initRubriques();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  // La navbar et le pied de page arrivent avec les partiels
  document.addEventListener('scoache:partiels', apresPartiels);
  if (window.ScoachePartielsPrets) apresPartiels();
})();
