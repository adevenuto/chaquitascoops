// Initialize Lucide icons
lucide.createIcons();

// Scroll offset for sticky nav + banner
const SCROLL_OFFSET = 90;
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - SCROLL_OFFSET,
      behavior: 'smooth'
    });
  });
});

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  links.classList.toggle('open');
});
// Close nav on link click
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// Papel picado banner
(function() {
  const COLORS = ['red','yellow','orange','green','teal','blue','purple'];
  const banner = document.querySelector('.mex-banner');
  if (!banner) return;

  function buildBanner() {
    const bannerWidth = banner.offsetWidth;
    const gap = 4;

    // Create a temp flag to measure rendered width
    const temp = document.createElement('img');
    temp.src = 'assets/images/banner-red.png';
    temp.className = 'mex-flag';
    temp.style.visibility = 'hidden';
    banner.appendChild(temp);

    function onTempLoad() {
      temp.onload = null; // prevent double-fire
      const flagWidth = temp.offsetWidth;
      banner.removeChild(temp);

      // Calculate how many flags fit
      let count = Math.floor((bannerWidth + gap) / (flagWidth + gap));
      count = Math.max(count - 2, 4);

      // Clear and rebuild
      banner.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        img.src = `assets/images/banner-${COLORS[i % COLORS.length]}.png`;
        img.alt = '';
        img.className = 'mex-flag';
        banner.appendChild(img);
      }
    }

    temp.onload = onTempLoad;
    if (temp.complete) onTempLoad();
    lastWidth = banner.offsetWidth;
  }

  let lastWidth = banner.offsetWidth;
  buildBanner();
  let resizeTimer;
  window.addEventListener('resize', function() {
    const w = banner.offsetWidth;
    if (w === lastWidth) return;
    lastWidth = w;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildBanner, 150);
  });
})();

// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Paleta tooltip
(function() {
  const tooltip = document.getElementById('paletaTooltip');
  if (!tooltip) return;

  const nameEl = tooltip.querySelector('.paleta-tooltip-name');
  const descEl = tooltip.querySelector('.paleta-tooltip-desc');
  const imgEl = tooltip.querySelector('.paleta-tooltip-img');
  const tags = document.querySelectorAll('.paleta-tag[data-desc]');
  let activeTag = null;
  let hideTimer = null;

  function show(tag) {
    clearTimeout(hideTimer);
    activeTag = tag;
    nameEl.textContent = tag.textContent;
    descEl.textContent = tag.dataset.desc;
    if (tag.dataset.img) {
      imgEl.style.backgroundImage = 'url(' + tag.dataset.img + ')';
      imgEl.style.display = '';
    } else {
      imgEl.style.backgroundImage = '';
      imgEl.style.display = 'none';
    }
    tooltip.classList.add('visible');
    position(tag);
  }

  function hide() {
    hideTimer = setTimeout(function() {
      tooltip.classList.remove('visible');
      activeTag = null;
    }, 120);
  }

  function position(tag) {
    const r = tag.getBoundingClientRect();
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 10;

    // Horizontal: center on pill, clamp to viewport
    var left = r.left + r.width / 2 - tw / 2;
    left = Math.max(gap, Math.min(left, vw - tw - gap));

    // Vertical: prefer below, flip above if no room
    var top;
    if (r.bottom + gap + th <= vh) {
      top = r.bottom + gap;
    } else {
      top = r.top - gap - th;
    }
    // Clamp vertical too
    top = Math.max(gap, Math.min(top, vh - th - gap));

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  // Desktop: hover
  tags.forEach(function(tag) {
    tag.addEventListener('mouseenter', function() { show(tag); });
    tag.addEventListener('mouseleave', hide);
  });

  // Mobile: touch
  tags.forEach(function(tag) {
    tag.addEventListener('touchstart', function(e) {
      e.preventDefault();
      if (activeTag === tag) {
        hide();
      } else {
        show(tag);
      }
    }, { passive: false });
  });

  // Dismiss on scroll or touch outside
  document.addEventListener('touchstart', function(e) {
    if (activeTag && !e.target.closest('.paleta-tag')) {
      hide();
    }
  });
  window.addEventListener('scroll', function() {
    if (activeTag) hide();
  }, { passive: true });
})();
