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
      var rang = 0, pos = 0, sens = 1, minut = null, actif = false, visible = false;
      function peutTaper() { return visible && document.activeElement !== champ && champ.value === ''; }
      function arreter() {
        clearTimeout(minut);
        actif = false;
        champ.setAttribute('placeholder', exemples[rang]);
      }
      function tic() {
        if (!peutTaper()) { arreter(); return; }
        var texte = exemples[rang];
        if (sens === 1) {
          pos += 1;
          champ.setAttribute('placeholder', texte.slice(0, pos));
          if (pos >= texte.length) {
            if (exemples.length === 1) { actif = false; return; }
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
        actif = true; pos = 0; sens = 1;
        champ.setAttribute('placeholder', '');
        minut = setTimeout(tic, 500);
      }
      champ.addEventListener('focus', arreter);
      champ.addEventListener('input', arreter);
      champ.addEventListener('blur', function () { setTimeout(demarrer, 600); });
      visibleQuand(champ, function (v) { visible = v; if (v) demarrer(); }, 0.6);
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
    var meta = elt('p', 'cas-detail__meta');
    meta.appendChild(elt('span', 'eyebrow', d.echelle));
    meta.appendChild(elt('span', null, d.meta));
    haut.appendChild(meta);
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
    // Titre déjà affiché sur la carte photo : gardé pour les lecteurs d'écran seulement.
    corps.appendChild(elt('h3', 'visually-hidden', d.titre));
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
      function tousItems() { return toutes('.carrousel__item', piste).filter(function (el) { return el.querySelector('.cas-detail'); }); }
      function detailDe(item) { return item.querySelector('.cas-detail'); }
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
        tousItems().forEach(function (item) {
          var ouvrir = item === cible;
          var detail = detailDe(item);
          carteDe(item).setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
          detail.inert = !ouvrir;
          if (!large) { item.classList.toggle('is-ouvert', ouvrir); return; }
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
        } else if (cible && !instant) {
          // Mobile : la carte reste dans le champ, le détail aussi si possible.
          var r = cible.getBoundingClientRect(), p = piste.getBoundingClientRect();
          if (r.left < p.left - 1 || r.right > p.right + 1) piste.scrollTo({ left: piste.scrollLeft + r.left - p.left, behavior: 'smooth' });
          var carte = carteDe(cible);
          var hautCarte = carte.getBoundingClientRect().top;
          var bas = carte.getBoundingClientRect().bottom + detailDe(cible).querySelector('.cas-detail__interieur').scrollHeight;
          var decalage = Math.max(0, Math.min(bas - (window.innerHeight - 16), hautCarte - margeHaute()));
          if (decalage > 1) guiderFenetre(carte, decalage, DUREE_OUVERTURE);
        } else if (!cible && options.depuis && !instant) {
          var haut = carteDe(options.depuis).getBoundingClientRect().top;
          if (haut < margeHaute()) guiderFenetre(carteDe(options.depuis), haut - margeHaute(), DUREE_OUVERTURE);
        }
        if (!large) setTimeout(maj, DUREE_OUVERTURE + 50);
      }
      // Passage mobile / grand écran : on pose l'état final sans animation.
      function remettreAPlat() {
        if (boucle) window.cancelAnimationFrame(boucle);
        boucle = null;
        defil = null;
        tousItems().forEach(function (item) {
          var ouvrir = item === voulu;
          item.style.transform = '';
          detailDe(item).style.clipPath = '';
          detailDe(item).classList.remove('is-anime');
          item.classList.toggle('is-ouvert', ouvrir);
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
          carte.setAttribute('aria-expanded', 'false');
          carte.setAttribute('aria-controls', detail.id);
          if (d.kpi) {
            var kpi = elt('span', 'stat stat--verre carte-photo__kpi');
            kpi.setAttribute('aria-hidden', 'true');
            kpi.appendChild(elt('span', 'stat__valeur', d.kpi[0]));
            kpi.appendChild(elt('span', 'stat__libelle', d.kpi[1]));
            carte.appendChild(kpi);
          }
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

  /* ---------- Vos enjeux : une carte s'ouvre sur place pour montrer les cas liés ---------- */

  function initEnjeux() {
    toutes('[data-enjeux]').forEach(function (grille) {
      if (!une(grille, 'enjeux')) return;
      var cartes = toutes('.enjeu', grille);
      var interagi = false, visible = false, rang = 0, minut = null;

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
      ordonner();
      window.addEventListener('resize', function () { window.requestAnimationFrame(ordonner); });

      // Ouvrir ou fermer : seule la classe change, la hauteur du panneau suit en CSS
      // (grid-template-rows 0fr vers 1fr), interruptible à tout moment. La carte cliquée
      // reste immobile à l'écran même si un panneau situé au-dessus se referme.
      function basculer(carte, ouvrir) {
        var bouton = carte.querySelector('.enjeu__bouton');
        var hautAvant = bouton.getBoundingClientRect().top;
        cartes.forEach(function (c) {
          var o = c === carte && ouvrir;
          c.classList.toggle('is-ouvert', o);
          c.querySelector('.enjeu__bouton').setAttribute('aria-expanded', o ? 'true' : 'false');
          c.querySelector('.enjeu__panneau').inert = !o;
        });
        if (mouvementReduit.matches) return;
        var decalage = 0;
        if (ouvrir) {
          // Bas du panneau une fois ouvert, mesuré par rapport à la carte qui ne bouge pas.
          var panneau = carte.querySelector('.enjeu__panneau');
          var bas = hautAvant + (panneau.getBoundingClientRect().top - bouton.getBoundingClientRect().top)
            + carte.querySelector('.enjeu__interieur').scrollHeight;
          decalage = Math.max(0, Math.min(bas - (window.innerHeight - 24), hautAvant - margeHaute()));
        } else if (hautAvant < margeHaute()) {
          decalage = hautAvant - margeHaute();
        }
        guiderFenetre(bouton, decalage, DUREE_OUVERTURE + 30);
      }
      cartes.forEach(function (carte) {
        var bouton = carte.querySelector('.enjeu__bouton');
        carte.querySelector('.enjeu__panneau').inert = true;
        bouton.addEventListener('click', function () {
          arreterInvitation();
          basculer(carte, bouton.getAttribute('aria-expanded') !== 'true');
        });
      });
      grille.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var ouverte = grille.querySelector('.enjeu.is-ouvert');
        if (ouverte) { basculer(ouverte, false); ouverte.querySelector('.enjeu__bouton').focus({ preventScroll: true }); }
      });

      // Invitation discrète : une carte à la fois est mise en avant, jusqu'à la première interaction.
      function arreterInvitation() {
        interagi = true;
        clearTimeout(minut);
        cartes.forEach(function (c) { c.classList.remove('is-invite'); });
      }
      function inviter() {
        clearTimeout(minut);
        if (interagi || !visible || document.hidden || grille.querySelector('.enjeu.is-ouvert')) return;
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
        photo: fig.querySelector('.temoin__photo').getAttribute('src')
      };
    }
    var legende = fig.querySelector('figcaption').textContent;
    var i = legende.indexOf(',');
    return {
      citation: fig.querySelector('blockquote p').textContent,
      nom: legende.slice(0, i).trim(),
      role: legende.slice(i + 1).trim(),
      photo: fig.querySelector('.temoin__photo').getAttribute('src')
    };
  }
  function ecrireTemoignage(fig, t, principal) {
    if (principal) {
      fig.querySelector('.temoignages__citation p').textContent = t.citation;
      fig.querySelector('.temoin__nom').textContent = t.nom;
      fig.querySelector('.temoin__role').textContent = t.role;
    } else {
      fig.querySelector('blockquote p').textContent = t.citation;
      fig.querySelector('figcaption').textContent = t.nom + ', ' + t.role;
      fig.querySelector('.temoignages__promouvoir .visually-hidden').textContent = 'Afficher en grand le témoignage de ' + t.nom;
    }
    fig.querySelector('.temoin__photo').setAttribute('src', t.photo);
  }

  function initTemoignages() {
    toutes('[data-temoignages]').forEach(function (bloc) {
      if (!une(bloc, 'temoignages')) return;
      var principal = bloc.querySelector('.temoignages__principal');
      var courts = toutes('.temoignages__court', bloc);
      var interagi = false, visible = false, rang = 0, minut = null, enCours = false;

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
      courts.forEach(function (fig) {
        fig.querySelector('.temoignages__promouvoir').addEventListener('click', function () {
          arreter();
          promouvoir(fig, true);
        });
      });
      function arreter() { interagi = true; clearTimeout(minut); }
      function tourner() {
        clearTimeout(minut);
        if (interagi || !visible || document.hidden) return;
        minut = setTimeout(function () {
          if (interagi || !visible) return;
          promouvoir(courts[rang % courts.length], false);
          rang += 1;
          tourner();
        }, 8000);
      }
      ['pointerdown', 'keydown', 'focusin'].forEach(function (type) { bloc.addEventListener(type, arreter); });
      if (!mouvementReduit.matches) visibleQuand(bloc, function (v) { visible = v; if (v) tourner(); else clearTimeout(minut); }, 0.4);

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
    'homeexchange': { nom: "HomeExchange", titre: "Trouver son alignement pour asseoir son leadership et mieux embarquer ses équipes", sujet: 'posture' }
  };

  function formulaireContact() { return document.querySelector('[data-formulaire-contact]'); }

  function preremplir(sujet, cas, message, defiler) {
    var form = formulaireContact();
    if (!form) return false;
    if (cas && CAS[cas]) {
      var t = CAS[cas].titre;
      message = message || ('Bonjour, notre situation ressemble au cas ' + CAS[cas].nom + ' : ' + t.charAt(0).toLowerCase() + t.slice(1) + '.');
    }
    if (sujet && !SUJETS.hasOwnProperty(sujet)) sujet = ANCIENS_BESOINS[sujet] || '';
    var zone = form.querySelector('[data-message]');
    if (!message && sujet) message = SUJETS[sujet];
    if (zone && message) {
      zone.value = message;
      zone.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (defiler) {
      var bloc = form.closest('section') || form;
      var reduit = mouvementReduit.matches;
      bloc.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
      form.classList.remove('is-prerempli');
      void form.offsetWidth;
      form.classList.add('is-prerempli');
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

  var urlTraitee = false;
  function preremplirDepuisUrl() {
    if (urlTraitee || !formulaireContact()) return;
    urlTraitee = true;
    var params = new URLSearchParams(window.location.search);
    var sujet = (params.get('sujet') || params.get('besoin') || '').replace(/[^a-z-]/g, '');
    var cas = (params.get('cas') || '').replace(/[^a-z-]/g, '');
    if (sujet || cas) preremplir(sujet, cas, null, true);
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
    initTemoignages();
    initGaranties();
    initFaq();
    initMarquees();
    initComptes();
    initReveal();
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
