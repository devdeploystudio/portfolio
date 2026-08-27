document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initHeroReveal();
  initScrollReveal();
  initStatCounters();
  initLightbox();
  initWorkGrid();
  initTestimonials();
  initInputFilters();
  initContactForm();
  initBackToTop();
});

/* ============ FILTROS Y VALIDACION DE FORMULARIOS ============ */
// Campos con data-only="letters"/"digits" solo dejan tipear eso. Al enviar,
// se marcan en rojo los campos que falten y se muestra un cartel arriba
// del form en vez de la validación fea que muestra el navegador por defecto.
function initInputFilters() {
  document.addEventListener('input', (e) => {
    const only = e.target.dataset?.only;
    if (!only) return;
    const before = e.target.value;
    const start = e.target.selectionStart;
    const after = only === 'digits'
      ? before.replace(/\D/g, '')
      : before.replace(/[^A-Za-zÀ-ÿ\s'-]/g, '');
    if (after === before) return;
    e.target.value = after;
    const pos = start - (before.length - after.length);
    e.target.setSelectionRange(pos, pos);
  }, true);

  document.addEventListener('input', (e) => {
    if (!e.target.matches('input[required], select[required], textarea[required]')) return;
    if (e.target.checkValidity()) e.target.classList.remove('is-invalid');
    const form = e.target.closest('form');
    const alertEl = form?.querySelector('.form-alert');
    if (alertEl) alertEl.hidden = true;
  });
}

function validateForm(form) {
  const campos = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
  const invalidos = campos.filter((c) => !c.checkValidity());
  campos.forEach((c) => c.classList.toggle('is-invalid', !c.checkValidity()));

  const alertEl = form.querySelector('.form-alert');
  if (alertEl) alertEl.hidden = invalidos.length === 0;

  if (invalidos.length) {
    invalidos[0].focus();
    return false;
  }
  return true;
}

/* ============ LOADER ============ */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderProgress');
  const pct = document.getElementById('loaderPct');
  if (!loader || !bar || !pct) return;

  document.body.style.overflow = 'hidden';

  let progress = 0;
  const interval = setInterval(() => {
    progress += (90 - progress) * 0.12 + 0.6;
    progress = Math.min(progress, 90);
    bar.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
  }, 110);

  const finish = () => {
    clearInterval(interval);
    bar.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.style.overflow = '';
    }, 300);
  };

  if (document.readyState === 'complete') {
    setTimeout(finish, 400);
  } else {
    window.addEventListener('load', () => setTimeout(finish, 400), { once: true });
  }
}

/* ============ CUSTOM CURSOR ============ */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverables = 'a, button, .work-card, input, select, textarea';
  const lightSections = '.hero, .marquee, .nav:not(.is-scrolled), .cta-band, .footer, .lightbox';

  dot.classList.add('is-hidden');
  ring.classList.add('is-hidden');

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let ready = false;

  const setPos = (el, x, y) => {
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    setPos(dot, mx, my);
    if (!ready) {
      ready = true;
      rx = mx;
      ry = my;
      setPos(ring, rx, ry);
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    }
    if (reduceMotion) setPos(ring, mx, my);
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });
  document.addEventListener('mouseenter', () => {
    if (ready) {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    }
  });

  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('is-active', !!e.target.closest(hoverables));
    ring.classList.toggle('is-light', !!e.target.closest(lightSections));
  });

  if (!reduceMotion) {
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      setPos(ring, rx, ry);
      requestAnimationFrame(loop);
    })();
  }
}

/* ============ NAV ============ */
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!burger || !links) return;

  const closeMenu = () => {
    links.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
}

/* ============ HERO REVEAL ============ */
function initHeroReveal() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));
}

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
}

