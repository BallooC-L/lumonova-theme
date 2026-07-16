/* ============================================================
   LUMOnova — theme.js
   Scroll reveal + utility functions
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Scroll Reveal ────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal, .reveal-fade');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ── Stagger children within reveal grids ────────────────
  document.querySelectorAll('.reveal .grid-4, .reveal .grid-3').forEach(function (grid) {
    var children = grid.children;
    Array.from(children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.07) + 's';
      child.classList.add('reveal');
    });
  });

  // ── Cart counter update ──────────────────────────────────
  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        var badges = document.querySelectorAll('[data-cart-count]');
        badges.forEach(function (badge) {
          badge.textContent = cart.item_count;
          badge.style.display = cart.item_count > 0 ? 'flex' : 'none';
        });
      })
      .catch(function () {});
  }

  // ── Smooth anchor scrolling for #id links ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

});
