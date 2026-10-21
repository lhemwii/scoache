/* Scoaché : comportements partagés.
   Menus de la navbar, menu mobile, formulaire de contact, carrousels, FAQ.
   Tout passe par Scoache.init(), lancé après l'injection des partiels
   (événement « scoache:partiels » envoyé par include.js). init() peut être
   rappelé sans risque : chaque élément n'est branché qu'une fois. */
(function () {
  'use strict';

  var survolPossible = window.matchMedia('(hover: hover) and (pointer: fine)');
  var ecranLarge = window.matchMedia('(min-width: 901px)');
  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  /* ---------- Petits outils ---------- */

  var SVG = 'http://www.w3.org/2000/svg';
  function icone(nom, taille) {
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'ico');
    svg.setAttribute('width', taille);
    svg.setAttribute('height', taille);
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(SVG, 'use');
    use.setAttribute('href', '/assets/icones.svg#i-' + nom);
    svg.appendChild(use);
    return svg;
  }
  function elt(tag, classe, texte) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texte != null) n.textContent = texte;
    return n;
  }
  function visibleQuand(el, rappel, seuil) {
    if (!('IntersectionObserver' in window)) { rappel(true); return; }
    new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) { rappel(entree.isIntersecting); });
    }, { threshold: seuil || 0.3 }).observe(el);
  }
  // Courbe d'accélération commune aux ouvertures : cubic-bezier(0.2, 0.7, 0.2, 1).
  var DUREE_OUVERTURE = 450;
  function courbe(x1, y1, x2, y2) {
    function axe(t, p1, p2) { var u = 1 - t; return 3 * p1 * u * u * t + 3 * p2 * u * t * t + t * t * t; }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var bas = 0, haut = 1, t = x;
      for (var i = 0; i < 24; i += 1) {
        var v = axe(t, x1, x2);
        if (Math.abs(v - x) < 1e-5) break;
        if (v < x) bas = t; else haut = t;
        t = (bas + haut) / 2;
      }
      return axe(t, y1, y2);
    };
  }
  var adoucir = courbe(0.2, 0.7, 0.2, 1);

  // Pendant qu'un bloc s'ouvre ou se ferme, garde `ancre` immobile à l'écran
  // (le haut de l'élément reste à sa place), puis la décale de `decalage` px
  // vers le haut avec la même courbe, pour amener le contenu ouvert dans le champ.
  // Un geste de l'utilisateur (molette, toucher, clavier) reprend la main.
  var guidage = null;
  function guiderFenetre(ancre, decalage, duree) {
    if (guidage) guidage();
    var depart = ancre.getBoundingClientRect().top;
    var racine = document.documentElement;
    var debut = null, actif = true;
    var gestes = ['wheel', 'touchstart', 'keydown'];
    function arreter() {
      if (!actif) return;
      actif = false;
      guidage = null;
      racine.style.overflowAnchor = '';
      gestes.forEach(function (g) { window.removeEventListener(g, arreter, true); });
    }
    function pas(t) {
      if (!actif) return;
      if (debut === null) debut = t;
      var p = duree > 0 ? Math.min(1, (t - debut) / duree) : 1;
      // Défilement au pixel entier : évite les oscillations d'un demi-pixel.
      var ecart = Math.round(ancre.getBoundingClientRect().top - (depart - decalage * adoucir(p)));
      if (ecart !== 0) window.scrollBy(0, ecart);
      if (p < 1) window.requestAnimationFrame(pas); else arreter();
    }
    racine.style.overflowAnchor = 'none';
    gestes.forEach(function (g) { window.addEventListener(g, arreter, { capture: true, passive: true }); });
    guidage = arreter;
    window.requestAnimationFrame(pas);
  }
  // Marge haute à respecter sous la barre de navigation fixe.
  function margeHaute() { return ecranLarge.matches ? 104 : 84; }

  /* ---------- Formulaire de contact (sans backend) ---------- */

  function initFormulaire() {
    var formulaire = document.getElementById('contact-form');
    if (!formulaire || !une(formulaire, 'form')) return;
    var confirmation = document.getElementById('form-confirmation');
    var bouton = formulaire.querySelector('.btn-envoi');
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
    formulaire.addEventListener('input', function () { if (bouton) bouton.classList.remove('is-envoye'); });
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
      if (bouton) bouton.classList.add('is-envoye');
      toutes('.field__input', formulaire).forEach(function (input) { input.value = ''; input.removeAttribute('aria-invalid'); });
      toutes('.field.is-valide', formulaire).forEach(function (f) { f.classList.remove('is-valide'); });
    });
  }

  /* Coche de validation sur chaque champ rempli correctement (tous les formulaires de contact). */
  function initCoches() {
    toutes('[data-formulaire-contact]').forEach(function (form) {
      if (!une(form, 'coches')) return;
      function maj(input) {
        var champ = input.closest('.field');
        if (!champ) return;
        var valide = input.value.trim() !== '' && input.checkValidity();
        champ.classList.toggle('is-valide', valide);
      }
      form.addEventListener('input', function (e) { if (e.target.matches('.field__input')) maj(e.target); });
      form.addEventListener('focusout', function (e) { if (e.target.matches('.field__input')) maj(e.target); });
    });
  }

  /* Placeholders « tapés à la main » ([data-frappe], exemples séparés par ||).
     S'arrête dès que le champ a le focus ou une valeur ; statique si mouvement réduit. */
  function initFrappe() {
    toutes('[data-frappe]').forEach(function (champ) {
      if (!une(champ, 'frappe')) return;
      var exemples = champ.getAttribute('data-frappe').split('||');
      champ.setAttribute('placeholder', exemples[0]);
      if (mouvementReduit.matches) return;
      // Les champs d'un même formulaire tapent l'un après l'autre (nom, e-mail, puis message), jamais
      // en même temps : un verrou par formulaire. Un exemple unique (nom, e-mail) n'est tapé qu'une
      // fois, et plus du tout dès que le visiteur a touché au champ.
      var form = champ.form || champ.closest('form') || document.body;
      var verrou = form._frappe || (form._frappe = { libre: true, file: [] });
      var unique = exemples.length === 1, fini = false, tient = false;
      var rang = 0, pos = 0, sens = 1, minut = null, actif = false, visible = false;
      function rendre() {
        if (!tient) return;
        tient = false;
        var suivant = verrou.file.shift();
        if (suivant) suivant(); else verrou.libre = true;
      }
      function prendre(suite) {
        if (verrou.libre) { verrou.libre = false; tient = true; suite(); }
        else verrou.file.push(function () { tient = true; suite(); });
      }
      function peutTaper() { return !fini && visible && document.activeElement !== champ && champ.value === ''; }
      function arreter() {
        clearTimeout(minut);
        actif = false;
        champ.setAttribute('placeholder', exemples[rang]);
        rendre();
      }
      function tic() {
        if (!peutTaper()) { arreter(); return; }
        var texte = exemples[rang];
        if (sens === 1) {
          pos += 1;
          champ.setAttribute('placeholder', texte.slice(0, pos));
          if (pos >= texte.length) {
            rendre();
            if (unique) { actif = false; fini = true; return; }
            sens = -1;
            minut = setTimeout(tic, 1900);
            return;
          }
          minut = setTimeout(tic, 38 + Math.random() * 45);
        } else {
          pos -= 2;
          champ.setAttribute('placeholder', texte.slice(0, Math.max(0, pos)));
          if (pos <= 0) { sens = 1; pos = 0; rang = (rang + 1) % exemples.length; minut = setTimeout(tic, 450); return; }
          minut = setTimeout(tic, 16);
        }
      }
      function demarrer() {
        if (actif || !peutTaper()) return;
        actif = true;
        prendre(function () {
          if (!peutTaper()) { actif = false; champ.setAttribute('placeholder', exemples[rang]); rendre(); return; }
          pos = 0; sens = 1;
          champ.setAttribute('placeholder', '');
          minut = setTimeout(tic, 350);
        });
      }
      champ.addEventListener('focus', function () { if (unique) fini = true; arreter(); });
      champ.addEventListener('input', function () { if (unique) fini = true; arreter(); });
      champ.addEventListener('blur', function () { setTimeout(demarrer, 600); });
      // Vide tant que son tour n'est pas venu : pas d'exemple complet qui disparaît puis se retape.
      if (champ.value === '') champ.setAttribute('placeholder', '');
      visibleQuand(champ, function (v) {
        visible = v;
        if (v) demarrer();
        else if (!actif && champ.getAttribute('placeholder') === '') champ.setAttribute('placeholder', exemples[rang]);
      }, 0.6);
    });
  }

  /* ---------- Carrousel (data-carrousel) ---------- */

  var donneesCas = null;
  function lireDonneesCas() {
    if (donneesCas) return donneesCas;
    var source = document.getElementById('cas-apercus');
    if (!source) return null;
    try { donneesCas = JSON.parse(source.textContent); } catch (err) { donneesCas = null; }
    return donneesCas;
  }

  // Détail d'un cas, inséré à côté de sa carte photo (textes repris des pages /cas-clients/<slug>).
  // Structure : .cas-detail > .cas-detail__interieur > .cas-detail__boite
  // (en-tête, corps qui défile si besoin, actions toujours visibles).
  function construireDetail(slug, d) {
    var bloc = elt('div', 'cas-detail');
    bloc.id = 'cas-detail-' + slug;
    bloc.setAttribute('data-no-reveal', '');
    var interieur = elt('div', 'cas-detail__interieur');
    var boite = elt('div', 'cas-detail__boite');
    interieur.appendChild(boite);
    bloc.appendChild(interieur);

    var haut = elt('div', 'cas-detail__haut');
    // Mobile : le détail s'ouvre en pleine largeur sous le carrousel ; il rappelle donc le client.
    var puce = elt('span', 'logo-puce cas-detail__logo');
    var logo = elt('img');
    logo.src = '/assets/cas/logos/' + slug + '.png';
    logo.alt = d.nom;
    if (d.logo) { logo.width = d.logo.l; logo.height = d.logo.h; }
    logo.loading = 'lazy';
    puce.appendChild(logo);
    var meta = elt('p', 'cas-detail__meta');
    meta.appendChild(elt('span', 'eyebrow', d.echelle));
    meta.appendChild(elt('span', null, d.meta));
    var gauche = elt('div', 'cas-detail__gauche');
    gauche.appendChild(puce);
    gauche.appendChild(meta);
    haut.appendChild(gauche);
    var fermer = elt('button', 'cas-detail__fermer');
    fermer.type = 'button';
    fermer.setAttribute('aria-label', 'Refermer le cas ' + d.nom);
    fermer.appendChild(icone('x', 18));
    haut.appendChild(fermer);
    boite.appendChild(haut);

    var corps = elt('div', 'cas-detail__corps');
    corps.tabIndex = 0;
    corps.setAttribute('role', 'group');
    corps.setAttribute('aria-label', 'Aperçu du cas ' + d.nom);
    // Titre déjà affiché sur la carte photo (grand écran : lecteurs d'écran seulement ; mobile : visible).
    corps.appendChild(elt('h3', 'cas-detail__titre', d.titre));
    corps.appendChild(elt('p', 'cas-detail__label', 'Situation'));
    corps.appendChild(elt('p', 'cas-detail__texte', d.situation));
    corps.appendChild(elt('p', 'cas-detail__label', 'Les enjeux de départ'));
    var liste = elt('ul', 'cas-detail__liste');
    d.enjeux.slice(0, 3).forEach(function (t) {
      var li = elt('li');
      li.appendChild(icone('check', 14));
      li.appendChild(elt('span', null, t));
      liste.appendChild(li);
    });
    corps.appendChild(liste);
    if (d.kpi) {
      var stat = elt('p', 'stat cas-detail__kpi');
      stat.appendChild(elt('span', 'stat__valeur', d.kpi[0]));
      stat.appendChild(elt('span', 'stat__libelle', d.kpi[1]));
      corps.appendChild(stat);
    }
    var dem = elt('div', 'cas-detail__demontre');
    dem.appendChild(elt('p', 'cas-detail__label', 'Ce que ce cas démontre'));
    dem.appendChild(elt('p', 'cas-detail__texte', d.demontre));
    corps.appendChild(dem);
    boite.appendChild(corps);

    var actions = elt('div', 'cas-detail__actions');
    var voir = elt('a', 'btn btn--noir', 'Voir le cas complet ');
    voir.href = '/cas-clients/' + slug;
    voir.appendChild(icone('arrow', 16));
    var parler = elt('a', 'link-caps', 'Parler d’une situation similaire');
    parler.href = '/nous-contacter?cas=' + slug;
    parler.setAttribute('data-prefill-cas', slug);
    actions.appendChild(voir);
    actions.appendChild(parler);
    boite.appendChild(actions);
    return bloc;
  }

  function initCarrousels() {
    toutes('[data-carrousel]').forEach(function (racine) {
      if (!une(racine, 'carrousel')) return;
      var piste = racine.querySelector('.carrousel__piste');
      var prec = racine.querySelector('[data-carrousel-prec]');
      var suiv = racine.querySelector('[data-carrousel-suiv]');
      var barre = racine.querySelector('.carrousel__progression span');
      if (!piste) return;
      var arreterAuto = function () {};
      var voulu = null;

      function items() { return toutes('.carrousel__item', piste).filter(function (el) { return !el.hidden; }); }
      function pas() {
        var item = items()[0];
        if (!item) return piste.clientWidth;
        var gap = parseFloat(getComputedStyle(piste).columnGap) || 0;
        return item.querySelector('.photo').getBoundingClientRect().width + gap;
      }
      function maj() {
        var max = piste.scrollWidth - piste.clientWidth;
        var x = Math.max(0, piste.scrollLeft);
        if (barre && !racine.classList.contains('is-minute')) {
          var part = piste.scrollWidth ? piste.clientWidth / piste.scrollWidth : 1;
          barre.style.width = (Math.min(1, part) * 100) + '%';
          barre.style.left = (piste.scrollWidth ? (x / piste.scrollWidth) * 100 : 0) + '%';
        }
        if (prec) prec.disabled = x <= 1;
        if (suiv) suiv.disabled = x >= max - 1;
      }
      if (prec) prec.addEventListener('click', function () { arreterAuto(); piste.scrollBy({ left: -pas(), behavior: 'smooth' }); });
      if (suiv) suiv.addEventListener('click', function () { arreterAuto(); piste.scrollBy({ left: pas(), behavior: 'smooth' }); });
      piste.addEventListener('scroll', function () { window.requestAnimationFrame(maj); }, { passive: true });
      window.addEventListener('resize', maj);

      /* Ouverture d'un cas dans le carrousel (cartes [data-cas-carte] + données #cas-apercus).
         Un seul cas ouvert à la fois ; `voulu` est l'état demandé.
         Grand écran : la largeur ouverte est posée d'un coup (is-ouvert), puis chaque image
         ne change que des transform (cartes suivantes) et un clip-path (détail). Chaque item
         garde sa progression (0 fermé, 1 ouvert) : un double clic ou un clic sur une autre
         carte en pleine animation repart de la position courante, sans saut.
         Mobile : la carte s'allonge vers le bas (grid-template-rows, transition CSS). */
      var donnees = lireDonneesCas();
      var boucle = null;
      var defil = null;
      function tousItems() { return toutes('.carrousel__item', piste).filter(function (el) { return el._detail; }); }
      function detailDe(item) { return item._detail; }

      /* Mobile : le détail s'ouvre en pleine largeur, dans un panneau placé juste sous le carrousel
         (la carte choisie reste marquée, les autres s'estompent). Le panneau ne dépasse jamais la
         hauteur de l'écran : son corps défile, les actions restent visibles. Un seul détail à la fois ;
         il retourne dans sa carte une fois le panneau refermé. */
      var panneau = null, interieurPanneau = null, minuteRetour = null;
      function panneauMobile() {
        if (panneau) return panneau;
        panneau = elt('div', 'carrousel__panneau');
        interieurPanneau = elt('div', 'carrousel__panneau-interieur');
        panneau.appendChild(interieurPanneau);
        piste.parentNode.insertBefore(panneau, piste.nextSibling);
        return panneau;
      }
      function rendreDetails(sauf) {
        tousItems().forEach(function (item) {
          var det = item._detail;
          if (det !== sauf && det.parentNode !== item) item.appendChild(det);
        });
      }
      function ouvrirMobile(cible, options) {
        var p = panneauMobile();
        var instant = options.instant || mouvementReduit.matches;
        clearTimeout(minuteRetour);
        if (cible) {
          var det = detailDe(cible);
          rendreDetails(det);
          if (det.parentNode !== interieurPanneau) interieurPanneau.appendChild(det);
          var deja = p.classList.contains('is-ouvert');
          p.classList.add('is-ouvert');
          if (!instant && deja) { det.classList.remove('is-entree'); void det.offsetWidth; det.classList.add('is-entree'); }
          if (!options.sansDefilement) {
            // Le panneau vient sous la barre de navigation (scroll-margin-top), sans à-coup.
            window.requestAnimationFrame(function () { p.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' }); });
          }
        } else {
          if (!p.classList.contains('is-ouvert')) { rendreDetails(null); return; }
          p.classList.remove('is-ouvert');
          minuteRetour = setTimeout(function () { if (!voulu) rendreDetails(null); }, instant ? 0 : DUREE_OUVERTURE + 60);
          if (options.depuis && !options.sansDefilement) {
            // Retour à la carte refermée
            var carte = carteDe(options.depuis);
            var r = carte.getBoundingClientRect();
            if (r.top < margeHaute() || r.bottom > window.innerHeight) racine.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
          }
        }
      }
      function carteDe(item) { return item.querySelector('[data-cas-carte]'); }
      function xContenu(item) { var premier = items()[0]; return item.offsetLeft - (premier ? premier.offsetLeft : 0); }

      function peindre() {
        var cumul = 0;
        items().forEach(function (item) {
          var tx = cumul > 0.01 ? 'translate3d(' + (-cumul).toFixed(2) + 'px,0,0)' : '';
          if (item.style.transform !== tx) item.style.transform = tx;
          var o = item._ouv;
          if (!o) return;
          var reste = 1 - o.p;
          var clip = reste > 0.0005 ? 'inset(0 ' + (o.largeur * reste).toFixed(2) + 'px 0 0 round 12px)' : '';
          var detail = detailDe(item);
          if (detail.style.clipPath !== clip) detail.style.clipPath = clip;
          cumul += o.ecart * reste;
        });
      }
      function finir() {
        tousItems().forEach(function (item) {
          var o = item._ouv;
          if (o && o.vers === 0) {
            item.classList.remove('is-ouvert');
            item._ouv = null;
            detailDe(item).style.clipPath = '';
          }
          detailDe(item).classList.remove('is-anime');
        });
        peindre();
        piste.classList.remove('is-anime');
        maj();
      }
      function tick(t) {
        boucle = null;
        var encore = false;
        tousItems().forEach(function (item) {
          var o = item._ouv;
          if (!o || o.fini) return;
          if (o.t0 === null) o.t0 = t;
          var k = o.duree > 0 ? Math.max(0, Math.min(1, (t - o.t0) / o.duree)) : 1;
          o.p = o.de + (o.vers - o.de) * adoucir(k);
          if (k >= 1) { o.p = o.vers; o.fini = true; } else encore = true;
        });
        if (defil) {
          if (defil.t0 === null) defil.t0 = t;
          var k = defil.duree > 0 ? Math.max(0, Math.min(1, (t - defil.t0) / defil.duree)) : 1;
          piste.scrollLeft = defil.de + (defil.vers - defil.de) * adoucir(k);
          if (k >= 1) defil = null; else encore = true;
        }
        peindre();
        if (encore) boucle = window.requestAnimationFrame(tick);
        else finir();
      }
      function relancer() {
        if (boucle) window.cancelAnimationFrame(boucle);
        boucle = null;
        tick(performance.now());
      }
      // Cible de défilement horizontal, calculée dans la mise en page finale (seul `cible` ouvert).
      function defilementVers(cible, duree) {
        var s = piste.scrollLeft, largeur = piste.clientWidth;
        var retraitAvant = function (item) {
          var r = 0;
          items().some(function (autre) {
            if (autre === item) return true;
            if (autre._ouv && autre !== cible) r += autre._ouv.ecart;
            return false;
          });
          return r;
        };
        var retraitTotal = 0;
        items().forEach(function (autre) { if (autre._ouv && autre !== cible) retraitTotal += autre._ouv.ecart; });
        var max = Math.max(0, piste.scrollWidth - retraitTotal - largeur);
        var vise = s;
        if (cible) {
          var x0 = xContenu(cible) - retraitAvant(cible);
          if (x0 < s - 1 || x0 + cible.offsetWidth > s + largeur + 1) vise = x0;
        } else {
          items().some(function (item) {
            if (!item._ouv) return false;
            var xa = xContenu(item) - retraitAvant(item);
            if (s > xa + 1) vise = xa;
            return true;
          });
        }
        vise = Math.max(0, Math.min(max, vise));
        // Un long trajet prend un peu plus de temps, pour garder une vitesse lisible.
        if (duree > 0) duree = Math.max(duree, Math.min(800, 300 + Math.abs(vise - s) * 0.4));
        defil = Math.abs(vise - s) > 1 ? { de: s, vers: vise, t0: null, duree: duree } : null;
      }

      function demander(cible, options) {
        options = options || {};
        var instant = options.instant || mouvementReduit.matches;
        voulu = cible;
        if (cible) arreterAuto();
        var large = ecranLarge.matches;
        var dureeMax = 0;
        // Carte et détail reliés visuellement ; les autres cartes s'effacent
        racine.classList.toggle('a-un-ouvert', !!cible);
        tousItems().forEach(function (item) {
          var ouvrir = item === cible;
          var detail = detailDe(item);
          item.classList.toggle('is-lie', ouvrir);
          carteDe(item).setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
          detail.inert = !ouvrir;
          if (!large) return;
          var o = item._ouv;
          if (ouvrir && !o) {
            var gap = parseFloat(getComputedStyle(item).columnGap) || 0;
            o = item._ouv = { p: 0, vers: 0, largeur: detail.offsetWidth, ecart: detail.offsetWidth + gap };
            item.classList.add('is-ouvert');
          }
          if (!o) return;
          var vers = ouvrir ? 1 : 0;
          if (o.vers === vers && !o.fini && !instant) { dureeMax = Math.max(dureeMax, o.duree); return; }
          if (o.vers === vers && o.p === vers) return;
          o.de = o.p;
          o.vers = vers;
          o.t0 = null;
          o.fini = false;
          o.duree = instant ? 0 : Math.max(240, DUREE_OUVERTURE * Math.abs(vers - o.p));
          dureeMax = Math.max(dureeMax, o.duree);
          detail.classList.add('is-anime');
        });
        if (large) {
          piste.classList.add('is-anime');
          defilementVers(cible, instant ? 0 : Math.max(dureeMax, 240));
          relancer();
        } else {
          if (cible) {
            // La carte choisie reste dans le champ du carrousel
            var r = cible.getBoundingClientRect(), p = piste.getBoundingClientRect();
            if (r.left < p.left - 1 || r.right > p.right + 1) piste.scrollTo({ left: piste.scrollLeft + r.left - p.left, behavior: instant ? 'auto' : 'smooth' });
          }
          ouvrirMobile(cible, options);
          setTimeout(maj, DUREE_OUVERTURE + 50);
        }
      }
      // Passage mobile / grand écran : on pose l'état final sans animation.
      function remettreAPlat() {
        if (boucle) window.cancelAnimationFrame(boucle);
        boucle = null;
        defil = null;
        if (ecranLarge.matches) {
          rendreDetails(null);
          if (panneau) panneau.classList.remove('is-ouvert');
        } else if (voulu) {
          ouvrirMobile(voulu, { instant: true, sansDefilement: true });
        }
        tousItems().forEach(function (item) {
          var ouvrir = item === voulu;
          item.style.transform = '';
          detailDe(item).style.clipPath = '';
          detailDe(item).classList.remove('is-anime');
          item.classList.toggle('is-ouvert', ouvrir && ecranLarge.matches);
          item._ouv = ouvrir && ecranLarge.matches
            ? { p: 1, vers: 1, fini: true, largeur: detailDe(item).offsetWidth, ecart: detailDe(item).offsetWidth + (parseFloat(getComputedStyle(item).columnGap) || 0) }
            : null;
        });
        piste.classList.remove('is-anime');
        maj();
      }
      if (ecranLarge.addEventListener) ecranLarge.addEventListener('change', remettreAPlat);
      ['wheel', 'touchstart'].forEach(function (type) {
        piste.addEventListener(type, function () { defil = null; }, { passive: true });
      });

      if (donnees) {
        toutes('[data-cas-carte]', piste).forEach(function (carte) {
          var slug = carte.getAttribute('data-cas-carte');
          var d = donnees[slug];
          if (!d) return;
          var item = carte.closest('.carrousel__item');
          var detail = construireDetail(slug, d);
          detail.inert = true;
          item.appendChild(detail);
          item._detail = detail;
          carte.setAttribute('aria-expanded', 'false');
          carte.setAttribute('aria-controls', detail.id);
          carte.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
            e.preventDefault();
            if (voulu === item) demander(null, { depuis: item }); else demander(item);
          });
          detail.querySelector('.cas-detail__fermer').addEventListener('click', function () {
            demander(null, { depuis: item });
            carte.focus({ preventScroll: true });
          });
        });
        racine.addEventListener('keydown', function (e) {
          if (e.key !== 'Escape' || !voulu) return;
          e.stopPropagation();
          var item = voulu;
          demander(null, { depuis: item });
          carteDe(item).focus({ preventScroll: true });
        });
      }
      racine._ouvrirCas = function (slug) {
        var carte = piste.querySelector('[data-cas-carte="' + slug + '"]');
        if (!carte) return false;
        var item = carte.closest('.carrousel__item');
        if (item.hidden) {
          demander(null, { instant: true });
          toutes('[data-carrousel-filtre]', racine).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-carrousel-filtre') === 'tous' ? 'true' : 'false'); });
          toutes('.carrousel__item', piste).forEach(function (el) { el.hidden = false; });
          piste.classList.remove('is-filtrage');
        }
        if (voulu !== item) demander(item);
        return true;
      };

      // Filtres : fondu, puis réorganisation
      var filtres = toutes('[data-carrousel-filtre]', racine);
      filtres.forEach(function (bouton) {
        bouton.addEventListener('click', function () {
          var valeur = bouton.getAttribute('data-carrousel-filtre');
          arreterAuto();
          if (voulu) demander(null, { instant: true });
          filtres.forEach(function (b) { b.setAttribute('aria-pressed', b === bouton ? 'true' : 'false'); });
          function appliquer() {
            toutes('.carrousel__item', piste).forEach(function (item) {
              item.hidden = valeur !== 'tous' && item.getAttribute('data-echelle') !== valeur;
            });
            piste.scrollLeft = 0;
            maj();
            piste.classList.remove('is-filtrage');
          }
          if (mouvementReduit.matches) { appliquer(); return; }
          piste.classList.add('is-filtrage');
          setTimeout(appliquer, 220);
        });
      });
      maj();

      // Défilement automatique (data-carrousel-auto="5000") avec barre de progression synchronisée.
      var delai = parseInt(racine.getAttribute('data-carrousel-auto'), 10);
      if (!delai || mouvementReduit.matches) return;
      var arrete = false, survol = false, focus = false, visible = false, minuteurAuto = null;
      function lancerBarre() {
        if (!barre) return;
        racine.classList.add('is-minute');
        barre.style.left = '0';
        barre.style.transition = 'none';
        barre.style.width = '0%';
        void barre.offsetWidth;
        barre.style.transition = 'width ' + delai + 'ms linear';
        barre.style.width = '100%';
      }
      function figerBarre() {
        if (!barre) return;
        barre.style.transition = 'none';
        barre.style.width = '0%';
      }
      function planifier() {
        clearTimeout(minuteurAuto);
        if (arrete || survol || focus || !visible || document.hidden || voulu) { if (!arrete) figerBarre(); return; }
        lancerBarre();
        minuteurAuto = setTimeout(avancer, delai);
      }
      function avancer() {
        var max = piste.scrollWidth - piste.clientWidth;
        if (piste.scrollLeft >= max - 2) piste.scrollTo({ left: 0, behavior: 'smooth' });
        else piste.scrollBy({ left: pas(), behavior: 'smooth' });
        planifier();
      }
      arreterAuto = function () {
        if (arrete) return;
        arrete = true;
        clearTimeout(minuteurAuto);
        racine.setAttribute('data-carrousel-arrete', '');
        racine.classList.remove('is-minute');
        if (barre) { barre.style.transition = ''; }
        maj();
      };
      ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (type) {
        piste.addEventListener(type, arreterAuto, { passive: true });
      });
      racine.addEventListener('mouseenter', function () { survol = true; planifier(); });
      racine.addEventListener('mouseleave', function () { survol = false; planifier(); });
      racine.addEventListener('focusin', function () { focus = true; planifier(); });
      racine.addEventListener('focusout', function (e) {
        if (e.relatedTarget && racine.contains(e.relatedTarget)) return;
        focus = false; planifier();
      });
      document.addEventListener('visibilitychange', planifier);
      visibleQuand(racine, function (v) { visible = v; planifier(); }, 0.35);
    });
  }

  /* ---------- Logos : un clic ouvre le cas dans le carrousel de la page ---------- */

  document.addEventListener('click', function (e) {
    var lien = e.target.closest('[data-cas-ouvrir]');
    if (!lien || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
    var racine = document.querySelector('[data-carrousel]');
    if (!racine || !racine._ouvrirCas) return;
    e.preventDefault();
    var slug = lien.getAttribute('data-cas-ouvrir');
    (racine.closest('section') || racine).scrollIntoView({ behavior: mouvementReduit.matches ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () {
      if (racine._ouvrirCas(slug)) {
        var carte = racine.querySelector('[data-cas-carte="' + slug + '"]');
        if (carte) carte.focus({ preventScroll: true });
      }
    }, mouvementReduit.matches ? 0 : 600);
  });

  /* ---------- Vos enjeux : une carte s'ouvre pour montrer les cas liés ---------- */
  /* Trois variantes d'ouverture, comparables avec ?enjeux=a|b|c (sélecteur en bas d'écran) :
     a = séparé (la carte, puis ses cas dans un panneau à part, 16 px dessous),
     b = volet latéral (le détail remplace l'introduction dans la colonne de gauche, dès 1024 px ;
         en dessous, comportement a), c = carte agrandie (sur deux colonnes, ses cas dedans).
     Sans paramètre : b. */

  var VARIANTES = [['a', 'A Séparé'], ['b', 'B Volet latéral'], ['c', 'C Carte agrandie']];
  function varianteDemandee() {
    var v = (new URLSearchParams(window.location.search).get('enjeux') || '').toLowerCase();
    return /^[abc]$/.test(v) ? v : null;
  }

  function initEnjeux() {
    var demandee = varianteDemandee();
    var choisie = demandee || 'b';
    var large = window.matchMedia('(min-width: 1024px)');
    var grilles = [];

    toutes('[data-enjeux]').forEach(function (grille) {
      if (!une(grille, 'enjeux')) return;
      var section = grille.closest('.home-enjeux') || grille.parentNode;
      var cartes = toutes('.enjeu', grille);
      var interagi = false, visible = false, rang = 0, minut = null, mode = null;

      // Ordre visuel : la rangée de cartes, puis les panneaux de cette rangée en pleine largeur.
      // L'ordre du DOM (bouton puis son panneau) reste celui du clavier et des lecteurs d'écran.
      var colonnes = 0;
      function ordonner() {
        var n = getComputedStyle(grille).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
        if (n === colonnes) return;
        colonnes = n;
        cartes.forEach(function (carte, i) {
          var base = Math.floor(i / n) * (n + 1);
          carte.querySelector('.enjeu__bouton').style.order = base + (i % n);
          carte.querySelector('.enjeu__panneau').style.order = base + n;
        });
      }

      // En-tête du panneau (variante a) : nomme l'enjeu choisi, le lien se lit sans que les blocs se touchent.
      cartes.forEach(function (carte) {
        var contenu = carte.querySelector('.enjeu__contenu');
        if (!contenu || contenu.querySelector('.enjeu__entete')) return;
        var entete = elt('p', 'enjeu__entete');
        entete.appendChild(elt('span', 'enjeu__entete-titre', carte.querySelector('.carte-lien__titre').textContent.trim()));
        entete.appendChild(document.createTextNode(' : des situations proches'));
        contenu.insertBefore(entete, contenu.firstChild);
      });

      // Volet latéral (variante b) : posé dans la colonne d'introduction, en pile avec elle.
      var texte = section.querySelector('.plateau__texte');
      var intro = texte && texte.querySelector('.plateau__intro');
      var volet = null, voletTitre, voletTexte, voletCas, voletParler, voletFermer;
      if (intro) {
        var pile = elt('div', 'enjeux-pile');
        intro.parentNode.insertBefore(pile, intro);
        pile.appendChild(intro);
        volet = elt('div', 'enjeux-volet');
        volet.id = 'enjeux-volet';
        volet.setAttribute('role', 'region');
        volet.setAttribute('aria-label', 'Enjeu sélectionné et cas clients liés');
        var haut = elt('div', 'enjeux-volet__haut');
        haut.appendChild(elt('p', 'eyebrow eyebrow--lg', 'Vos enjeux'));
        voletFermer = elt('button', 'enjeux-volet__fermer');
        voletFermer.type = 'button';
        voletFermer.setAttribute('aria-label', 'Refermer et revenir à l’introduction');
        voletFermer.appendChild(icone('x', 18));
        haut.appendChild(voletFermer);
        volet.appendChild(haut);
        voletTitre = elt('h3', 'enjeux-volet__titre');
        voletTexte = elt('p', 'enjeux-volet__texte');
        voletCas = elt('ul', 'enjeux-volet__cas');
        voletParler = elt('a', 'link-caps enjeu__parler');
        volet.appendChild(voletTitre);
        volet.appendChild(voletTexte);
        volet.appendChild(elt('p', 'enjeux-volet__label', 'Des situations proches, dans nos cas clients'));
        volet.appendChild(voletCas);
        volet.appendChild(voletParler);
        volet.inert = true;
        pile.appendChild(volet);
      }
      var changement = null;
      function remplirVolet(carte) {
        if (!volet) return;
        function afficher() {
          if (carte) {
            voletTitre.textContent = carte.querySelector('.carte-lien__titre').textContent.trim();
            voletTexte.textContent = carte.querySelector('.carte-lien__texte').textContent.trim();
            voletCas.textContent = '';
            toutes('.enjeu__cas > li', carte).forEach(function (li) {
              // Mini-carte compacte : logo, titre, flèche ; « Voir le cas » reste lu par les lecteurs d'écran
              var copie = li.cloneNode(true);
              var lien = copie.querySelector('.enjeu-cas__lien');
              if (lien) {
                var ico = lien.querySelector('svg');
                lien.textContent = '';
                lien.appendChild(elt('span', 'visually-hidden', 'Voir le cas'));
                if (ico) lien.appendChild(ico);
              }
              voletCas.appendChild(copie);
            });
            var parler = carte.querySelector('.enjeu__parler').cloneNode(true);
            volet.replaceChild(parler, voletParler);
            voletParler = parler;
          }
          section.classList.toggle('is-volet', !!carte);
          volet.inert = !carte;
        }
        clearTimeout(changement);
        volet.classList.remove('is-change');
        if (carte && section.classList.contains('is-volet') && !mouvementReduit.matches) {
          // D'un enjeu à l'autre : fondu bref du contenu, la colonne ne bouge pas.
          volet.classList.add('is-change');
          changement = setTimeout(function () { afficher(); volet.classList.remove('is-change'); }, 160);
        } else {
          afficher();
        }
      }

      function etat(carte, ouvrir) {
        cartes.forEach(function (c) {
          var o = c === carte && ouvrir;
          c.classList.toggle('is-ouvert', o);
          c.querySelector('.enjeu__bouton').setAttribute('aria-expanded', o ? 'true' : 'false');
          c.querySelector('.enjeu__panneau').inert = mode === 'b' || !o;
        });
        // Les autres cartes s'effacent tant qu'un enjeu est ouvert (très peu en variante b)
        grille.classList.toggle('a-une-ouverte', !!ouvrir);
      }

      // Change de variante (paramètre, sélecteur ou passage sous 1024 px) : tout se referme.
      function appliquerMode() {
        var m = choisie === 'b' && !large.matches ? 'a' : choisie;
        if (m === mode) return;
        mode = m;
        etat(null, false);
        remplirVolet(null);
        section.setAttribute('data-enjeux-mode', m);
        cartes.forEach(function (c) {
          var bouton = c.querySelector('.enjeu__bouton');
          bouton.setAttribute('aria-controls', m === 'b' && volet ? volet.id : c.querySelector('.enjeu__panneau').id);
        });
        colonnes = 0;
        ordonner();
      }

      // Ouvrir ou fermer : seule la classe change, la hauteur du panneau suit en CSS
      // (grid-template-rows 0fr vers 1fr), interruptible à tout moment.
      function basculer(carte, ouvrir) {
        var bouton = carte.querySelector('.enjeu__bouton');
        if (mode === 'b') {
          etat(carte, ouvrir);
          remplirVolet(ouvrir ? carte : null);
          return;
        }
        var hautAvant = bouton.getBoundingClientRect().top;
        var avant = mode === 'c' && !mouvementReduit.matches
          ? cartes.map(function (c) { return c.getBoundingClientRect(); }) : null;
        etat(carte, ouvrir);
        if (mouvementReduit.matches) {
          // Sans animation, mais la carte ouverte vient tout de même sous la barre de navigation (mobile)
          if (ouvrir && !ecranLarge.matches) window.scrollBy(0, carte.querySelector('.enjeu__bouton').getBoundingClientRect().top - margeHaute());
          return;
        }
        var interieur = carte.querySelector('.enjeu__interieur');
        var decalage = 0, ancre = bouton;
        if (mode === 'c') {
          // Positions finales (avant toute animation), puis FLIP : chaque carte part de son ancienne place.
          var apres = cartes.map(function (c) { return c.getBoundingClientRect(); });
          var hautApres = apres[cartes.indexOf(carte)].top;
          cartes.forEach(function (c, i) {
            var a = avant[i], b = apres[i];
            var dx = a.left - b.left, dy = a.top - b.top, dl = Math.abs(a.width - b.width) > 1;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !dl) return;
            var de = { transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, vers = { transform: 'none' };
            if (dl) { de.width = a.width + 'px'; vers.width = b.width + 'px'; }
            c.animate([de, vers], { duration: DUREE_OUVERTURE, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
          });
          ancre = grille;
          if (ouvrir) {
            var basC = hautApres + bouton.offsetHeight + interieur.scrollHeight;
            decalage = ecranLarge.matches
              ? Math.max(0, Math.min(basC - (window.innerHeight - 24), hautApres - margeHaute()))
              : hautApres - margeHaute();
          } else if (hautApres < margeHaute()) {
            decalage = hautApres - margeHaute();
          }
        } else if (ouvrir) {
          // Bas du panneau une fois ouvert, mesuré par rapport à la carte qui ne bouge pas.
          var panneau = carte.querySelector('.enjeu__panneau');
          var bas = hautAvant + (panneau.getBoundingClientRect().top - bouton.getBoundingClientRect().top)
            + interieur.scrollHeight;
          // Mobile : la carte ouverte vient se placer sous la barre de navigation, son contenu dessous.
          decalage = ecranLarge.matches
            ? Math.max(0, Math.min(bas - (window.innerHeight - 24), hautAvant - margeHaute()))
            : hautAvant - margeHaute();
        } else if (hautAvant < margeHaute()) {
          decalage = hautAvant - margeHaute();
        }
        guiderFenetre(ancre, decalage, DUREE_OUVERTURE + 30);
      }

      function ouverte() { return grille.querySelector('.enjeu.is-ouvert'); }
      function refermer() {
        var o = ouverte();
        if (!o) return;
        basculer(o, false);
        o.querySelector('.enjeu__bouton').focus({ preventScroll: true });
      }
      cartes.forEach(function (carte) {
        var bouton = carte.querySelector('.enjeu__bouton');
        carte.querySelector('.enjeu__panneau').inert = true;
        // Bouton « Refermer » au bas du contenu ouvert (affiché sur mobile)
        var contenu = carte.querySelector('.enjeu__contenu');
        if (contenu && !contenu.querySelector('.enjeu__fermer')) {
          var fermer = elt('button', 'enjeu__fermer');
          fermer.type = 'button';
          fermer.appendChild(elt('span', null, 'Refermer'));
          fermer.appendChild(icone('x', 16));
          fermer.addEventListener('click', function () {
            basculer(carte, false);
            bouton.focus({ preventScroll: true });
          });
          contenu.appendChild(fermer);
        }
        bouton.addEventListener('click', function () {
          arreterInvitation();
          basculer(carte, bouton.getAttribute('aria-expanded') !== 'true');
        });
      });
      if (voletFermer) voletFermer.addEventListener('click', refermer);
      section.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && ouverte()) refermer();
      });

      appliquerMode();
      window.addEventListener('resize', function () { window.requestAnimationFrame(function () { appliquerMode(); ordonner(); }); });
      grilles.push(function (v) { choisie = v; appliquerMode(); });

      // Invitation discrète : une carte à la fois est mise en avant, jusqu'à la première interaction.
      function arreterInvitation() {
        interagi = true;
        clearTimeout(minut);
        cartes.forEach(function (c) { c.classList.remove('is-invite'); });
      }
      function inviter() {
        clearTimeout(minut);
        if (interagi || !visible || document.hidden || ouverte()) return;
        cartes.forEach(function (c) { c.classList.remove('is-invite'); });
        cartes[rang % cartes.length].classList.add('is-invite');
        rang += 1;
        minut = setTimeout(inviter, 3200);
      }
      ['pointerenter', 'pointerdown', 'focusin', 'keydown'].forEach(function (type) {
        grille.addEventListener(type, arreterInvitation);
      });
      if (!mouvementReduit.matches) {
        visibleQuand(grille, function (v) {
          visible = v;
          if (v) minut = setTimeout(inviter, 2200);
          else { clearTimeout(minut); cartes.forEach(function (c) { c.classList.remove('is-invite'); }); }
        }, 0.4);
      }
    });

    // Sélecteur discret en bas d'écran, seulement quand ?enjeux= est présent dans l'adresse.
    if (!demandee || !grilles.length || document.querySelector('.variantes')) return;
    var barre = elt('nav', 'variantes');
    barre.setAttribute('aria-label', 'Comparer les variantes d’ouverture des enjeux');
    var boutons = VARIANTES.map(function (v) {
      var b = elt('button', 'variantes__bouton', v[1]);
      b.type = 'button';
      b.setAttribute('aria-pressed', v[0] === choisie ? 'true' : 'false');
      b.addEventListener('click', function () {
        choisie = v[0];
        boutons.forEach(function (x, i) { x.setAttribute('aria-pressed', VARIANTES[i][0] === choisie ? 'true' : 'false'); });
        var url = new URL(window.location.href);
        url.searchParams.set('enjeux', choisie);
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        grilles.forEach(function (f) { f(choisie); });
      });
      barre.appendChild(b);
      return b;
    });
    document.body.appendChild(barre);
  }

  /* ---------- Hero : le titre apparaît ligne par ligne ([data-lignes]) ---------- */

  function initLignes() {
    if (mouvementReduit.matches) {
      toutes('[data-lignes]').forEach(function (t) { t.classList.add('lignes-pret'); });
      return;
    }
    toutes('[data-lignes]').forEach(function (titre) {
      if (!une(titre, 'lignes')) return;
      var texte = titre.textContent.trim();
      var mots = texte.split(/\s+/);
      titre.textContent = '';
      var spans = mots.map(function (m, i) {
        var s = elt('span', 'ligne-mot', m);
        titre.appendChild(s);
        if (i < mots.length - 1) titre.appendChild(document.createTextNode(' '));
        return s;
      });
      // Regroupe les mots par ligne affichée
      var lignes = [], courante = null, haut = null;
      spans.forEach(function (s) {
        if (haut === null || Math.abs(s.offsetTop - haut) > 4) { courante = []; lignes.push(courante); haut = s.offsetTop; }
        courante.push(s.textContent);
      });
      titre.textContent = '';
      titre.setAttribute('aria-label', texte);
      lignes.forEach(function (ligne, i) {
        var l = elt('span', 'ligne');
        l.setAttribute('aria-hidden', 'true');
        var interieur = elt('span', 'ligne__texte', ligne.join(' '));
        interieur.style.animationDelay = (120 + i * 110) + 'ms';
        l.appendChild(interieur);
        titre.appendChild(l);
      });
      titre.classList.add('lignes-pret');
      // Une fois l'animation finie, on rend un titre normal (retour à la ligne libre).
      setTimeout(function () {
        titre.textContent = texte;
        titre.removeAttribute('aria-label');
      }, 120 + lignes.length * 110 + 700);
    });
  }

  /* ---------- Ils en parlent : citation mot à mot, rotation et promotion au clic ---------- */

  function lireTemoignage(fig, principal) {
    if (principal) {
      return {
        citation: fig.querySelector('.temoignages__citation p').textContent,
        nom: fig.querySelector('.temoin__nom').textContent,
        role: fig.querySelector('.temoin__role').textContent,
        photo: fig.querySelector('.temoin__photo').getAttribute('src'),
        logo: lireLogo(fig)
      };
    }
    var legende = fig.querySelector('figcaption').textContent;
    var i = legende.indexOf(',');
    return {
      citation: fig.querySelector('blockquote p').textContent,
      nom: legende.slice(0, i).trim(),
      role: legende.slice(i + 1).trim(),
      photo: fig.querySelector('.temoin__photo').getAttribute('src'),
      logo: lireLogo(fig)
    };
  }
  // Logo de l'entreprise du témoin : image en couleur, ou nom en toutes lettres quand aucun fichier n'existe
  function lireLogo(fig) {
    var l = fig.querySelector('.temoin__logo');
    if (!l) return null;
    return l.tagName === 'IMG' ? { src: l.getAttribute('src'), w: l.getAttribute('width'), h: l.getAttribute('height') } : { texte: l.textContent };
  }
  function ecrireLogo(fig, logo, parent) {
    var ancien = fig.querySelector('.temoin__logo');
    if (!logo) { if (ancien) ancien.remove(); return; }
    var nouveau;
    if (logo.src) {
      nouveau = elt('img', 'temoin__logo');
      nouveau.src = logo.src;
      nouveau.alt = '';
      nouveau.width = logo.w;
      nouveau.height = logo.h;
    } else {
      nouveau = elt('span', 'temoin__logo temoin__logo--texte', logo.texte);
      nouveau.setAttribute('aria-hidden', 'true');
    }
    if (ancien) ancien.replaceWith(nouveau); else parent.appendChild(nouveau);
  }
  function ecrireTemoignage(fig, t, principal) {
    if (principal) {
      fig.querySelector('.temoignages__citation p').textContent = t.citation;
      fig.querySelector('.temoin__nom').textContent = t.nom;
      fig.querySelector('.temoin__role').textContent = t.role;
      ecrireLogo(fig, t.logo, fig.querySelector('.temoin'));
    } else {
      fig.querySelector('blockquote p').textContent = t.citation;
      fig.querySelector('figcaption').textContent = t.nom + ', ' + t.role;
      fig.querySelector('.temoignages__promouvoir .visually-hidden').textContent = 'Afficher en grand le témoignage de ' + t.nom;
      ecrireLogo(fig, t.logo, fig.querySelector('.temoignages__court-texte'));
    }
    fig.querySelector('.temoin__photo').setAttribute('src', t.photo);
  }

  function initTemoignages() {
    toutes('[data-temoignages]').forEach(function (bloc) {
      if (!une(bloc, 'temoignages')) return;
      var principal = bloc.querySelector('.temoignages__principal');
      var courts = toutes('.temoignages__court', bloc);
      var visible = false, rang = 0, minut = null, enCours = false;

      function promouvoir(fig, parUtilisateur) {
        if (enCours) return;
        enCours = true;
        var haut = lireTemoignage(principal, true), bas = lireTemoignage(fig, false);
        var duree = mouvementReduit.matches ? 0 : 320;
        principal.classList.add('is-fondu');
        fig.classList.add('is-fondu');
        principal.setAttribute('aria-live', parUtilisateur ? 'polite' : 'off');
        setTimeout(function () {
          ecrireTemoignage(principal, bas, true);
          ecrireTemoignage(fig, haut, false);
          principal.classList.remove('is-fondu');
          fig.classList.remove('is-fondu');
          enCours = false;
        }, duree);
      }
      /* Rotation continue toutes les 6 s. Un clic choisit un témoignage : la rotation reprend
         10 s plus tard, jamais arrêtée pour de bon. Pause seulement pendant le survol à la souris
         (ou tant que le clavier est sur une carte). Rien ne tourne avec « réduire les animations ». */
      var INTERVALLE = 6000, APRES_CLIC = 10000;
      var survol = false, focusClavier = false, repriseApres = 0;
      function planifier(delai) {
        clearTimeout(minut);
        if (mouvementReduit.matches || !visible || document.hidden || survol || focusClavier) return;
        delai = Math.max(delai || INTERVALLE, repriseApres - Date.now());
        minut = setTimeout(function () {
          if (survol || focusClavier || !visible || document.hidden) return;
          promouvoir(courts[rang % courts.length], false);
          rang += 1;
          planifier(INTERVALLE);
        }, delai);
      }
      courts.forEach(function (fig) {
        fig.querySelector('.temoignages__promouvoir').addEventListener('click', function () {
          promouvoir(fig, true);
          repriseApres = Date.now() + APRES_CLIC;
          planifier(APRES_CLIC);
        });
      });
      bloc.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        survol = true;
        clearTimeout(minut);
      });
      bloc.addEventListener('pointerleave', function (e) {
        if (!survol) return;
        survol = false;
        planifier(INTERVALLE);
      });
      bloc.addEventListener('focusin', function (e) {
        var t = e.target;
        if (t.matches && t.matches(':focus-visible')) { focusClavier = true; clearTimeout(minut); }
      });
      bloc.addEventListener('focusout', function (e) {
        if (bloc.contains(e.relatedTarget)) return;
        if (focusClavier) { focusClavier = false; planifier(INTERVALLE); }
      });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) planifier(INTERVALLE); });
      if (!mouvementReduit.matches) visibleQuand(bloc, function (v) { visible = v; if (v) planifier(INTERVALLE); else clearTimeout(minut); }, 0.4);

      // Citation principale révélée mot à mot à la première apparition
      var citation = principal.querySelector('[data-mots] p');
      if (citation && !mouvementReduit.matches) {
        var texte = citation.textContent;
        var mots = texte.split(' ');
        citation.textContent = '';
        citation.setAttribute('aria-label', texte);
        mots.forEach(function (m, i) {
          var s = elt('span', 'mot', m);
          s.setAttribute('aria-hidden', 'true');
          s.style.transitionDelay = (i * 18) + 'ms';
          citation.appendChild(s);
          if (i < mots.length - 1) citation.appendChild(document.createTextNode(' '));
        });
        var vu = false;
        visibleQuand(citation, function (v) {
          if (!v || vu) return;
          vu = true;
          citation.classList.add('is-mots');
          setTimeout(function () { citation.textContent = texte; citation.removeAttribute('aria-label'); }, mots.length * 18 + 600);
        }, 0.5);
      }
    });
  }

  /* ---------- Hero : parcours interactif (data-hero-parcours) ----------
     Un clic sur l'une des trois situations ne quitte plus la page : la carte s'agrandit sur place
     (grid-template-rows 0fr vers 1fr, comme les enjeux) et déroule quatre étapes : la situation,
     l'accompagnement, le cas le plus proche, puis le contact pré-rempli. « Suivant », « Retour »,
     points de progression, × pour revenir à la liste, Échap aussi. Textes : #parcours-hero (pages
     offre) et #cas-apercus (pages cas), mot pour mot. */
  var ETAPES_PARCOURS = ['La situation', 'Notre accompagnement', 'Un cas proche', 'Parlons-en'];

  function construireParcours(cle, p, cas) {
    var racine = elt('div', 'parcours');
    racine.setAttribute('role', 'group');
    racine.setAttribute('aria-label', 'Parcours : ' + p.situation);

    var haut = elt('div', 'parcours__haut');
    var progression = elt('div', 'parcours__progression');
    var points = elt('ol', 'parcours__points');
    points.setAttribute('aria-hidden', 'true');
    ETAPES_PARCOURS.forEach(function () { points.appendChild(elt('li')); });
    progression.appendChild(points);
    progression.appendChild(elt('p', 'parcours__nom-etape'));
    haut.appendChild(progression);
    var fermer = elt('button', 'parcours__fermer');
    fermer.type = 'button';
    fermer.setAttribute('aria-label', 'Revenir aux situations');
    fermer.appendChild(icone('x', 18));
    haut.appendChild(fermer);
    racine.appendChild(haut);

    var etapes = elt('div', 'parcours__etapes');
    function etape(i) {
      var bloc = elt('section', 'parcours__etape');
      bloc.setAttribute('aria-label', ETAPES_PARCOURS[i]);
      etapes.appendChild(bloc);
      return bloc;
    }
    function titre(bloc, texte) {
      var h = elt('h3', 'parcours__titre', texte);
      h.tabIndex = -1;
      bloc.appendChild(h);
      return h;
    }
    function puceEchelle(bloc) {
      var puce = elt('p', 'parcours__echelle');
      puce.appendChild(icone(p.icone, 16));
      puce.appendChild(elt('span', null, p.echelle));
      bloc.appendChild(puce);
    }

    // 1. La situation, formulée comme un problème
    var e1 = etape(0);
    puceEchelle(e1);
    titre(e1, p.situation);
    e1.appendChild(elt('p', 'parcours__texte parcours__texte--lg', p.probleme));

    // 2. Comment Scoaché l'accompagne : l'échelle et trois étapes
    var e2 = etape(1);
    puceEchelle(e2);
    titre(e2, p.promesse);
    var liste = elt('ol', 'parcours__liste');
    p.etapes.forEach(function (et, i) {
      var li = elt('li');
      li.appendChild(elt('span', 'parcours__num', String(i + 1)));
      var t = elt('span', 'parcours__liste-texte');
      t.appendChild(elt('strong', null, et[0]));
      t.appendChild(elt('span', null, et[1]));
      li.appendChild(t);
      liste.appendChild(li);
    });
    e2.appendChild(liste);
    var voirOffre = elt('a', 'link-caps', 'Voir le ' + p.echelle.charAt(0).toLowerCase() + p.echelle.slice(1));
    voirOffre.href = p.lien;
    e2.appendChild(voirOffre);

    // 3. Le cas le plus proche
    var e3 = etape(2);
    if (cas) {
      var puce = elt('span', 'parcours__logo');
      var img = elt('img');
      img.src = '/assets/cas/logos/' + p.cas + '.png';
      img.alt = cas.nom;
      if (cas.logo) { img.width = cas.logo.l; img.height = cas.logo.h; }
      puce.appendChild(img);
      e3.appendChild(puce);
      titre(e3, cas.titre);
      var grille = elt('div', 'parcours__cas');
      var defi = elt('div', 'parcours__cas-bloc');
      defi.appendChild(elt('p', 'parcours__label', 'Le défi'));
      defi.appendChild(elt('p', 'parcours__texte', cas.defi));
      grille.appendChild(defi);
      var change = elt('div', 'parcours__cas-bloc');
      change.appendChild(elt('p', 'parcours__label', 'Ce qui a changé'));
      if (cas.kpi) {
        var kpi = elt('p', 'parcours__kpi');
        kpi.appendChild(elt('span', 'parcours__kpi-valeur', cas.kpi[0]));
        kpi.appendChild(elt('span', 'parcours__kpi-libelle', cas.kpi[1]));
        change.appendChild(kpi);
      }
      change.appendChild(elt('p', 'parcours__texte', cas.change));
      grille.appendChild(change);
      e3.appendChild(grille);
      var voirCas = elt('a', 'link-caps', 'Voir le cas');
      voirCas.href = '/cas-clients/' + p.cas;
      e3.appendChild(voirCas);
    }

    // 4. Le contact, pré-rempli avec la situation
    var e4 = etape(3);
    puceEchelle(e4);
    titre(e4, 'Une situation à discuter ? Parlons-en, sans engagement.');
    e4.appendChild(elt('p', 'parcours__texte', p.situation + ', ' + p.echelle.charAt(0).toLowerCase() + p.echelle.slice(1) + ' : le formulaire de contact reprend votre situation.'));
    var cta = elt('a', 'btn btn--noir btn--lg parcours__cta', 'Nous contacter ');
    cta.href = '/nous-contacter?sujet=' + p.sujet;
    cta.setAttribute('data-prefill', p.sujet);
    cta.setAttribute('data-prefill-message', p.message);
    cta.appendChild(icone('arrow', 18));
    e4.appendChild(cta);
    racine.appendChild(etapes);

    var nav = elt('div', 'parcours__nav');
    var retour = elt('button', 'parcours__retour');
    retour.type = 'button';
    retour.appendChild(icone('arrow', 16));
    retour.appendChild(elt('span', null, 'Retour'));
    var suivant = elt('button', 'btn btn--noir parcours__suivant');
    suivant.type = 'button';
    suivant.appendChild(elt('span', null, 'Suivant'));
    suivant.appendChild(icone('arrow', 16));
    nav.appendChild(retour);
    nav.appendChild(suivant);
    racine.appendChild(nav);
    return racine;
  }

  function initParcoursHero() {
    var zone = document.querySelector('[data-hero-parcours]');
    var source = document.getElementById('parcours-hero');
    if (!zone || !source || !une(zone, 'parcours')) return;
    var donnees;
    try { donnees = JSON.parse(source.textContent); } catch (err) { return; }
    var carte = zone.closest('.hero__carte');
    var vueListe = carte.querySelector('[data-hero-liste]');
    var interieur = zone.querySelector('.hero__vue-interieur');
    var cas = lireDonneesCas() || {};
    var parcours = null, rang = 0, declencheur = null;
    zone.inert = true;

    function etapes() { return toutes('.parcours__etape', parcours); }
    function montrer(i, focus) {
      var liste = etapes();
      rang = Math.max(0, Math.min(liste.length - 1, i));
      liste.forEach(function (bloc, j) {
        bloc.classList.toggle('is-active', j === rang);
        bloc.classList.toggle('is-passee', j < rang);
        bloc.inert = j !== rang;
      });
      toutes('.parcours__points li', parcours).forEach(function (pt, j) {
        pt.classList.toggle('is-active', j === rang);
        pt.classList.toggle('is-fait', j < rang);
      });
      parcours.querySelector('.parcours__nom-etape').textContent = ETAPES_PARCOURS[rang];
      var nom = parcours.querySelector('.parcours__nom-etape');
      nom.setAttribute('aria-label', 'Étape ' + (rang + 1) + ' sur ' + liste.length + ', ' + ETAPES_PARCOURS[rang]);
      var suivant = parcours.querySelector('.parcours__suivant');
      suivant.hidden = rang === liste.length - 1;
      parcours.querySelector('.parcours__retour span').textContent = rang === 0 ? 'Les situations' : 'Retour';
      if (focus) {
        var h = liste[rang].querySelector('.parcours__titre');
        if (h) h.focus({ preventScroll: true });
        // Le haut de la carte reste visible
        var haut = carte.getBoundingClientRect().top;
        if (haut < margeHaute()) guiderFenetre(carte, haut - margeHaute(), mouvementReduit.matches ? 0 : DUREE_OUVERTURE);
      }
    }
    function ouvrir(cle, lien) {
      var p = donnees[cle];
      if (!p) return false;
      declencheur = lien;
      interieur.textContent = '';
      parcours = construireParcours(cle, p, cas[p.cas]);
      interieur.appendChild(parcours);
      parcours.querySelector('.parcours__fermer').addEventListener('click', function () { fermer(true); });
      parcours.querySelector('.parcours__retour').addEventListener('click', function () {
        if (rang === 0) fermer(true); else montrer(rang - 1, true);
      });
      parcours.querySelector('.parcours__suivant').addEventListener('click', function () {
        montrer(rang + 1, true);
        // Dernière étape : le focus va au bouton de contact
        if (rang === etapes().length - 1) parcours.querySelector('.parcours__cta').focus({ preventScroll: true });
      });
      toutes('[data-parcours]', vueListe).forEach(function (a) { a.setAttribute('aria-expanded', a === lien ? 'true' : 'false'); });
      montrer(0, false);
      carte.classList.add('is-parcours');
      carte.setAttribute('data-situation', cle);
      vueListe.inert = true;
      zone.inert = false;
      var h = parcours.querySelector('.parcours__titre');
      if (h) h.focus({ preventScroll: true });
      // Sur mobile, la carte qui grandit reste dans le champ
      var r = carte.getBoundingClientRect();
      if (r.top < margeHaute()) guiderFenetre(carte, r.top - margeHaute(), mouvementReduit.matches ? 0 : DUREE_OUVERTURE);
      return true;
    }
    function fermer(rendreFocus) {
      if (!carte.classList.contains('is-parcours')) return;
      carte.classList.remove('is-parcours');
      carte.removeAttribute('data-situation');
      zone.inert = true;
      vueListe.inert = false;
      toutes('[data-parcours]', vueListe).forEach(function (a) { a.setAttribute('aria-expanded', 'false'); });
      if (rendreFocus && declencheur) declencheur.focus({ preventScroll: true });
      var haut = carte.getBoundingClientRect().top;
      if (haut < margeHaute()) guiderFenetre(carte, haut - margeHaute(), mouvementReduit.matches ? 0 : DUREE_OUVERTURE);
    }
    toutes('[data-parcours]', vueListe).forEach(function (lien) {
      lien.setAttribute('aria-expanded', 'false');
      lien.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
        if (ouvrir(lien.getAttribute('data-parcours'), lien)) e.preventDefault();
      });
    });
    carte.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && carte.classList.contains('is-parcours')) { e.stopPropagation(); fermer(true); }
    });
  }

  /* ---------- Contact : les trois garanties se cochent l'une après l'autre ---------- */

  function initGaranties() {
    if (mouvementReduit.matches) return;
    toutes('.checks').forEach(function (liste) {
      if (!une(liste, 'garanties')) return;
      liste.classList.add('checks--anime');
      var vu = false;
      visibleQuand(liste, function (v) { if (v && !vu) { vu = true; liste.classList.add('is-coche'); } }, 0.6);
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

  /* ---------- Pré-remplissage du formulaire de contact ----------
     Tout élément [data-prefill="<sujet>"] (et/ou data-prefill-cas="<slug>",
     data-prefill-message="...") fait défiler jusqu'au formulaire de la page
     ([data-formulaire-contact]) et écrit une phrase de départ modifiable dans le message.
     Sans formulaire sur la page, le lien suit son href (/nous-contacter?sujet=...&cas=...),
     qui pré-remplit à l'arrivée. */

  var SUJETS = {
    'prise-de-fonction': 'Bonjour, je souhaite échanger sur une prise de fonction au COMEX.',
    'posture': 'Bonjour, je souhaite échanger sur mon influence et ma posture de dirigeant.',
    'comite': 'Bonjour, je souhaite échanger sur un comité de direction à aligner.',
    'transformation': 'Bonjour, je souhaite échanger sur une transformation à piloter.',
    'equipe': 'Bonjour, je souhaite échanger sur l’accompagnement de dirigeants de mon équipe.',
    'autre': ''
  };
  var ANCIENS_BESOINS = { individuel: 'posture', collectif: 'comite', organisation: 'equipe', 'je-ne-sais-pas': 'autre' };
  // Cas clients : nom et titre repris des pages /cas-clients/<slug>.
  var CAS = {
    'chanel': { nom: "CHANEL", titre: "Renforcer l’influence d’une dirigeante dans des interactions à forts enjeux", sujet: 'posture' },
    'vinci-airports': { nom: "VINCI Airports", titre: "Prendre pleinement sa place de leader dans un environnement à forts enjeux stratégiques", sujet: 'posture' },
    'mazars': { nom: "Mazars", titre: "Accompagner le passage à un nouveau rôle de leadership", sujet: 'equipe' },
    'cic': { nom: "CIC", titre: "Accompagner des leaders de proximité dans la conduite d’une transformation du réseau", sujet: 'transformation' },
    'croix-rouge-francaise': { nom: "Croix-Rouge française", titre: "Renforcer la posture de leaders territoriaux dans un environnement complexe", sujet: 'equipe' },
    'michael-page': { nom: "Michael Page", titre: "Faire évoluer sa posture de leader pour renforcer l’engagement et la performance collective", sujet: 'posture' },
    'ilek': { nom: "Ilek", titre: "Faire évoluer la posture de leaders dans un contexte de croissance et de transformation", sujet: 'equipe' },
    'biborg': { nom: "Biborg", titre: "Accompagner des leaders dans les passages de seuil de leur trajectoire", sujet: 'equipe' },
    'le-lab-rh': { nom: "Le Lab RH", titre: "Assumer pleinement sa place de dirigeant dans une organisation en développement", sujet: 'posture' },
    'fintecture': { nom: "Fintecture", titre: "Faire évoluer son leadership sous forte pression sans renoncer à l’exigence de performance", sujet: 'posture' },
    'manomano': { nom: "ManoMano", titre: "Accompagner dans la durée des enjeux de leadership et d’influence", sujet: 'equipe' },
    'schoolab': { nom: "Schoolab", titre: "Déployer un coaching individualisé à l’échelle d’une population stratégique", sujet: 'equipe' },
    'jobteaser': { nom: "Jobteaser", titre: "Préserver son impact et sa capacité d’action dans un environnement sous tension", sujet: 'posture' },
    'groupe-nice-matin': { nom: "Groupe Nice-Matin", titre: "Faire évoluer la posture de managers clés dans un contexte de transformation", sujet: 'transformation' },
    'homeexchange': { nom: "HomeExchange", titre: "Trouver son alignement pour asseoir son leadership et mieux embarquer ses équipes", sujet: 'posture' },
    'enseignement-catholique-de-paris': { nom: "Enseignement catholique de Paris", titre: "Accompagner des dirigeants d’établissement dans la gestion des conflits", sujet: 'equipe' },
    'michael-page-collectif': { nom: "Michael Page", titre: "Renforcer la cohésion managériale et structurer le fonctionnement d’une équipe", sujet: 'comite' }
  };

  function formulaireContact() { return document.querySelector('[data-formulaire-contact]'); }

  function preremplir(sujet, cas, message, defiler, depuisUrl) {
    var form = formulaireContact();
    if (!form) return false;
    if (cas && CAS[cas]) {
      var t = CAS[cas].titre;
      message = message || ('Bonjour, notre situation ressemble au cas ' + CAS[cas].nom + ' : ' + t.charAt(0).toLowerCase() + t.slice(1) + '.');
    }
    if (sujet && !SUJETS.hasOwnProperty(sujet)) {
      if (ANCIENS_BESOINS[sujet]) sujet = ANCIENS_BESOINS[sujet];
      else {
        // Sujet libre, par exemple le nom d'une formation du catalogue.
        if (!message && /[A-Za-zÀ-ÿ]/.test(sujet)) message = 'Bonjour, je souhaite en savoir plus sur la formation « ' + sujet + ' ».';
        sujet = '';
      }
    }
    var zone = form.querySelector('[data-message]');
    if (!message && sujet) message = SUJETS[sujet];
    if (zone && message) {
      zone.value = message;
      zone.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (defiler) {
      var bloc = form.closest('section') || form;
      var reduit = mouvementReduit.matches;
      // Si la section dépasse l'écran (page Nous contacter, mobile), on centre le message pré-rempli.
      var cibleDefil = zone && bloc.getBoundingClientRect().height > window.innerHeight * 0.9 ? zone : bloc;
      cibleDefil.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: cibleDefil === zone ? 'center' : 'start' });
      form.classList.remove('is-prerempli');
      void form.offsetWidth;
      form.classList.add('is-prerempli');
      // À l'arrivée depuis un lien, sur écran tactile, on n'ouvre pas le clavier d'office.
      if (depuisUrl && !survolPossible.matches) return true;
      setTimeout(function () {
        var cible = zone || form.querySelector('input, textarea');
        if (!cible) return;
        cible.focus({ preventScroll: true });
        if (cible === zone && zone.setSelectionRange) zone.setSelectionRange(zone.value.length, zone.value.length);
      }, reduit ? 0 : 650);
    }
    return true;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-prefill], [data-prefill-cas]');
    if (!el || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
    if (!formulaireContact()) return;
    e.preventDefault();
    preremplir(el.getAttribute('data-prefill') || '', el.getAttribute('data-prefill-cas'), el.getAttribute('data-prefill-message'), true);
  });

  // Page cas client : la ligne « Vous vivez une situation proche ? » du bloc contact pré-remplit avec ce cas.
  function initContactProche() {
    var slug = document.body.getAttribute('data-cas');
    if (!slug || !CAS[slug]) return;
    toutes('[data-contact-proche]').forEach(function (lien) {
      if (!une(lien, 'proche')) return;
      lien.href = '/nous-contacter?cas=' + slug;
      lien.setAttribute('data-prefill-cas', slug);
      var ligne = lien.closest('.contact__proche');
      if (ligne) ligne.hidden = false;
    });
  }

  var urlTraitee = false;
  function preremplirDepuisUrl() {
    if (urlTraitee || !formulaireContact()) return;
    urlTraitee = true;
    var params = new URLSearchParams(window.location.search);
    var brut = (params.get('sujet') || params.get('besoin') || '').trim().slice(0, 80);
    // Clé connue (prise-de-fonction, posture...) ou intitulé libre (nom d'une formation).
    var sujet = /^[a-z-]+$/.test(brut) ? brut : brut.replace(/[^A-Za-zÀ-ÿ0-9 ,'’&%-]/g, '').trim();
    var cas = (params.get('cas') || '').replace(/[^a-z-]/g, '');
    if (sujet || cas) preremplir(sujet, cas, null, true, true);
  }

  /* ---------- Bandeau de logos en défilement continu (data-marquee) ---------- */

  function initMarquees() {
    toutes('[data-marquee]').forEach(function (bandeau) {
      if (!une(bandeau, 'marquee') || mouvementReduit.matches) return;
      var defile = bandeau.querySelector('.marquee__defile');
      var piste = bandeau.querySelector('.marquee__piste');
      if (!defile || !piste) return;
      var copie = piste.cloneNode(true);
      copie.setAttribute('aria-hidden', 'true');
      toutes('img', copie).forEach(function (img) { img.alt = ''; });
      toutes('a', copie).forEach(function (a) { a.tabIndex = -1; });
      defile.appendChild(copie);
      bandeau.classList.add('is-anime');
    });
  }

  /* ---------- Apparitions au défilement (data-reveal) ----------
     Les blocs principaux de chaque page reçoivent data-reveal automatiquement
     (ou à la main : data-reveal, ou data-reveal="glisse" pour une entrée latérale).
     Ceux déjà visibles au chargement ne bougent pas. Sans JS ou avec
     « réduire les animations », tout reste visible. */

  var CIBLES_REVEAL = [
    '.section-head', '.plateau__texte', '.hero__texte', '.hero__carte', '.faq__intro', '.faq__liste',
    '.contact__intro', '.contact-card', '.carte', '.enjeu__bouton', '.carte-lien', '.barre', '.stat',
    '.temoignages__principal', '.temoignages__court', '.carrousel', '.home-logos', '.home-echelle',
    '.home-expertise', '.home-formations', '.footer__brand > img:first-child', '.footer__brand > p',
    '.footer__col', '.filler__text', '.skeleton'
  ].join(',');
  var observateurReveal = null;

  function initReveal() {
    if (mouvementReduit.matches || !('IntersectionObserver' in window)) return;
    toutes('main, .site-footer').forEach(function (racine) {
      toutes(CIBLES_REVEAL, racine).forEach(function (el) {
        if (el.hasAttribute('data-reveal') || el.closest('[data-no-reveal]')) return;
        if (el.parentElement && el.parentElement.closest('[data-reveal]')) return;
        el.setAttribute('data-reveal', '');
      });
    });
    toutes('main section').forEach(function (section) {
      if (section.closest('[data-reveal]') || section.querySelector('[data-reveal]')) return;
      Array.prototype.forEach.call(section.children, function (enfant) { enfant.setAttribute('data-reveal', ''); });
    });

    if (!observateurReveal) {
      observateurReveal = new IntersectionObserver(function (entrees) {
        var rang = 0;
        entrees.forEach(function (entree) {
          if (!entree.isIntersecting) return;
          var el = entree.target;
          observateurReveal.unobserve(el);
          var delai = Math.min(rang, 9) * 70;
          rang += 1;
          el.style.setProperty('--reveal-delai', delai + 'ms');
          el.classList.add('is-revealed');
          setTimeout(function () {
            el.removeAttribute('data-reveal');
            el.classList.remove('is-revealed');
            el.style.removeProperty('--reveal-delai');
          }, 1000 + delai);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    var hauteur = window.innerHeight;
    toutes('[data-reveal]').forEach(function (el) {
      if (el.hasAttribute('data-reveal-suivi')) return;
      el.setAttribute('data-reveal-suivi', '');
      if (el.getBoundingClientRect().top < hauteur * 0.92) { el.removeAttribute('data-reveal'); return; }
      observateurReveal.observe(el);
    });
    document.documentElement.classList.add('reveal-pret');
  }

  /* ---------- Chiffres qui s'animent à l'apparition (data-compte, .stat__valeur) ---------- */

  function initComptes() {
    if (mouvementReduit.matches || !('IntersectionObserver' in window)) return;
    var cibles = toutes('[data-compte], .stat__valeur').filter(function (el) {
      return !el.closest('.cas-detail, .carte-photo__kpi') && une(el, 'compte');
    });
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        obs.unobserve(entree.target);
        animerCompte(entree.target);
      });
    }, { threshold: 0.6 });
    cibles.forEach(function (el) {
      var texte = el.textContent.trim();
      var m = texte.match(/^([^\d]*)(\d+(?:,\d+)?)(.*)$/);
      if (!m || /\d/.test(m[3].replace(/^\s*\/\s*\d+/, ''))) return;
      var valeur = parseFloat(m[2].replace(',', '.'));
      if (!(valeur > 0) || valeur >= 1000) return;
      var decimales = (m[2].split(',')[1] || '').length;
      el.textContent = '';
      var anim = elt('span', 'compte__anim', texte);
      anim.setAttribute('aria-hidden', 'true');
      el.appendChild(anim);
      el.appendChild(elt('span', 'visually-hidden', texte));
      el._compte = { avant: m[1], apres: m[3], valeur: valeur, decimales: decimales, anim: anim };
      anim.textContent = m[1] + (0).toFixed(decimales).replace('.', ',') + m[3];
      obs.observe(el);
    });
  }
  function animerCompte(el) {
    var c = el._compte;
    if (!c) return;
    var debut = null, duree = 1400;
    function pas(t) {
      if (debut === null) debut = t;
      var p = Math.min(1, (t - debut) / duree);
      var v = c.valeur * (1 - Math.pow(1 - p, 3));
      c.anim.textContent = c.avant + v.toFixed(c.decimales).replace('.', ',') + c.apres;
      if (p < 1) requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }

  /* ---------- Recherche du site : icône de la navbar, Ctrl+K, panneau mobile ----------
     Index statique /search-index.json (généré par _index-recherche.py), chargé à la première ouverture.
     Recherche insensible aux accents et à la casse, résultats groupés par type, termes surlignés,
     flèches et Entrée pour naviguer, Échap pour fermer. */

  var recherche = null;
  var ORDRE_TYPES = ['Page', 'Coaching', 'Cas client', 'Formation'];
  var LIBELLES_TYPES = { 'Page': 'Pages', 'Coaching': 'Coaching de dirigeant', 'Cas client': 'Cas clients', 'Formation': 'Formations' };

  // Minuscules sans accents, longueur identique au texte d'origine (pour surligner au bon endroit).
  function plier(texte) {
    var sortie = '';
    for (var i = 0; i < texte.length; i += 1) {
      var c = texte.charAt(i);
      var d = c.normalize ? c.normalize('NFD').replace(/[̀-ͯ]/g, '') : c;
      sortie += (d.length === 1 ? d : c).toLowerCase();
    }
    return sortie.replace(/[’']/g, "'");
  }
  var MOTS_VIDES = ['de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', 'et', 'en', 'au', 'aux', 'a', 'd', 'l',
    'pour', 'par', 'sur', 'avec', 'dans', 'son', 'sa', 'ses', 'mon', 'ma', 'mes', 'je', 'nous', 'vous', 'qui', 'que'];
  function motsDe(requete) {
    var mots = plier(requete).split(/[^a-z0-9]+/)
      .filter(function (m) { return m.length > 1 || /\d/.test(m); });
    var pleins = mots.filter(function (m) { return MOTS_VIDES.indexOf(m) < 0; });
    return pleins.length ? pleins : mots;
  }
  // Position du mot en début de mot (« reseau » trouve « réseau », pas « leadership » pour « de »).
  function trouver(texte, mot, depuis) {
    var i = texte.indexOf(mot, depuis || 0);
    while (i > 0 && /[a-z0-9]/.test(texte.charAt(i - 1))) i = texte.indexOf(mot, i + 1);
    return i;
  }
  function preparer(index) {
    return index.map(function (p) {
      var inter = (p.intertitres || []).join(' | ');
      return {
        p: p,
        titre: plier(p.titre + (p.client ? ' ' + p.client : '')),
        inter: plier(inter),
        texte: plier((p.description || '') + ' ' + p.texte)
      };
    });
  }
  function scorer(e, mots, phrase) {
    var total = 0;
    // Bonus si l'expression entière figure telle quelle (« prise de parole »).
    if (phrase && mots.length > 1) {
      if (e.titre.indexOf(phrase) >= 0) total += 14;
      else if (e.inter.indexOf(phrase) >= 0 || e.texte.indexOf(phrase) >= 0) total += 6;
    }
    for (var i = 0; i < mots.length; i += 1) {
      var m = mots[i], s = 0;
      var it = trouver(e.titre, m), ih = trouver(e.inter, m), ix = trouver(e.texte, m);
      if (it < 0 && ih < 0 && ix < 0) return 0;
      if (it >= 0) s += it === 0 ? 12 : 10;
      if (ih >= 0) s += 4;
      if (ix >= 0) {
        var n = 0, k = ix;
        while (k >= 0 && n < 4) { n += 1; k = trouver(e.texte, m, k + m.length); }
        s += 1 + n * 0.5;
      }
      total += s;
    }
    return total;
  }
  // Morceau de texte autour du premier terme trouvé.
  function extrait(e, mots) {
    var source = (e.p.description || '') + ' ' + e.p.texte;
    var plie = plier(source), pos = -1;
    for (var i = 0; i < mots.length && pos < 0; i += 1) pos = trouver(plie, mots[i]);
    if (pos < 0) return e.p.description || e.p.texte.slice(0, 150);
    var debut = Math.max(0, pos - 60), fin = Math.min(source.length, pos + 120);
    while (debut > 0 && source.charAt(debut) !== ' ') debut -= 1;
    while (fin < source.length && source.charAt(fin) !== ' ') fin += 1;
    return (debut > 0 ? '… ' : '') + source.slice(debut, fin).trim() + (fin < source.length ? ' …' : '');
  }
  // Remplit un élément avec le texte, termes recherchés dans des <mark> (aucun HTML injecté).
  function surligner(el, texte, mots) {
    var plie = plier(texte), zones = [];
    mots.forEach(function (m) {
      var i = trouver(plie, m);
      while (i >= 0) { zones.push([i, i + m.length]); i = trouver(plie, m, i + m.length); }
    });
    zones.sort(function (a, b) { return a[0] - b[0]; });
    var curseur = 0;
    zones.forEach(function (z) {
      if (z[0] < curseur) return;
      if (z[0] > curseur) el.appendChild(document.createTextNode(texte.slice(curseur, z[0])));
      el.appendChild(elt('mark', null, texte.slice(z[0], z[1])));
      curseur = z[1];
    });
    if (curseur < texte.length) el.appendChild(document.createTextNode(texte.slice(curseur)));
  }

  function construireRecherche() {
    var fond = elt('div', 'recherche');
    fond.id = 'recherche';
    fond.hidden = true;
    var boite = elt('div', 'recherche__boite');
    boite.setAttribute('role', 'dialog');
    boite.setAttribute('aria-modal', 'true');
    boite.setAttribute('aria-label', 'Rechercher sur le site');
    var tete = elt('div', 'recherche__tete');
    var loupe = icone('search', 20);
    var champ = elt('input', 'recherche__champ');
    champ.type = 'search';
    champ.id = 'recherche-champ';
    champ.placeholder = 'Rechercher un cas, une formation, un sujet…';
    champ.setAttribute('autocomplete', 'off');
    champ.setAttribute('spellcheck', 'false');
    champ.setAttribute('role', 'combobox');
    champ.setAttribute('aria-expanded', 'false');
    champ.setAttribute('aria-controls', 'recherche-resultats');
    champ.setAttribute('aria-autocomplete', 'list');
    champ.setAttribute('aria-label', 'Rechercher sur le site');
    var fermer = elt('button', 'recherche__fermer');
    fermer.type = 'button';
    fermer.setAttribute('aria-label', 'Fermer la recherche');
    fermer.appendChild(elt('span', 'recherche__touche', 'Échap'));
    tete.appendChild(loupe);
    tete.appendChild(champ);
    tete.appendChild(fermer);
    var resultats = elt('div', 'recherche__resultats');
    resultats.id = 'recherche-resultats';
    resultats.setAttribute('role', 'listbox');
    resultats.setAttribute('aria-label', 'Résultats');
    var statut = elt('p', 'recherche__statut');
    statut.setAttribute('role', 'status');
    statut.setAttribute('aria-live', 'polite');
    boite.appendChild(tete);
    boite.appendChild(resultats);
    boite.appendChild(statut);
    fond.appendChild(boite);
    document.body.appendChild(fond);
    return { fond: fond, boite: boite, champ: champ, resultats: resultats, statut: statut, fermer: fermer,
      index: null, chargement: null, options: [], actif: -1, retour: null };
  }

  function chargerIndex() {
    if (recherche.index) return Promise.resolve(recherche.index);
    if (!recherche.chargement) {
      recherche.chargement = fetch('/search-index.json').then(function (r) {
        if (!r.ok) throw new Error('index');
        return r.json();
      }).then(function (donnees) {
        recherche.index = preparer(donnees);
        return recherche.index;
      }).catch(function () {
        recherche.chargement = null;
        return null;
      });
    }
    return recherche.chargement;
  }

  function choisir(i, defiler) {
    var opts = recherche.options;
    if (!opts.length) { recherche.actif = -1; recherche.champ.removeAttribute('aria-activedescendant'); return; }
    i = (i + opts.length) % opts.length;
    opts.forEach(function (o, k) { o.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    recherche.actif = i;
    recherche.champ.setAttribute('aria-activedescendant', opts[i].id);
    if (defiler) opts[i].scrollIntoView({ block: 'nearest' });
  }

  function afficherResultats() {
    var r = recherche, requete = r.champ.value.trim();
    r.resultats.textContent = '';
    r.options = [];
    r.actif = -1;
    r.champ.removeAttribute('aria-activedescendant');
    var mots = motsDe(requete);
    if (!mots.length) {
      r.champ.setAttribute('aria-expanded', 'false');
      r.statut.textContent = requete ? 'Tapez au moins deux lettres.' : 'Cas clients, formations, coaching, méthode : tapez quelques lettres.';
      return;
    }
    if (!r.index) { r.statut.textContent = 'Chargement de l’index…'; return; }
    var phrase = plier(requete).replace(/\s+/g, ' ');
    var trouves = r.index.map(function (e) { return { e: e, s: scorer(e, mots, phrase) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
    if (!trouves.length) {
      r.champ.setAttribute('aria-expanded', 'false');
      r.statut.textContent = 'Aucun résultat pour « ' + requete + ' ».';
      return;
    }
    var groupes = {};
    trouves.forEach(function (x) { (groupes[x.e.p.type] = groupes[x.e.p.type] || []).push(x); });
    var types = ORDRE_TYPES.filter(function (t) { return groupes[t]; })
      .sort(function (a, b) { return groupes[b][0].s - groupes[a][0].s; });
    types.forEach(function (type) {
      var groupe = elt('div', 'recherche__groupe');
      groupe.setAttribute('role', 'group');
      var titreId = 'recherche-groupe-' + plier(type).replace(/[^a-z]/g, '');
      groupe.setAttribute('aria-labelledby', titreId);
      var titre = elt('p', 'recherche__type', LIBELLES_TYPES[type] || type);
      titre.id = titreId;
      groupe.appendChild(titre);
      groupes[type].slice(0, 6).forEach(function (x) {
        var lien = elt('a', 'recherche__resultat');
        lien.href = x.e.p.url;
        lien.id = 'recherche-option-' + r.options.length;
        lien.setAttribute('role', 'option');
        lien.setAttribute('aria-selected', 'false');
        lien.tabIndex = -1;
        var t = elt('span', 'recherche__titre');
        surligner(t, (x.e.p.client ? x.e.p.client + ' : ' : '') + x.e.p.titre, mots);
        var ex = elt('span', 'recherche__extrait');
        surligner(ex, extrait(x.e, mots), mots);
        lien.appendChild(t);
        lien.appendChild(ex);
        var idx = r.options.length;
        lien.addEventListener('mousemove', function () { if (r.actif !== idx) choisir(idx, false); });
        lien.addEventListener('click', function () { fermerRecherche(false); });
        groupe.appendChild(lien);
        r.options.push(lien);
      });
      r.resultats.appendChild(groupe);
    });
    r.champ.setAttribute('aria-expanded', 'true');
    r.statut.textContent = trouves.length === 1 ? '1 résultat' : trouves.length + ' résultats';
    choisir(0, false);
  }

  function ouvrirRecherche(declencheur) {
    if (!recherche) return;
    fermerMobile(false);
    recherche.retour = declencheur || document.activeElement;
    recherche.fond.hidden = false;
    document.body.classList.add('no-scroll');
    window.requestAnimationFrame(function () { recherche.fond.classList.add('is-open'); });
    recherche.champ.focus();
    recherche.champ.select();
    afficherResultats();
    chargerIndex().then(function (index) {
      if (!index) { recherche.statut.textContent = 'La recherche est indisponible pour le moment.'; return; }
      afficherResultats();
    });
  }
  function fermerRecherche(rendreFocus) {
    if (!recherche || recherche.fond.hidden) return;
    recherche.fond.classList.remove('is-open');
    recherche.fond.hidden = true;
    document.body.classList.remove('no-scroll');
    if (rendreFocus !== false && recherche.retour && recherche.retour.focus) recherche.retour.focus({ preventScroll: true });
  }

  function initRecherche() {
    var declencheurs = toutes('.navbar__search, [data-recherche-ouvrir]');
    if (!recherche) {
      recherche = construireRecherche();
      var r = recherche;
      r.champ.addEventListener('input', afficherResultats);
      r.champ.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); choisir(r.actif + 1, true); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); choisir(r.actif - 1, true); }
        else if (e.key === 'Enter') {
          var o = r.options[r.actif];
          if (o) { e.preventDefault(); fermerRecherche(false); window.location.href = o.href; }
        }
      });
      r.fond.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); fermerRecherche(true); return; }
        if (e.key !== 'Tab') return;
        // Le focus reste dans la boîte : le champ et le bouton Fermer.
        e.preventDefault();
        (document.activeElement === r.champ ? r.fermer : r.champ).focus();
      });
      r.fermer.addEventListener('click', function () { fermerRecherche(true); });
      r.fond.addEventListener('mousedown', function (e) { if (e.target === r.fond) fermerRecherche(true); });
      document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          if (r.fond.hidden) ouvrirRecherche(document.activeElement); else fermerRecherche(true);
        }
      });
    }
    declencheurs.forEach(function (b) {
      if (!une(b, 'recherche')) return;
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-controls', 'recherche');
      b.addEventListener('click', function (e) {
        e.preventDefault();
        ouvrirRecherche(b.closest('.mobile-panel') ? burger : b);
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
    initCoches();
    initFrappe();
    initCarrousels();
    initEnjeux();
    initParcoursHero();
    initTemoignages();
    initGaranties();
    initFaq();
    initMarquees();
    initComptes();
    initReveal();
    initContactProche();
    initRecherche();
    preremplirDepuisUrl();
  }

  // Le titre du hero est dans la page : on l'anime sans attendre les partiels, police chargée.
  function lancerLignes() {
    var pret = false;
    function go() { if (pret) return; pret = true; initLignes(); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    setTimeout(go, 700);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lancerLignes);
  else lancerLignes();

  window.Scoache = { init: init };

  // Lancement : après les partiels si include.js est présent, sinon tout de suite.
  document.addEventListener('scoache:partiels', init);
  if (window.ScoachePartielsPrets) init();
  else if (!document.querySelector('script[src$="include.js"]')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})();
