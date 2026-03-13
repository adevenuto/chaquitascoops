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
  }

  buildBanner();

  let resizeTimer;
  window.addEventListener('resize', function() {
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
