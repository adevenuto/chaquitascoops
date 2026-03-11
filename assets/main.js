// Initialize Lucide icons
lucide.createIcons();

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

// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