/* ============ HERO STAT COUNTERS ============ */
function initStatCounters() {
  const stats = document.querySelectorAll('.hero__stat-num[data-count]');
  if (!stats.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  stats.forEach((el) => observer.observe(el));
}

/* ============ LIGHTBOX ============ */
function initLightbox() {
  const cards = document.querySelectorAll('.work-card');
  const lightbox = document.getElementById('lightbox');
  if (!cards.length || !lightbox) return;

  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const items = Array.from(cards).map((card) => {
    const media = card.querySelector('img');
    return {
      src: media ? media.getAttribute('src') : '',
      alt: media ? media.getAttribute('alt') : '',
      title: card.querySelector('h3')?.textContent.trim() || '',
      desc: card.querySelector('.work-card__info p')?.textContent.trim() || '',
    };
  });

  let current = 0;

  const render = () => {
    const item = items[current];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.desc ? `${item.title} — ${item.desc}` : item.title;
  };

  const open = (index) => {
    current = index;
    render();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const step = (dir) => {
    current = (current + dir + items.length) % items.length;
    render();
  };

  cards.forEach((card, i) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver ${items[i].title}`);
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  closeBtn?.addEventListener('click', close);
  nextBtn?.addEventListener('click', () => step(1));
  prevBtn?.addEventListener('click', () => step(-1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}

/* ============ GRILLA DE TRABAJOS (COLLAGE SIN HUECOS) ============ */
// Cada tarjeta ocupa un múltiplo entero (1x1, 2x1, 1x2, 2x2) de la misma
// celda cuadrada --cell, y CSS Grid (grid-auto-flow:dense) las acomoda de
// forma nativa. Solo hace falta que --cell mida lo mismo que una columna
// real para que los márgenes calcen siempre, así que la calculamos en JS.
function initWorkGrid() {
  const grid = document.querySelector('.work__grid');
  if (!grid) return;

  function layout() {
    const styles = getComputedStyle(grid);
    const gap = parseFloat(styles.columnGap) || 0;
    const numCols = styles.gridTemplateColumns.split(' ').length;
    const cell = (grid.getBoundingClientRect().width - gap * (numCols - 1)) / numCols;
    grid.style.setProperty('--cell', `${cell}px`);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });
  window.addEventListener('load', layout);
  layout();
}

/* ============ TESTIMONIALS SLIDER ============ */
function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  if (!slides.length) return;

  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ver testimonio ${i + 1}`);
    dot.innerHTML = '<span class="testi-dot__mark" aria-hidden="true"></span>';
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  };

  const goTo = (i, manual) => {
    index = (i + slides.length) % slides.length;
    render();
    if (manual) restart();
  };

  const next = () => goTo(index + 1);
  const start = () => { timer = setInterval(next, 4200); };
  const stop = () => { if (timer) clearInterval(timer); };
  const restart = () => { stop(); start(); };

  // deslizar con el dedo (o el mouse) para pasar de testimonio, en vez de
  // depender solo de los puntos o de esperar al autoplay
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDeltaX = 0;
  let dragging = false;
  let dragAxis = null; // 'x' (arrastre del carrusel) | 'y' (scroll de página) | null sin definir aún

  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    dragAxis = null;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragDeltaX = 0;
    track.classList.add('is-dragging');
    try { track.setPointerCapture(e.pointerId); } catch (err) {}
    stop();
  });

  // con touch-action:pan-y el navegador decide solo, con el primer
  // movimiento, si esto es un scroll vertical: si no le avisamos con
  // preventDefault que es un arrastre horizontal, nos cancela el gesto
  // (pointercancel) antes de que el swipe llegue a hacer nada.
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dragDeltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    const absX = Math.abs(dragDeltaX);
    const absY = Math.abs(deltaY);

    // un swipe real casi nunca es 100% horizontal: el dedo siempre tiembla
    // un poco en el otro eje. Le damos ventaja al gesto horizontal (que es
    // lo que se espera acá) y solo lo tratamos como scroll de página si lo
    // vertical es claramente más grande, no apenas un poco.
    if (dragAxis === null && (absX > 10 || absY > 10)) {
      dragAxis = absY > absX * 1.3 ? 'y' : 'x';
    }
    if (dragAxis === 'y') return;

    e.preventDefault();
    track.style.transform = `translateX(calc(-${index * 100}% + ${dragDeltaX}px))`;
  }, { passive: false });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    const threshold = track.getBoundingClientRect().width * 0.15;
    if (dragAxis === 'y') { dragDeltaX = 0; return; }
    if (dragDeltaX <= -threshold) goTo(index + 1, true);
    else if (dragDeltaX >= threshold) goTo(index - 1, true);
    else { render(); restart(); }
    dragDeltaX = 0;
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  // por si en algún dispositivo setPointerCapture no agarra bien y el dedo
  // se corre fuera de la tarjeta a mitad del gesto: igual cerramos el drag.
  track.addEventListener('pointerleave', endDrag);

  render();
  start();

  const slider = track.closest('.testimonials__slider');
  slider?.addEventListener('mouseenter', stop);
  slider?.addEventListener('mouseleave', start);
}

/* ============ CONTACT FORM ============ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const note = document.getElementById('contactNote');
  const submitBtn = form.querySelector('button[type="submit"]');
  const label = submitBtn?.querySelector('.btn__label');
  const originalLabel = label ? label.textContent : '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    submitBtn.disabled = true;
    if (label) label.textContent = 'Enviando...';
    if (note) note.textContent = '';

    setTimeout(() => {
      submitBtn.disabled = false;
      if (label) label.textContent = originalLabel;
      if (note) note.textContent = 'Gracias, recibí tu mensaje. Te respondo dentro de las 48 horas.';
      showToast('Mensaje enviado correctamente.');
      form.reset();
    }, 1100);
  });
}

/* ============ TOAST ============ */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

/* ============ BACK TO TOP ============ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
