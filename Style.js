// Lightbox with event delegation, video support, and basic accessibility
console.log('Style.js loaded');
let lastFocusedElement = null;

function openLightbox(src, captionText, type) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.close-btn');

  // simpan focus sebelumnya untuk restore saat ditutup
  lastFocusedElement = document.activeElement;

  if (type === 'video') {
    // tampilkan video, sembunyikan gambar
    lightboxImg.style.display = 'none';
    lightboxImg.src = '';

    lightboxVideo.src = src;
    lightboxVideo.style.display = 'block';
    lightboxVideo.setAttribute('aria-label', captionText || 'Video work');
    lightboxVideo.play().catch(() => {
      /* autoplay might be blocked, user can press play manually */
    });
  } else {
    // tampilkan gambar, sembunyikan video
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    lightboxVideo.style.display = 'none';

    lightboxImg.src = src;
    lightboxImg.alt = captionText || 'Zoomed work';
    lightboxImg.style.display = 'block';
  }

  lightboxCaption.innerText = captionText || '';

  // aksesibilitas
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.style.display = 'flex';
  document.body.classList.add('lightbox-open');

  // pastikan tombol close bisa di-focus lalu fokus ke sana
  if (closeBtn) {
    closeBtn.setAttribute('tabindex', '0');
    closeBtn.focus();
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');

  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');

  // kosongkan src untuk menghindari audio/video tetap berjalan
  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();

  // restore focus ke elemen sebelumnya bila ada
  if (lastFocusedElement) lastFocusedElement.focus();
}

// Event delegation: buka lightbox saat klik pada .gallery-item
document.addEventListener('DOMContentLoaded', function() {
  const grids = document.querySelectorAll('.gallery-grid');
  grids.forEach(function(grid) {
    grid.addEventListener('click', function(e) {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const src = item.dataset.src || (item.querySelector('img') && item.querySelector('img').src);
      const caption = item.dataset.caption || (item.querySelector('img') && item.querySelector('img').alt) || '';
      const type = item.dataset.type || 'image';
      if (src) openLightbox(src, caption, type);
    });
  });

  // jangan tutup saat klik langsung pada gambar/video (prevent accidental close)
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightboxImg) {
    lightboxImg.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  const lightboxVideo = document.getElementById('lightbox-video');
  if (lightboxVideo) {
    lightboxVideo.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // close button handler
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLightbox();
    });
    // allow Enter/Space to close when focused
    closeBtn.addEventListener('keydown', function(ev) {
      if (ev.key === 'Enter' || ev.key === ' ') closeLightbox();
    });
  }
});

// Tutup lightbox kalau user menekan tombol 'Escape' di keyboard
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') closeLightbox();
  }
});
