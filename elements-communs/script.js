/* Scoaché : comportements partagés.
   Menus de la navbar, menu mobile, formulaire de contact, carrousels, FAQ.
   Tout passe par Scoache.init(), lancé après l'injection des partiels
   (événement « scoache:partiels » envoyé par include.js). init() peut être
   rappelé sans risque : chaque élément n'est branché qu'une fois. */
(function () {
  'use strict';

  var survolPossible = window.matchMedia('(hover: hover) and (pointer: fine)');
  var ecranLarge = window.matchMedia('(min-width: 901px)');

  function une(el, cle) {
    var attr = 'data-init-' + cle;
    if (!el || el.hasAttribute(attr)) return false;
    el.setAttribute(attr, '');
    return true;
  }

  function toutes(sel, racine) {
    return Array.prototype.slice.call((racine || document).querySelectorAll(sel));
  }

  /* ---------- Navbar flottante : pastille du logo une fois la page défilée ---------- */

  function majEntete() {
    var entete = document.querySelector('.site-header');
    if (entete) entete.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', majEntete, { passive: true });

  /* ---------- Menus déroulants (desktop) ---------- */

  var itemOuvert = null;
  var minuteur = null;

  function parties(item) {
    return { bouton: item.querySelector('[data-menu-toggle]'), panneau: item.querySelector('[data-menu-panel]') };
  }
  function ouvrir(item) {
    clearTimeout(minuteur);
    if (itemOuvert && itemOuvert !== item) fermer(itemOuvert);
    var p = parties(item);
    p.bouton.setAttribute('aria-expanded', 'true');
    p.panneau.classList.add('is-open');
    itemOuvert = item;
  }
  function fermer(item) {
    item = item || itemOuvert;
    if (!item) return;
    var p = parties(item);
    p.bouton.setAttribute('aria-expanded', 'false');
    p.panneau.classList.remove('is-open');
    if (itemOuvert === item) itemOuvert = null;
  }
  function fermerPlusTard(item) {
    clearTimeout(minuteur);
    minuteur = setTimeout(function () { fermer(item); }, 180);
  }

  function initMenus() {
    toutes('[data-menu-item]').forEach(function (item) {
      if (!une(item, 'menu')) return;
      var p = parties(item);
      item.addEventListener('mouseenter', function () { if (survolPossible.matches && ecranLarge.matches) ouvrir(item); });
      item.addEventListener('mouseleave', function () { if (survolPossible.matches && itemOuvert === item) fermerPlusTard(item); });
      p.bouton.addEventListener('click', function (e) {
        var estOuvert = p.bouton.getAttribute('aria-expanded') === 'true';
        // Avec une souris, le survol ouvre déjà le menu : le clic le garde ouvert.
        if (survolPossible.matches && e.detail > 0) { ouvrir(item); return; }
        if (estOuvert) fermer(item); else ouvrir(item);
      });
      p.bouton.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown') return;
        e.preventDefault();
        ouvrir(item);
        var premier = p.panneau.querySelector('a[href], button:not([tabindex="-1"])');
        if (premier) premier.focus();
      });
      item.addEventListener('focusout', function (e) {
        if (itemOuvert !== item) return;
        if (e.relatedTarget && item.contains(e.relatedTarget)) return;
        if (survolPossible.matches && item.matches(':hover')) return;
        fermer(item);
      });
      toutes('[data-close-menu]', p.panneau).forEach(function (lien) {
        lien.addEventListener('click', function () { fermer(item); });
      });
    });

    toutes('[data-scales]').forEach(function (groupe) {
      if (!une(groupe, 'onglets')) return;
      var onglets = toutes('[data-scale-tab]', groupe);
      function activer(onglet, focus) {
        var cible = onglet.getAttribute('data-scale-tab');
        onglets.forEach(function (o) {
          var actif = o === onglet;
          o.classList.toggle('is-active', actif);
          o.setAttribute('aria-selected', actif ? 'true' : 'false');
          o.tabIndex = actif ? 0 : -1;
        });
        toutes('[data-scale-panel]', groupe).forEach(function (pn) {
          pn.hidden = pn.getAttribute('data-scale-panel') !== cible;
        });
        if (focus) onglet.focus();
      }
      onglets.forEach(function (onglet, i) {
        onglet.addEventListener('mouseenter', function () { if (survolPossible.matches) activer(onglet, false); });
        onglet.addEventListener('click', function () { activer(onglet, false); });
        onglet.addEventListener('keydown', function (e) {
          var n = onglets.length, s = null;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') s = onglets[(i + 1) % n];
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') s = onglets[(i - 1 + n) % n];
          if (e.key === 'Home') s = onglets[0];
          if (e.key === 'End') s = onglets[n - 1];
          if (s) { e.preventDefault(); activer(s, true); }
        });
      });
    });
  }

  /* ---------- Menu mobile ---------- */

  var burger = null;
  var panneauMobile = null;

  function ouvrirMobile() {
    panneauMobile.hidden = false;
    panneauMobile.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    var b = panneauMobile.querySelector('.mobile-panel__close');
    if (b) b.focus();
  }
  function fermerMobile(rendreFocus) {
    if (!panneauMobile || panneauMobile.hidden) return;
    panneauMobile.classList.remove('is-open');
    panneauMobile.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (rendreFocus) burger.focus();
  }

  function initMobile() {
    burger = document.querySelector('[data-burger]');
    panneauMobile = document.getElementById('menu-mobile');
    if (!burger || !panneauMobile || !une(burger, 'burger')) return;

    burger.addEventListener('click', function () {
      if (panneauMobile.hidden) ouvrirMobile(); else fermerMobile(true);
    });
    toutes('[data-close-mobile]', panneauMobile).forEach(function (el) {
      el.addEventListener('click', function () { fermerMobile(el.classList.contains('mobile-panel__close')); });
    });
    panneauMobile.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); fermerMobile(true); return; }
      if (e.key !== 'Tab') return;
      var liste = toutes('a[href], button:not([disabled])', panneauMobile).filter(function (el) { return el.offsetParent !== null; });
      if (!liste.length) return;
      var premier = liste[0], dernier = liste[liste.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });
    toutes('[data-accordion]', panneauMobile).forEach(function (bouton) {
      var cible = document.getElementById(bouton.getAttribute('aria-controls'));
      bouton.addEventListener('click', function () {
        var ouvert = bouton.getAttribute('aria-expanded') === 'true';
        bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
        if (cible) cible.hidden = ouvert;
      });
    });
  }

  /* ---------- Formulaire de contact (sans backend) ---------- */

  function initFormulaire() {
    var formulaire = document.getElementById('contact-form');
    if (!formulaire || !une(formulaire, 'form')) return;
    var confirmation = document.getElementById('form-confirmation');
    var champs = [
      { input: formulaire.querySelector('#f-nom'), test: function (v) { return v.trim().length > 0; } },
      { input: formulaire.querySelector('#f-email'), test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } }
    ];
    function verifier(champ) {
      var ok = champ.test(champ.input.value);
      var erreur = document.getElementById(champ.input.id + '-erreur');
      champ.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (erreur) erreur.hidden = ok;
      return ok;
    }
    champs.forEach(function (champ) {
      champ.input.addEventListener('blur', function () {
        if (champ.input.value !== '' || champ.input.getAttribute('aria-invalid') === 'true') verifier(champ);
      });
      champ.input.addEventListener('input', function () {
        if (champ.input.getAttribute('aria-invalid') === 'true') verifier(champ);
      });
    });
    formulaire.addEventListener('submit', function (e) {
      e.preventDefault();
      var premierInvalide = null;
      champs.forEach(function (champ) { if (!verifier(champ) && !premierInvalide) premierInvalide = champ.input; });
      if (premierInvalide) { confirmation.textContent = ''; premierInvalide.focus(); return; }
      var nom = champs[0].input.value.trim().split(/\s+/)[0];
      confirmation.innerHTML =
        '<span class="pastille" aria-hidden="true"><svg class="ico" width="16" height="16"><use href="/assets/icones.svg#i-check"/></svg></span>' +
        '<span><strong></strong>Ilana vous répond sous 48 h.</span>';
      confirmation.querySelector('strong').textContent = 'Merci ' + nom + ', votre message a bien été pris en compte.';
      toutes('.field__input', formulaire).forEach(function (input) { input.value = ''; input.removeAttribute('aria-invalid'); });
    });
  }

  /* ---------- Carrousel (data-carrousel) ---------- */

  function initCarrousels() {
    toutes('[data-carrousel]').forEach(function (racine) {
      if (!une(racine, 'carrousel')) return;
      var piste = racine.querySelector('.carrousel__piste');
      var prec = racine.querySelector('[data-carrousel-prec]');
      var suiv = racine.querySelector('[data-carrousel-suiv]');
      var barre = racine.querySelector('.carrousel__progression span');
      if (!piste) return;

      function pas() {
        var item = toutes('.carrousel__item', piste).filter(function (el) { return !el.hidden; })[0];
        if (!item) return piste.clientWidth;
        var gap = parseFloat(getComputedStyle(piste).columnGap) || 0;
        return item.getBoundingClientRect().width + gap;
      }
      function maj() {
        var max = piste.scrollWidth - piste.clientWidth;
        var x = Math.max(0, piste.scrollLeft);
        if (barre) {
          var part = piste.scrollWidth ? piste.clientWidth / piste.scrollWidth : 1;
          barre.style.width = (Math.min(1, part) * 100) + '%';
          barre.style.left = (piste.scrollWidth ? (x / piste.scrollWidth) * 100 : 0) + '%';
        }
        if (prec) prec.disabled = x <= 1;
        if (suiv) suiv.disabled = x >= max - 1;
      }
      if (prec) prec.addEventListener('click', function () { piste.scrollBy({ left: -pas(), behavior: 'smooth' }); });
      if (suiv) suiv.addEventListener('click', function () { piste.scrollBy({ left: pas(), behavior: 'smooth' }); });
      piste.addEventListener('scroll', function () { window.requestAnimationFrame(maj); }, { passive: true });
      window.addEventListener('resize', maj);

      // Filtres optionnels : boutons [data-carrousel-filtre="individuel"], items [data-echelle="individuel"]
      var filtres = toutes('[data-carrousel-filtre]', racine);
      filtres.forEach(function (bouton) {
        bouton.addEventListener('click', function () {
          var valeur = bouton.getAttribute('data-carrousel-filtre');
          filtres.forEach(function (b) { b.setAttribute('aria-pressed', b === bouton ? 'true' : 'false'); });
          toutes('.carrousel__item', piste).forEach(function (item) {
            item.hidden = valeur !== 'tous' && item.getAttribute('data-echelle') !== valeur;
          });
          piste.scrollLeft = 0;
          maj();
        });
      });
      maj();
    });
  }

  /* ---------- FAQ (data-faq) ---------- */

  function initFaq() {
    toutes('[data-faq] .faq__question').forEach(function (bouton) {
      if (!une(bouton, 'faq')) return;
      var reponse = document.getElementById(bouton.getAttribute('aria-controls'));
      bouton.addEventListener('click', function () {
        var ouvert = bouton.getAttribute('aria-expanded') === 'true';
        bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
        bouton.closest('.faq__item').classList.toggle('is-open', !ouvert);
        if (reponse) reponse.hidden = ouvert;
      });
    });
  }

  /* ---------- Écouteurs globaux (une seule fois) ---------- */

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !itemOuvert) return;
    var bouton = parties(itemOuvert).bouton;
    fermer(itemOuvert);
    bouton.focus();
  });
  document.addEventListener('click', function (e) {
    if (itemOuvert && !itemOuvert.contains(e.target)) fermer(itemOuvert);
  });
  function surChangement() {
    if (ecranLarge.matches) fermerMobile(false);
    else if (itemOuvert) fermer(itemOuvert);
  }
  if (ecranLarge.addEventListener) ecranLarge.addEventListener('change', surChangement);
  else if (ecranLarge.addListener) ecranLarge.addListener(surChangement);

  function init() {
    majEntete();
    initMenus();
    initMobile();
    initFormulaire();
    initCarrousels();
    initFaq();
  }

  window.Scoache = { init: init };

  // Lancement : après les partiels si include.js est présent, sinon tout de suite.
  document.addEventListener('scoache:partiels', init);
  if (window.ScoachePartielsPrets) init();
  else if (!document.querySelector('script[src$="include.js"]')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})();
