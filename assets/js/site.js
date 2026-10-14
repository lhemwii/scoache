// Comportements communs aux trois propositions. Aucune dépendance.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Menu mobile (barre classique)
  $$('[data-nav-toggle]').forEach((btn) => {
    const nav = btn.closest('.nav');
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
      document.body.classList.toggle('nav-open', open);
    });
  });

  // Méga-menus : clic / clavier (le survol est géré en CSS)
  $$('[data-mega]').forEach((btn) => {
    const item = btn.parentElement;
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      $$('.nav__item--mega.is-open').forEach((i) => { i.classList.remove('is-open'); $('[data-mega]', i).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--mega')) $$('.nav__item--mega.is-open').forEach((i) => { i.classList.remove('is-open'); $('[data-mega]', i).setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.nav__item--mega.is-open').forEach((i) => { i.classList.remove('is-open'); const b = $('[data-mega]', i); b.setAttribute('aria-expanded', 'false'); b.focus(); });
    const overlay = $('.overlay.is-open');
    if (overlay) toggleOverlay(false);
  });

  // Menu plein écran (proposition 3)
  const overlay = $('.overlay');
  function toggleOverlay(open) {
    if (!overlay) return;
    overlay.classList.toggle('is-open', open);
    overlay.toggleAttribute('inert', !open);
    document.body.classList.toggle('nav-open', open);
    $$('[data-overlay-toggle]').forEach((b) => b.setAttribute('aria-expanded', open));
    if (open) $('a, button', overlay)?.focus();
  }
  $$('[data-overlay-toggle]').forEach((b) => b.addEventListener('click', () => toggleOverlay(!overlay.classList.contains('is-open'))));

  // En-tête qui se compacte au scroll
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Rail vertical (proposition 3) : section courante
  const railLinks = $$('[data-rail-link]');
  if (railLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        railLinks.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    railLinks.forEach((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) io.observe(t); });
  }

  // Slider de témoignages
  $$('[data-slider]').forEach((slider) => {
    const track = $('.slider__track', slider);
    $$('.slider__btn', slider).forEach((b) => b.addEventListener('click', () => {
      const slide = $('.slider__slide', track);
      const step = slide ? slide.getBoundingClientRect().width + 24 : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      const atStart = track.scrollLeft <= 8;
      const dir = Number(b.dataset.dir);
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      else track.scrollBy({ left: dir * step, behavior: 'smooth' });
    }));
  });

  // Cas d’usage : filtres par échelle et par thématique, synchronisés avec l’URL
  const filters = $('[data-filters]');
  const list = $('[data-cases]');
  if (filters && list) {
    const params = new URLSearchParams(location.search);
    const state = { echelle: params.get('echelle') || '', theme: params.get('theme') || '' };
    const cards = $$('.case-card--full', list);
    const groups = $$('.case-group', list);
    const apply = (push) => {
      let shown = 0;
      cards.forEach((c) => {
        const ok = (!state.echelle || c.dataset.scale === state.echelle) && (!state.theme || c.dataset.theme === state.theme);
        c.classList.toggle('is-hidden', !ok);
        if (ok) shown++;
      });
      groups.forEach((g) => g.classList.toggle('is-hidden', !$$('.case-card--full:not(.is-hidden)', g).length));
      $$('.filter', filters).forEach((b) => b.setAttribute('aria-pressed', state[b.dataset.filter] === b.dataset.value));
      $('[data-count]', filters).textContent = shown;
      $('.case-empty', list).hidden = shown > 0;
      if (push) {
        const p = new URLSearchParams();
        if (state.echelle) p.set('echelle', state.echelle);
        if (state.theme) p.set('theme', state.theme);
        history.replaceState(null, '', (p.toString() ? '?' + p : location.pathname) + location.hash);
      }
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('.filter');
      if (!b) return;
      state[b.dataset.filter] = b.dataset.value;
      apply(true);
    });
    $('[data-reset]', list)?.addEventListener('click', () => { state.echelle = ''; state.theme = ''; apply(true); });
    apply(false);
    // Ouvre le cas ciblé par l’ancre (#cas-7)
    if (location.hash.startsWith('#cas-')) {
      const target = document.getElementById(location.hash.slice(1));
      const details = target && $('details', target);
      if (details) { details.open = true; requestAnimationFrame(() => target.scrollIntoView({ block: 'center' })); target.classList.add('is-target'); }
    }
  }

  // Sélecteur de situation (onglets accessibles)
  $$('[data-picker]').forEach((picker) => {
    const tabs = $$('[role="tab"]', picker);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });

  // Compteurs animés (4,9/5 · 94 % · 15)
  const counters = $$('.stat dd, [data-countup]');
  if (counters.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const run = (el) => {
      const txt = el.textContent;
      const m = txt.match(/\d+(?:,\d+)?/);
      if (!m) return;
      const target = parseFloat(m[0].replace(',', '.'));
      const dec = (m[0].split(',')[1] || '').length;
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1200);
        const v = (target * (1 - Math.pow(1 - k, 3))).toFixed(dec).replace('.', ',');
        el.textContent = txt.replace(m[0], v);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }

  // Formulaire de contact (maquette : pas d’envoi)
  $$('[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      $('.form__success', form).hidden = false;
      $('button[type="submit"]', form).disabled = true;
    });
  });
})();
