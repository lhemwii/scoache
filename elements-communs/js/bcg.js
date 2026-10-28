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

    var barre = zone.querySelector('.bcg-defile__barre span');
    function relancer() {
      clearTimeout(minuteur);
      if (barre) { barre.style.animation = 'none'; void barre.offsetWidth; barre.style.animation = ''; }
      var tourne = !(enPause || survol || mouvementReduit.matches);
      zone.classList.toggle('is-en-pause', !tourne);
      if (tourne) minuteur = setTimeout(suivant, 4000);
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

  /* Cartes placées une à une (comme le hero) : la première visible est grande ; au survol, la carte
     visée s'agrandit sur place, les suivantes se poussent. Défilement seul avec barre de progression. */
  function initCas(piste) {
    var section = piste.closest('.bcg-cas');
    var cartes = toutes('.bcg-impact', piste);
    var n = cartes.length;
    if (!n) return;
    var debut = 0, actif = 0, places = cartes.map(function () { return null; });
    var barre = section.querySelector('.bcg-cas__barre span');
    var DUREE = 4500;
    piste.classList.add('is-placee');

    function mesures() {
      var mobile = window.innerWidth <= 900;
      var petite = mobile ? Math.min(window.innerWidth * 0.78, 320) : 304;
      return { petite: petite, grande: mobile ? petite : 620, ecart: mobile ? 16 : 24, gauche: parseFloat(getComputedStyle(piste).paddingLeft) || 0 };
    }

    function placer(sansTransition) {
      var m = mesures();
      var largeur = function (k) { return k === actif ? m.grande : m.petite; };
      cartes.forEach(function (c, i) {
        var d = ((i - debut) % n + n) % n;
        if (d === n - 1 && n > 2) d = -1;           // la précédente sort par la gauche
        var x = m.gauche;
        if (d >= 0) { for (var k = 0; k < d; k++) x += largeur((debut + k) % n) + m.ecart; }
        else x -= m.petite + m.ecart;
        var saut = places[i] !== null && Math.abs(places[i] - d) > 1;
        c.classList.toggle('sans-transition', !!sansTransition || saut);
        c.style.width = largeur(i) + 'px';
        c.style.transform = 'translateX(' + x + 'px)';
        c.style.opacity = d < 0 ? '0' : '1';
        c.classList.toggle('is-grand', i === actif);
        c.setAttribute('aria-hidden', d < 0 ? 'true' : 'false');
        places[i] = d;
      });
      if (sansTransition || cartes.some(function (c) { return c.classList.contains('sans-transition'); })) {
        void piste.offsetWidth;
        cartes.forEach(function (c) { c.classList.remove('sans-transition'); });
      }
    }

    function aller(i) { debut = actif = (i % n + n) % n; placer(false); relancer(); }

    // Survol : la carte visée devient grande sur place, les cartes d'avant ne bougent pas
    cartes.forEach(function (c, i) {
      c.addEventListener('mouseenter', function () { if (places[i] >= 0 && actif !== i) { actif = i; placer(false); } });
    });
    piste.addEventListener('mouseleave', function () { if (actif !== debut) { actif = debut; placer(false); } });

    section.querySelector('[data-cas-suiv]').addEventListener('click', function () { aller(debut + 1); });
    section.querySelector('[data-cas-prec]').addEventListener('click', function () { aller(debut - 1); });
    piste.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); aller(debut + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); aller(debut - 1); }
    });
    var depart = null;
    piste.addEventListener('touchstart', function (e) { depart = e.touches[0].clientX; }, { passive: true });
    piste.addEventListener('touchend', function (e) {
      if (depart === null) return;
      var dx = e.changedTouches[0].clientX - depart;
      if (Math.abs(dx) > 40) aller(debut + (dx < 0 ? 1 : -1));
      depart = null;
    });

    // Défilement automatique : en pause au survol, au focus ou hors de l'écran ; la barre montre le temps restant
    var minuteur = null, arret = false, visible = false;
    function relancer() {
      clearTimeout(minuteur);
      if (barre) { barre.style.animation = 'none'; void barre.offsetWidth; barre.style.animation = ''; }
      var tourne = !(arret || !visible || mouvementReduit.matches || n < 2);
      section.classList.toggle('is-en-pause', !tourne);
      if (tourne) minuteur = setTimeout(function () { aller(debut + 1); }, DUREE);
    }
    section.addEventListener('mouseenter', function () { arret = true; relancer(); });
    section.addEventListener('mouseleave', function () { arret = false; relancer(); });
    section.addEventListener('focusin', function () { arret = true; relancer(); });
    section.addEventListener('focusout', function () { arret = false; relancer(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; relancer(); }, { threshold: 0.3 }).observe(piste);
    } else { visible = true; relancer(); }
    var redim = null;
    window.addEventListener('resize', function () { clearTimeout(redim); redim = setTimeout(function () { placer(true); }, 80); });
    placer(true);
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
      [/^\/enjeux(\/|$)/, '#toggle-enjeux'],
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

  /* ---------- Haut de page : la bande beige part du tout haut de la page, sans déborder au-dessus ---------- */

  function caleBande() {
    var s = document.querySelector('.bcg-entete');
    if (s) s.style.setProperty('--haut-bande', Math.round(s.getBoundingClientRect().top + window.scrollY) + 'px');
  }
  window.addEventListener('resize', caleBande);
  window.addEventListener('load', caleBande);

  function apresPartiels() {
    caleBande();
    initLiensBcg();
    rubriqueDeLaPage();
    if (document.querySelector('[data-bcg-enjeux]')) initRubriques();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); caleBande(); });
  else { init(); caleBande(); }
  // La navbar et le pied de page arrivent avec les partiels
  document.addEventListener('scoache:partiels', apresPartiels);
  if (window.ScoachePartielsPrets) apresPartiels();
})();
