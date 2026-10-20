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
      var arreterAuto = function () {};

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
      if (prec) prec.addEventListener('click', function () { arreterAuto(); piste.scrollBy({ left: -pas(), behavior: 'smooth' }); });
      if (suiv) suiv.addEventListener('click', function () { arreterAuto(); piste.scrollBy({ left: pas(), behavior: 'smooth' }); });
      piste.addEventListener('scroll', function () { window.requestAnimationFrame(maj); }, { passive: true });
      window.addEventListener('resize', maj);

      // Filtres optionnels : boutons [data-carrousel-filtre="individuel"], items [data-echelle="individuel"]
      var filtres = toutes('[data-carrousel-filtre]', racine);
      filtres.forEach(function (bouton) {
        bouton.addEventListener('click', function () {
          var valeur = bouton.getAttribute('data-carrousel-filtre');
          arreterAuto();
          filtres.forEach(function (b) { b.setAttribute('aria-pressed', b === bouton ? 'true' : 'false'); });
          toutes('.carrousel__item', piste).forEach(function (item) {
            item.hidden = valeur !== 'tous' && item.getAttribute('data-echelle') !== valeur;
          });
          piste.scrollLeft = 0;
          maj();
        });
      });
      maj();

      // Défilement automatique (data-carrousel-auto="5000") : avance seul, se met en pause au
      // survol, au focus ou quand l'onglet est masqué, s'arrête dès que l'utilisateur agit.
      var delai = parseInt(racine.getAttribute('data-carrousel-auto'), 10);
      if (!delai || mouvementReduit.matches) return;
      var arrete = false, survol = false, focus = false, visible = false, minuteurAuto = null;
      function planifier() {
        clearTimeout(minuteurAuto);
        if (arrete || survol || focus || !visible || document.hidden) return;
        minuteurAuto = setTimeout(avancer, delai);
      }
      function avancer() {
        var max = piste.scrollWidth - piste.clientWidth;
        if (piste.scrollLeft >= max - 2) piste.scrollTo({ left: 0, behavior: 'smooth' });
        else piste.scrollBy({ left: pas(), behavior: 'smooth' });
        planifier();
      }
      arreterAuto = function () {
        arrete = true;
        clearTimeout(minuteurAuto);
        racine.setAttribute('data-carrousel-arrete', '');
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
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entrees) {
          visible = entrees[0].isIntersecting;
          planifier();
        }, { threshold: 0.35 }).observe(racine);
      } else { visible = true; planifier(); }
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
     ([data-formulaire-contact]) et le pré-remplit : puce cochée, phrase de départ
     modifiable. Sans formulaire sur la page, le lien suit son href
     (/nous-contacter?sujet=...&cas=...), qui pré-remplit à l'arrivée. */

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
      sujet = sujet || CAS[cas].sujet;
      var t = CAS[cas].titre;
      message = message || ('Bonjour, notre situation ressemble au cas ' + CAS[cas].nom + ' : ' + t.charAt(0).toLowerCase() + t.slice(1) + '.');
    }
    if (sujet && !SUJETS.hasOwnProperty(sujet)) sujet = ANCIENS_BESOINS[sujet] || '';
    if (sujet) {
      var radio = form.querySelector('input[data-sujet="' + sujet + '"]');
      if (radio) radio.checked = true;
    }
    var zone = form.querySelector('[data-message]');
    if (!message && sujet) message = SUJETS[sujet];
    if (zone && message) zone.value = message;
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
    var dialogue = el.closest('dialog');
    if (dialogue && dialogue.open) { apercuSansRetour = true; dialogue.close(); }
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

  /* ---------- Aperçu d'un cas client (dialogue) : [data-cas-apercu="<slug>"] ---------- */

  var donneesCas = null;
  var apercu = null;
  var apercuOuvreur = null;
  var apercuSansRetour = false;
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
  function lireDonneesCas() {
    if (donneesCas) return donneesCas;
    var source = document.getElementById('cas-apercus');
    if (!source) return null;
    try { donneesCas = JSON.parse(source.textContent); } catch (err) { donneesCas = null; }
    return donneesCas;
  }

  function construireApercu() {
    apercu = document.createElement('dialog');
    apercu.className = 'apercu';
    apercu.setAttribute('aria-labelledby', 'apercu-titre');
    apercu.addEventListener('close', function () {
      document.body.classList.remove('no-scroll');
      apercu.classList.remove('is-open');
      if (!apercuSansRetour && apercuOuvreur) apercuOuvreur.focus({ preventScroll: true });
      apercuSansRetour = false;
    });
    apercu.addEventListener('click', function (e) { if (e.target === apercu) apercu.close(); });
    document.body.appendChild(apercu);
  }

  function ouvrirApercu(slug, d, ouvreur) {
    if (!apercu) construireApercu();
    apercuOuvreur = ouvreur;
    apercu.textContent = '';
    var boite = elt('div', 'apercu__boite');

    var haut = elt('div', 'apercu__haut');
    var logo = elt('img', 'apercu__logo');
    logo.src = '/assets/cas/logos/' + slug + '.png';
    logo.alt = d.nom;
    var ratio = d.logo.l / d.logo.h;
    var h = Math.min(40, 140 / ratio);
    logo.width = Math.round(h * ratio);
    logo.height = Math.round(h);
    var fermerBtn = elt('button', 'apercu__fermer');
    fermerBtn.type = 'button';
    fermerBtn.setAttribute('aria-label', 'Fermer l’aperçu');
    fermerBtn.appendChild(icone('x', 20));
    fermerBtn.addEventListener('click', function () { apercu.close(); });
    haut.appendChild(logo);
    haut.appendChild(fermerBtn);
    boite.appendChild(haut);

    var meta = elt('p', 'apercu__meta');
    meta.appendChild(elt('span', 'eyebrow', d.echelle));
    meta.appendChild(elt('span', 'apercu__meta-texte', d.meta));
    boite.appendChild(meta);
    var titre = elt('h2', 'apercu__titre', d.titre);
    titre.id = 'apercu-titre';
    boite.appendChild(titre);

    var corps = elt('div', 'apercu__corps');
    var gauche = elt('div', 'apercu__col');
    gauche.appendChild(elt('h3', 'apercu__label', 'Situation'));
    gauche.appendChild(elt('p', 'apercu__texte', d.situation));
    if (d.kpi) {
      var stat = elt('p', 'stat stat--lg apercu__kpi');
      stat.appendChild(elt('span', 'stat__valeur', d.kpi[0]));
      stat.appendChild(elt('span', 'stat__libelle', d.kpi[1]));
      gauche.appendChild(stat);
    }
    var droite = elt('div', 'apercu__col');
    droite.appendChild(elt('h3', 'apercu__label', 'Les enjeux de départ'));
    var liste = elt('ul', 'apercu__liste');
    d.enjeux.forEach(function (t) {
      var li = elt('li');
      li.appendChild(icone('check', 16));
      li.appendChild(elt('span', null, t));
      liste.appendChild(li);
    });
    droite.appendChild(liste);
    corps.appendChild(gauche);
    corps.appendChild(droite);
    boite.appendChild(corps);

    var demontre = elt('div', 'apercu__demontre');
    demontre.appendChild(elt('h3', 'apercu__label', 'Ce que ce cas démontre'));
    demontre.appendChild(elt('p', 'apercu__texte', d.demontre));
    boite.appendChild(demontre);

    var actions = elt('div', 'apercu__actions');
    var voir = elt('a', 'btn btn--noir', 'Voir le cas complet ');
    voir.href = '/cas-clients/' + slug;
    voir.appendChild(icone('arrow', 16));
    var parler = elt('a', 'link-caps', 'Parler d’une situation similaire');
    parler.href = '/nous-contacter?cas=' + slug;
    parler.setAttribute('data-prefill-cas', slug);
    actions.appendChild(voir);
    actions.appendChild(parler);
    boite.appendChild(actions);

    apercu.appendChild(boite);
    document.body.classList.add('no-scroll');
    apercu.showModal();
    requestAnimationFrame(function () { apercu.classList.add('is-open'); });
    fermerBtn.focus();
  }

  document.addEventListener('click', function (e) {
    var carte = e.target.closest('[data-cas-apercu]');
    if (!carte || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
    var donnees = lireDonneesCas();
    var slug = carte.getAttribute('data-cas-apercu');
    if (!donnees || !donnees[slug] || typeof HTMLDialogElement === 'undefined') return;
    e.preventDefault();
    ouvrirApercu(slug, donnees[slug], carte);
  });

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
      defile.appendChild(copie);
      bandeau.classList.add('is-anime');
      var bouton = bandeau.parentElement.querySelector('[data-marquee-pause]');
      if (bouton) {
        bouton.hidden = false;
        bouton.addEventListener('click', function () {
          var enPause = bandeau.classList.toggle('is-pause');
          bouton.setAttribute('aria-pressed', enPause ? 'true' : 'false');
          bouton.querySelector('.visually-hidden').textContent = enPause
            ? 'Relancer le défilement des logos' : 'Mettre en pause le défilement des logos';
        });
      }
    });
  }

  /* ---------- Apparitions au défilement (data-reveal) ----------
     Les blocs principaux de chaque page reçoivent data-reveal automatiquement
     (ou à la main dans le HTML). Ceux déjà visibles au chargement ne bougent pas.
     Sans JS ou avec « réduire les animations », tout reste visible. */

  var CIBLES_REVEAL = [
    '.section-head', '.plateau__texte', '.hero__texte', '.hero__carte', '.faq__intro', '.faq__liste',
    '.contact__intro', '.contact-card', '.carte', '.carte-lien', '.barre', '.stat',
    '.temoignages__principal', '.temoignages__court', '.carrousel', '.home-logos', '.home-echelle',
    '.home-expertise', '.home-formations', '.footer__cols > *', '.filler__text', '.skeleton'
  ].join(',');
  var observateurReveal = null;

  function initReveal() {
    if (mouvementReduit.matches || !('IntersectionObserver' in window)) return;
    var racines = toutes('main, .site-footer');
    racines.forEach(function (racine) {
      toutes(CIBLES_REVEAL, racine).forEach(function (el) {
        if (el.hasAttribute('data-reveal') || el.closest('dialog, [data-no-reveal]')) return;
        if (el.parentElement && el.parentElement.closest('[data-reveal]')) return;
        el.setAttribute('data-reveal', '');
      });
    });
    // Sections propres à une page sans aucun bloc reconnu : on anime leurs enfants directs.
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
          var delai = Math.min(rang, 5) * 80;
          rang += 1;
          el.style.setProperty('--reveal-delai', delai + 'ms');
          el.classList.add('is-revealed');
          setTimeout(function () {
            el.removeAttribute('data-reveal');
            el.classList.remove('is-revealed');
            el.style.removeProperty('--reveal-delai');
          }, 900 + delai);
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
      return !el.closest('dialog') && une(el, 'compte');
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
    initCarrousels();
    initFaq();
    initMarquees();
    initComptes();
    initReveal();
    preremplirDepuisUrl();
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
