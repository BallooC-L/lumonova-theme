/* ============================================================
   LUMOnova — cart-drawer.js
   i18n: liest alle Strings aus #cart-drawer-i18n data-Attributen
   ============================================================ */

(function () {

  /* ── i18n — aus dem vom Snippet gerenderten Data-Element ─── */
  var _node = document.getElementById('cart-drawer-i18n');
  var _i18n = _node ? {
    empty:         _node.dataset.empty         || 'Dein Warenkorb ist leer.',
    emptyBody:     _node.dataset.emptyBody      || 'Entdecke unsere smarten Leuchtmittel.',
    emptyCta:      _node.dataset.emptyCta       || 'Jetzt entdecken',
    emptySubtitle: _node.dataset.emptySubtitle  || 'Dein Warenkorb ist leer',
    itemSingular:  _node.dataset.itemSingular   || 'Artikel',
    itemPlural:    _node.dataset.itemPlural     || 'Artikel',
    qtyDecrease:   _node.dataset.qtyDecrease    || 'Menge verringern',
    qtyIncrease:   _node.dataset.qtyIncrease    || 'Menge erhöhen',
    removeAria:    _node.dataset.removeAria     || 'entfernen',
    errorLoading:  _node.dataset.errorLoading   || 'Fehler beim Laden.',
    toastAdded:    _node.dataset.toastAdded     || 'hinzugefügt',
    localePrefix:  _node.dataset.localePrefix   || ''
  } : {};

  /* ── Helpers ─────────────────────────────────────────────── */
  function formatMoney(cents) {
    var locale = document.documentElement.lang || 'de';
    return (cents / 100).toLocaleString(locale, { style: 'currency', currency: 'EUR' });
  }

  function el(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Toast ───────────────────────────────────────────────── */
  var toastTimer = null;

  function showToast(message) {
    var toast = el('cart-toast');
    if (!toast) return;
    var textEl = toast.querySelector('.cart-toast__text');
    if (textEl) textEl.textContent = message || _i18n.toastAdded;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  /* ── Drawer open / close ─────────────────────────────────── */
  window.openCartDrawer = function () {
    var drawer = el('cart-drawer');
    var backdrop = el('cart-drawer-backdrop');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('cart-drawer-open');
    var closeBtn = drawer.querySelector('.cart-drawer__close');
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 50);
    renderCartDrawer();
  };

  window.closeCartDrawer = function () {
    var drawer = el('cart-drawer');
    var backdrop = el('cart-drawer-backdrop');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('cart-drawer-open');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var drawer = el('cart-drawer');
      if (drawer && drawer.classList.contains('is-open')) closeCartDrawer();
    }
  });

  /* ── Fetch cart & render ─────────────────────────────────── */
  function renderCartDrawer() {
    var body = el('cart-drawer-body');
    var footer = el('cart-drawer-footer');
    var subtitle = el('cart-drawer-subtitle');
    if (!body) return;

    body.innerHTML = '<div class="cart-drawer__loading"><span class="material-symbols-outlined cart-drawer__loading-icon" aria-hidden="true">shopping_bag</span></div>';
    if (footer) footer.style.display = 'none';

    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateCartBadges(cart.item_count);

        if (subtitle) {
          if (cart.item_count === 0)     subtitle.textContent = _i18n.emptySubtitle;
          else if (cart.item_count === 1) subtitle.textContent = '1 ' + _i18n.itemSingular;
          else                            subtitle.textContent = cart.item_count + ' ' + _i18n.itemPlural;
        }

        if (cart.item_count === 0) {
          renderEmpty(body);
          if (footer) footer.style.display = 'none';
          return;
        }

        renderItems(body, cart);
        renderFooter(cart);
      })
      .catch(function () {
        body.innerHTML = '<p style="color:var(--fg-low); font-size:14px; padding:2rem 0; text-align:center;">' + _i18n.errorLoading + '</p>';
      });
  }

  function renderEmpty(body) {
    body.innerHTML = [
      '<div class="cart-drawer__empty">',
      '  <span class="material-symbols-outlined cart-drawer__empty-icon" aria-hidden="true">shopping_bag</span>',
      '  <p class="cart-drawer__empty-title">' + _i18n.empty + '</p>',
      '  <p class="cart-drawer__empty-body">' + _i18n.emptyBody + '</p>',
      '  <a href="' + _i18n.localePrefix + '/collections/all" class="cart-drawer__empty-cta" onclick="closeCartDrawer()">',
      '    ' + _i18n.emptyCta,
      '    <span class="material-symbols-outlined" style="font-size:15px;vertical-align:middle;" aria-hidden="true">arrow_forward</span>',
      '  </a>',
      '</div>'
    ].join('');
  }

  function renderItems(body, cart) {
    var html = '';
    cart.items.forEach(function (item) {
      var imgHtml = item.image
        ? '<img src="' + item.image + '" alt="' + escapeHtml(item.product_title) + '" class="cart-line__image" loading="lazy">'
        : '<div class="cart-line__image--placeholder"><span class="material-symbols-outlined fg-minimal" style="font-size:24px;" aria-hidden="true">image_not_supported</span></div>';

      var variantHtml = (item.variant_title && item.variant_title !== 'Default Title')
        ? '<p class="cart-line__variant">' + escapeHtml(item.variant_title) + '</p>'
        : '';

      html += [
        '<div class="cart-line" data-key="' + item.key + '">',
        '  ' + imgHtml,
        '  <div class="cart-line__info">',
        '    <p class="cart-line__name">' + escapeHtml(item.product_title) + '</p>',
        variantHtml,
        '    <p class="cart-line__price">' + formatMoney(item.line_price) + '</p>',
        '    <div class="cart-line__qty">',
        '      <button type="button" class="cart-line__qty-btn" onclick="cartUpdateQty(\'' + item.key + '\',' + (item.quantity - 1) + ')" aria-label="' + _i18n.qtyDecrease + '">−</button>',
        '      <span class="cart-line__qty-num">' + item.quantity + '</span>',
        '      <button type="button" class="cart-line__qty-btn" onclick="cartUpdateQty(\'' + item.key + '\',' + (item.quantity + 1) + ')" aria-label="' + _i18n.qtyIncrease + '">+</button>',
        '    </div>',
        '  </div>',
        '  <button type="button" class="cart-line__remove" onclick="cartRemoveItem(\'' + item.key + '\')" aria-label="' + escapeHtml(item.product_title) + ' ' + _i18n.removeAria + '">',
        '    <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">delete_outline</span>',
        '  </button>',
        '</div>'
      ].join('');
    });
    body.innerHTML = html;
  }

  function renderFooter(cart) {
    var footer = el('cart-drawer-footer');
    var totalEl = el('cart-drawer-total');
    if (!footer) return;
    if (totalEl) totalEl.textContent = formatMoney(cart.total_price);
    footer.style.display = 'flex';
  }

  /* ── Cart API actions ────────────────────────────────────── */
  window.cartUpdateQty = function (key, qty) {
    if (qty < 0) return;
    cartRequest('/cart/change.js', { id: key, quantity: qty });
  };

  window.cartRemoveItem = function (key) {
    cartRequest('/cart/change.js', { id: key, quantity: 0 });
  };

  function cartRequest(url, data) {
    var body = el('cart-drawer-body');
    if (body) body.style.opacity = '0.5';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        if (body) body.style.opacity = '1';
        renderCartDrawer();
      })
      .catch(function () {
        if (body) body.style.opacity = '1';
      });
  }

  /* ── Add to cart ─────────────────────────────────────────── */
  window.addToCartAndOpen = function (variantId, quantity) {
    quantity = quantity || 1;
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function (item) {
        showToast('\u201e' + (item.product_title || 'Produkt') + '\u201c ' + _i18n.toastAdded);
        openCartDrawer();
      })
      .catch(function () {
        openCartDrawer();
      });
  };

  /* ── Cart badge update ───────────────────────────────────── */
  function updateCartBadges(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) { updateCartBadges(cart.item_count); })
      .catch(function () {});
  });

})();
