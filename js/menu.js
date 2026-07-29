document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const toggle = document.createElement('button');
  toggle.className = 'menu-toggle';
  toggle.innerHTML = '☰';
  toggle.setAttribute('aria-label', 'Abrir menu');
  document.body.appendChild(toggle);

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isActive = sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    toggle.innerHTML = isActive ? '✕' : '☰';
    if (window.innerWidth &lt; 992) {
      document.body.style.overflow = isActive ? 'hidden' : 'auto';
    }
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener('click', toggleMenu);

  sidebar.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (sidebar.classList.contains('active')) toggleMenu();
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      toggle.innerHTML = '☰';
      document.body.style.overflow = 'auto';
    }
  });
});
