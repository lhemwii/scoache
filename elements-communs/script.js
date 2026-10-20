/* Scoaché, éléments communs : menus, menu mobile, formulaire de contact. */
(function () {
  'use strict';

  var survolPossible = window.matchMedia('(hover: hover) and (pointer: fine)');
  var ecranLarge = window.matchMedia('(min-width: 901px)');

  /* ---------- Navbar flottante : pastille du logo une fois la page défilée ---------- */

  var entete = document.querySelector('.site-header');
  function majEntete() { if (entete) entete.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', majEntete, { passive: true });
  majEntete();

  /* ---------- Menus déroulants (desktop) ---------- */

  var items = Array.prototype.slice.call(document.querySelectorAll('[data-menu-item]'));
  var itemOuvert = null;
  var minuteur = null;

  function parties(item) {
    return {
      bouton: item.querySelector('[data-menu-toggle]'),
      panneau: item.querySelector('[data-menu-panel]')
    };
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

  items.forEach(function (item) {
    var p = parties(item);

    item.addEventListener('mouseenter', function () {
      if (survolPossible.matches && ecranLarge.matches) ouvrir(item);
    });
    item.addEventListener('mouseleave', function () {
      if (survolPossible.matches && itemOuvert === item) fermerPlusTard(item);
    });

    p.bouton.addEventListener('click', function (e) {
      var estOuvert = p.bouton.getAttribute('aria-expanded') === 'true';
      // Avec une souris, le survol ouvre déjà le menu : le clic le garde ouvert.
      if (survolPossible.matches && e.detail > 0) { ouvrir(item); return; }
      if (estOuvert) fermer(item); else ouvrir(item);
    });

    p.bouton.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        ouvrir(item);
        var premier = p.panneau.querySelector('a[href], button:not([tabindex="-1"])');
        if (premier) premier.focus();
      }
    });

    item.addEventListener('focusout', function (e) {
      if (itemOuvert !== item) return;
      if (e.relatedTarget && item.contains(e.relatedTarget)) return;
      if (survolPossible.matches && item.matches(':hover')) return;
      fermer(item);
    });

    p.panneau.querySelectorAll('[data-close-menu]').forEach(function (lien) {
      lien.addEventListener('click', function () { fermer(item); });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !itemOuvert) return;
    var bouton = parties(itemOuvert).bouton;
    fermer(itemOuvert);
    bouton.focus();
  });

  document.addEventListener('click', function (e) {
    if (itemOuvert && !itemOuvert.contains(e.target)) fermer(itemOuvert);
  });

  /* ---------- Onglets par échelle dans « Cas clients » ---------- */

  document.querySelectorAll('[data-scales]').forEach(function (groupe) {
    var onglets = Array.prototype.slice.call(groupe.querySelectorAll('[data-scale-tab]'));

    function activer(onglet, donnerFocus) {
      var cible = onglet.getAttribute('data-scale-tab');
      onglets.forEach(function (o) {
        var actif = o === onglet;
        o.classList.toggle('is-active', actif);
        o.setAttribute('aria-selected', actif ? 'true' : 'false');
        o.tabIndex = actif ? 0 : -1;
      });
      groupe.querySelectorAll('[data-scale-panel]').forEach(function (panneau) {
        panneau.hidden = panneau.getAttribute('data-scale-panel') !== cible;
      });
      if (donnerFocus) onglet.focus();
    }

    onglets.forEach(function (onglet, i) {
      onglet.addEventListener('mouseenter', function () {
        if (survolPossible.matches) activer(onglet, false);
      });
      onglet.addEventListener('click', function () { activer(onglet, false); });
      onglet.addEventListener('keydown', function (e) {
        var suivant = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') suivant = onglets[(i + 1) % onglets.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') suivant = onglets[(i - 1 + onglets.length) % onglets.length];
        if (e.key === 'Home') suivant = onglets[0];
        if (e.key === 'End') suivant = onglets[onglets.length - 1];
        if (suivant) { e.preventDefault(); activer(suivant, true); }
      });
    });
  });

  /* ---------- Menu mobile ---------- */

  var burger = document.querySelector('[data-burger]');
  var panneauMobile = document.getElementById('menu-mobile');

  function focusables() {
    return Array.prototype.slice.call(
      panneauMobile.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function ouvrirMobile() {
    panneauMobile.hidden = false;
    panneauMobile.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    var fermerBtn = panneauMobile.querySelector('.mobile-panel__close');
    if (fermerBtn) fermerBtn.focus();
  }

  function fermerMobile(rendreFocus) {
    if (panneauMobile.hidden) return;
    panneauMobile.classList.remove('is-open');
    panneauMobile.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (rendreFocus) burger.focus();
  }

  if (burger && panneauMobile) {
    burger.addEventListener('click', function () {
      if (panneauMobile.hidden) ouvrirMobile(); else fermerMobile(true);
    });

    panneauMobile.querySelectorAll('[data-close-mobile]').forEach(function (el) {
      el.addEventListener('click', function () {
        fermerMobile(el.classList.contains('mobile-panel__close'));
      });
    });

    panneauMobile.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); fermerMobile(true); return; }
      if (e.key !== 'Tab') return;
      var liste = focusables();
      if (!liste.length) return;
      var premier = liste[0];
      var dernier = liste[liste.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });

    panneauMobile.querySelectorAll('[data-accordion]').forEach(function (bouton) {
      var cible = document.getElementById(bouton.getAttribute('aria-controls'));
      bouton.addEventListener('click', function () {
        var ouvert = bouton.getAttribute('aria-expanded') === 'true';
        bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
        if (cible) cible.hidden = ouvert;
      });
    });

    var surChangement = function () {
      if (ecranLarge.matches) fermerMobile(false);
      else if (itemOuvert) fermer(itemOuvert);
    };
    if (ecranLarge.addEventListener) ecranLarge.addEventListener('change', surChangement);
    else if (ecranLarge.addListener) ecranLarge.addListener(surChangement);
  }

  /* ---------- Formulaire de contact (sans envoi réel) ---------- */

  var formulaire = document.getElementById('contact-form');
  if (formulaire) {
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
      champs.forEach(function (champ) {
        if (!verifier(champ) && !premierInvalide) premierInvalide = champ.input;
      });
      if (premierInvalide) {
        confirmation.innerHTML = '';
        premierInvalide.focus();
        return;
      }

      var nom = champs[0].input.value.trim().split(/\s+/)[0];
      confirmation.innerHTML =
        '<span class="pastille" aria-hidden="true"><svg class="ico" width="16" height="16"><use href="#i-check"/></svg></span>' +
        '<span><strong></strong>Ilana vous répond sous 48 h.</span>';
      confirmation.querySelector('strong').textContent = 'Merci ' + nom + ', votre message a bien été pris en compte.';

      formulaire.querySelectorAll('.field__input').forEach(function (input) {
        input.value = '';
        input.removeAttribute('aria-invalid');
      });
    });
  }
})();
