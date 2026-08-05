/* =========================================================
   SivaDevi Rental Studio — Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '919489354590';

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 500);
  });
  // fallback in case 'load' already fired
  setTimeout(() => preloader.classList.add('is-hidden'), 2200);

  /* ---------- Ambient gold particles ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: window.innerWidth < 720 ? 26 : 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + .4,
      d: Math.random() * 1 + .3,
      o: Math.random() * .5 + .2
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#D4AF37';
    particles.forEach(p => {
      ctx.globalAlpha = p.o;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.d * .3;
      p.x += Math.sin(p.y * 0.01) * .3;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawParticles);
  }
  initParticles();
  drawParticles();
  window.addEventListener('resize', initParticles);

  /* ---------- Nav scroll state + hamburger ---------- */
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
    document.getElementById('scrollTop').classList.toggle('is-visible', window.scrollY > 500);
  });
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
  }));

  /* ---------- Hero carousel ---------- */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  function showSlide(i) {
    slides.forEach(s => s.classList.remove('is-active'));
    dots.forEach(d => d.classList.remove('is-active'));
    slides[i].classList.add('is-active');
    dots[i].classList.add('is-active');
    current = i;
  }
  dots.forEach(d => d.addEventListener('click', () => showSlide(parseInt(d.dataset.slide))));
  setInterval(() => showSlide((current + 1) % slides.length), 5000);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: .15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  statNums.forEach(el => countIO.observe(el));
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (progress === 1 ? '+' : '');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Gallery filter ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const masonItems = document.querySelectorAll('.mason-item');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.dataset.filter;
      masonItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Gallery lightbox (with prev/next through the visible set) ---------- */
  const galleryLightbox = document.getElementById('galleryLightbox');
  const galleryLightboxImg = document.getElementById('galleryLightboxImg');
  const galleryLightboxClose = document.getElementById('galleryLightboxClose');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  let galleryIndex = 0;

  function visibleMasonItems() {
    return Array.from(masonItems).filter(item => !item.classList.contains('is-hidden'));
  }
  function showGalleryItem(i) {
    const visible = visibleMasonItems();
    if (!visible.length) return;
    galleryIndex = (i + visible.length) % visible.length;
    const img = visible[galleryIndex].querySelector('img');
    galleryLightboxImg.src = img.src;
    galleryLightboxImg.alt = img.alt || 'Photo';
  }
  function openGalleryLightbox(item) {
    const visible = visibleMasonItems();
    galleryIndex = visible.indexOf(item);
    showGalleryItem(galleryIndex < 0 ? 0 : galleryIndex);
    galleryLightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeGalleryLightbox() {
    galleryLightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { galleryLightboxImg.src = ''; }, 300);
  }
  masonItems.forEach(item => {
    item.addEventListener('click', () => openGalleryLightbox(item));
  });
  galleryPrev.addEventListener('click', () => showGalleryItem(galleryIndex - 1));
  galleryNext.addEventListener('click', () => showGalleryItem(galleryIndex + 1));
  galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
  galleryLightbox.addEventListener('click', (e) => { if (e.target === galleryLightbox) closeGalleryLightbox(); });

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.acc-item').forEach(item => {
    item.querySelector('.acc-head').addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Theme switcher (Light / Dark) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const logoImgs = document.querySelectorAll('.theme-logo');
  const LOGO_FOR_LIGHT = 'media/shop/logo-dark.jpeg';  // dark-coloured logo reads well on light backgrounds
  const LOGO_FOR_DARK = 'media/shop/logo-light.png';  // light-coloured logo reads well on dark backgrounds

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    logoImgs.forEach(img => { img.src = theme === 'dark' ? LOGO_FOR_DARK : LOGO_FOR_LIGHT; });
    try { localStorage.setItem('sivadevi-theme', theme); } catch (e) { }
  }
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('sivadevi-theme') || 'dark'; } catch (e) { }
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  /* ---------- Scroll to top ---------- */
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Testimonials carousel ---------- */
  const testiTrack = document.getElementById('testiTrack');
  const testiCards = document.querySelectorAll('.testi-card');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  const testiDotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;
  let testiTimer;

  testiCards.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsWrap.appendChild(dot);
  });
  const testiDots = testiDotsWrap.querySelectorAll('button');

  function goToTesti(i) {
    testiIndex = (i + testiCards.length) % testiCards.length;
    testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
    testiDots.forEach(d => d.classList.remove('is-active'));
    testiDots[testiIndex].classList.add('is-active');
  }
  function startTestiAutoplay() {
    clearInterval(testiTimer);
    testiTimer = setInterval(() => goToTesti(testiIndex + 1), 6000);
  }
  testiPrev.addEventListener('click', () => { goToTesti(testiIndex - 1); startTestiAutoplay(); });
  testiNext.addEventListener('click', () => { goToTesti(testiIndex + 1); startTestiAutoplay(); });
  startTestiAutoplay();

  /* ---------- Instagram video lightbox ---------- */
  // Replace these src paths with your actual exported reel .mp4 files.
  const instaVideos = [
   'media/insta/instagram-1.mp4',
    'media/insta/instagram-2.mp4',
    'media/insta/instagram-3.mp4',
    'media/insta/instagram-4.mp4',
    'media/insta/instagram-5.mp4',
    'media/insta/instagram-6.mp4'
  ];
  const instaThumbs = document.querySelectorAll('.insta-thumb');
  const instaLightbox = document.getElementById('instaLightbox');
  const instaLightboxVideo = document.getElementById('instaLightboxVideo');
  const instaLightboxClose = document.getElementById('instaLightboxClose');
  const instaPrev = document.getElementById('instaPrev');
  const instaNext = document.getElementById('instaNext');
  let instaIndex = 0;

  function openInstaLightbox(i) {
    instaIndex = (i + instaVideos.length) % instaVideos.length;
    instaLightboxVideo.src = instaVideos[instaIndex];
    instaLightboxVideo.poster = instaThumbs[instaIndex].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    instaLightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    instaLightboxVideo.play().catch(() => { });
  }
  function closeInstaLightbox() {
    instaLightboxVideo.pause();
    instaLightboxVideo.removeAttribute('src');
    instaLightboxVideo.load();
    instaLightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  instaThumbs.forEach((btn, i) => btn.addEventListener('click', () => openInstaLightbox(i)));
  instaLightboxClose.addEventListener('click', closeInstaLightbox);
  instaLightbox.addEventListener('click', (e) => { if (e.target === instaLightbox) closeInstaLightbox(); });
  instaPrev.addEventListener('click', () => openInstaLightbox(instaIndex - 1));
  instaNext.addEventListener('click', () => openInstaLightbox(instaIndex + 1));

  /* ---------- Global keyboard support for all overlays/lightboxes ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (galleryLightbox.classList.contains('is-open')) closeGalleryLightbox();
      if (instaLightbox.classList.contains('is-open')) closeInstaLightbox();
      if (overlay.classList.contains('is-open')) closeModal();
      if (themeOverlay.classList.contains('is-open')) closeThemeModal();
    }
    if (e.key === 'ArrowLeft') {
      if (galleryLightbox.classList.contains('is-open')) showGalleryItem(galleryIndex - 1);
      if (instaLightbox.classList.contains('is-open')) openInstaLightbox(instaIndex - 1);
    }
    if (e.key === 'ArrowRight') {
      if (galleryLightbox.classList.contains('is-open')) showGalleryItem(galleryIndex + 1);
      if (instaLightbox.classList.contains('is-open')) openInstaLightbox(instaIndex + 1);
    }
  });

  /* ---------- Booking modal ---------- */
  const overlay = document.getElementById('bookingOverlay');
  const modalClose = document.getElementById('modalClose');
  const closeSuccess = document.getElementById('closeSuccess');
  const formWrap = document.getElementById('formWrap');
  const formSuccess = document.getElementById('formSuccess');
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

  function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      formWrap.classList.remove('is-hidden');
      formSuccess.classList.remove('is-visible');
      bookingForm.reset();
      submitBtn.classList.remove('is-loading');
    }, 300);
  }
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  modalClose.addEventListener('click', closeModal);
  closeSuccess.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.classList.add('is-loading');

    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const date = document.getElementById('fDate').value;
    const slot = document.getElementById('fSlot').value;
    const type = document.getElementById('fType').value;
    const members = document.getElementById('fMembers').value || '—';
    const note = document.getElementById('fNote').value.trim() || '—';

    // Simulate backend logging + WhatsApp handoff (feature described in content plan)
    setTimeout(() => {
      const waText = encodeURIComponent(
        `New Booking Request\nName: ${name}\nPhone: ${phone}\nDate: ${date} | Slot: ${slot}\nType: ${type}\nMembers: ${members}\nNote: ${note}`
      );
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      // Open a pre-filled WhatsApp chat to the studio's business number
      window.open(waLink, '_blank');

      successMsg.textContent = `Thank you ${name}! We've received your booking request for ${date || 'your chosen date'}. Our team at SivaDevi Rental Studio will confirm your slot shortly.`;
      formWrap.classList.add('is-hidden');
      formSuccess.classList.add('is-visible');
      submitBtn.classList.remove('is-loading');
    }, 900);
  });

  /* ---------- Theme (photoshoot theme) PDF request modal ---------- */
  const themeOverlay = document.getElementById('themeOverlay');
  const themeModalClose = document.getElementById('themeModalClose');
  const themeCloseSuccess = document.getElementById('themeCloseSuccess');
  const themeFormWrap = document.getElementById('themeFormWrap');
  const themeFormSuccess = document.getElementById('themeFormSuccess');
  const themeForm = document.getElementById('themeForm');
  const themeSubmitBtn = document.getElementById('themeSubmitBtn');
  const themeSuccessMsg = document.getElementById('themeSuccessMsg');
  const themeModalTitle = document.getElementById('themeModalTitle');
  let activeThemeName = '';

  function openThemeModal(themeName) {
    activeThemeName = themeName;
    themeModalTitle.textContent = `Get "${themeName}"`;
    themeOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeThemeModal() {
    themeOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      themeFormWrap.classList.remove('is-hidden');
      themeFormSuccess.classList.remove('is-visible');
      themeForm.reset();
      themeSubmitBtn.classList.remove('is-loading');
    }, 300);
  }
  document.querySelectorAll('.theme-download').forEach(btn => {
    btn.addEventListener('click', () => openThemeModal(btn.dataset.themeName));
  });
  themeModalClose.addEventListener('click', closeThemeModal);
  themeCloseSuccess.addEventListener('click', closeThemeModal);
  themeOverlay.addEventListener('click', (e) => { if (e.target === themeOverlay) closeThemeModal(); });

  themeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    themeSubmitBtn.classList.add('is-loading');

    const name = document.getElementById('tName').value.trim();
    const phone = document.getElementById('tPhone').value.trim();

    setTimeout(() => {
      const waText = encodeURIComponent(
        `Theme PDF Request\nTheme: ${activeThemeName}\nName: ${name}\nPhone: ${phone}\n\nPlease send me the PDF for this theme. Thank you!`
      );
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      // Hand off to WhatsApp so the studio team can send the theme PDF directly
      window.open(waLink, '_blank');

      themeSuccessMsg.textContent = `Thank you ${name}! Our team will send the "${activeThemeName}" theme PDF to your WhatsApp shortly.`;
      themeFormWrap.classList.add('is-hidden');
      themeFormSuccess.classList.add('is-visible');
      themeSubmitBtn.classList.remove('is-loading');
    }, 900);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
