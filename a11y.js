(function () {
  if (window.__dhA11yMounted) return;
  window.__dhA11yMounted = true;
  var KEY = 'dh-a11y';
  var DEF = { zoom: 1, contrast: false, gray: false, links: false, motion: false, font: false, cursor: false };
  var st = Object.assign({}, DEF);
  try { var raw = localStorage.getItem(KEY); if (raw) st = Object.assign({}, DEF, JSON.parse(raw)); } catch (e) {}

  function apply() {
    var r = document.documentElement;
    r.setAttribute('data-a11y-contrast', st.contrast ? '1' : '0');
    r.setAttribute('data-a11y-gray', st.gray ? '1' : '0');
    r.setAttribute('data-a11y-links', st.links ? '1' : '0');
    r.setAttribute('data-a11y-motion', st.motion ? 'off' : 'on');
    r.setAttribute('data-a11y-font', st.font ? '1' : '0');
    r.setAttribute('data-a11y-cursor', st.cursor ? 'big' : 'normal');
    if (document.body) document.body.style.zoom = st.zoom === 1 ? '' : String(st.zoom);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} apply(); repaint(); }
  function repaint() { if (!panel) return; var c = panel.querySelector('button[aria-label="סגירת הגדרות נגישות"]'); paint(); if (c) panel.appendChild(c); }

  var css = document.createElement('style');
  css.textContent = [
    'html[data-a11y-gray="1"] { filter: grayscale(1); }',
    'html[data-a11y-contrast="1"] body { background: #03060E; }',
    'html[data-a11y-contrast="1"] p, html[data-a11y-contrast="1"] li, html[data-a11y-contrast="1"] span,',
    'html[data-a11y-contrast="1"] h1, html[data-a11y-contrast="1"] h2, html[data-a11y-contrast="1"] h3 { color: #FFFFFF !important; }',
    'html[data-a11y-links="1"] a { text-decoration: underline; text-underline-offset: 4px; text-decoration-color: #FF7AA8; text-decoration-thickness: 2px; }',
    'html[data-a11y-motion="off"] *, html[data-a11y-motion="off"] *::before, html[data-a11y-motion="off"] *::after { animation: none !important; transition: none !important; }',
    'html[data-a11y-font="1"] body, html[data-a11y-font="1"] body * { font-family: Arial, "Noto Sans Hebrew", system-ui, sans-serif !important; letter-spacing: .01em !important; }',
    'html[data-a11y-cursor="big"], html[data-a11y-cursor="big"] * { cursor: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2748%27 height=%2748%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M5 2l14 10-6 1 3.5 7-2.6 1.2L10.4 14 5 18z%27 fill=%27%23fff%27 stroke=%27%23111%27 stroke-width=%271%27/%3E%3C/svg%3E") 2 2, auto !important; }',
    '#dh-a11y-panel button:focus-visible, #dh-a11y-btn:focus-visible, [data-a11y-open]:focus-visible { outline: 2px solid #FF7AA8; outline-offset: 3px; }'
  ].join('\n');
  document.head.appendChild(css);
  apply();

  var wrap, panel, btn, open = false;
  var TOGGLES = [
    ['contrast', 'ניגודיות גבוהה'],
    ['gray', 'גווני אפור'],
    ['links', 'הדגשת קישורים'],
    ['motion', 'הפחתת אנימציות'],
    ['font', 'פונט קריא'],
    ['cursor', 'סמן עכבר מוגדל']
  ];

  function mkBtn(label, aria, onClick, style) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    if (aria) b.setAttribute('aria-label', aria);
    b.style.cssText = style;
    b.addEventListener('click', onClick);
    return b;
  }
  function tStyle(on) {
    return 'min-height:44px;padding:0 14px;text-align:right;border-radius:12px;cursor:pointer;font-family:inherit;font-size:15px;' +
      'border:1px solid ' + (on ? 'rgba(255,122,168,.7)' : 'rgba(255,255,255,.14)') + ';' +
      'background:' + (on ? 'rgba(255,122,168,.14)' : 'transparent') + ';' +
      'color:' + (on ? '#FFFFFF' : 'rgba(234,240,250,.78)') + ';';
  }

  function paint() {
    if (!panel) return;
    panel.innerHTML = '';
    var h = document.createElement('h2');
    h.textContent = 'הגדרות נגישות';
    h.style.cssText = "margin:0 0 14px;font-family:'Heebo',sans-serif;font-weight:800;font-size:16px;color:#FFFFFF;";
    panel.appendChild(h);
    var col = document.createElement('div');
    col.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;';
    var zs = 'flex:1;min-height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#fff;font-family:inherit;font-weight:700;cursor:pointer;';
    row.appendChild(mkBtn('א−', 'הקטנת גודל תצוגה', function () { st.zoom = Math.max(1, +(st.zoom - 0.1).toFixed(2)); save(); }, zs + 'font-size:16px;'));
    row.appendChild(mkBtn('א+', 'הגדלת גודל תצוגה', function () { st.zoom = Math.min(1.4, +(st.zoom + 0.1).toFixed(2)); save(); }, zs + 'font-size:18px;'));
    col.appendChild(row);
    TOGGLES.forEach(function (t) {
      var on = !!st[t[0]];
      var b = mkBtn(t[1], null, function () { st[t[0]] = !st[t[0]]; save(); }, tStyle(on));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      col.appendChild(b);
    });
    col.appendChild(mkBtn('איפוס הגדרות', null, function () { st = Object.assign({}, DEF); save(); },
      'min-height:44px;margin-top:4px;border-radius:12px;border:1px solid rgba(255,122,168,.5);background:transparent;color:#FF7AA8;font-family:inherit;font-weight:700;font-size:15px;cursor:pointer;'));
    panel.appendChild(col);
    var note = document.createElement('p');
    note.textContent = 'ההגדרות נשמרות בדפדפן שלכם בלבד.';
    note.style.cssText = 'margin:14px 0 0;font-size:12px;line-height:1.6;color:rgba(234,240,250,.42);';
    panel.appendChild(note);
  }

  var lastTrigger = null;

  function setOpen(v, trigger) {
    open = v;
    if (!wrap) return;
    wrap.style.display = v ? 'grid' : 'none';
    var triggers = document.querySelectorAll('[data-a11y-open]');
    for (var i = 0; i < triggers.length; i++) triggers[i].setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) {
      lastTrigger = trigger || document.activeElement;
      var f = panel.querySelector('button');
      if (f) f.focus();
    } else if (lastTrigger && lastTrigger.focus) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  function mount() {
    apply();
    if (document.getElementById('dh-a11y-panel')) return;

    wrap = document.createElement('div');
    wrap.dir = 'rtl';
    wrap.style.cssText = "display:none;position:fixed;inset:0;z-index:80;place-items:center;padding:20px;background:rgba(4,8,18,.66);font-family:'Assistant',system-ui,sans-serif;";
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) setOpen(false); });

    panel = document.createElement('div');
    panel.id = 'dh-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.style.cssText = 'position:relative;width:320px;max-width:100%;max-height:88vh;overflow:auto;padding:22px;border-radius:20px;border:1px solid rgba(255,122,168,.35);background:#0A1020;box-shadow:0 30px 80px rgba(0,0,0,.6);text-align:right;';

    var close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'סגירת הגדרות נגישות');
    close.textContent = '✕';
    close.style.cssText = 'position:absolute;inset-inline-end:14px;top:14px;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:transparent;color:#EAF0FA;font-size:15px;cursor:pointer;';
    close.addEventListener('click', function () { setOpen(false); });

    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    btn = document.createElement('button');
    btn.id = 'dh-a11y-btn';
    btn.type = 'button';
    btn.setAttribute('data-a11y-open', '');
    btn.setAttribute('aria-label', 'פתח תפריט נגישות');
    btn.setAttribute('aria-expanded', 'false');
    btn.style.cssText = 'position:fixed;z-index:70;left:18px;bottom:calc(18px + env(safe-area-inset-bottom));display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,122,168,.6);background:#0A1020;color:#FF7AA8;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.4);transition:background-color .2s, transform .2s;';
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.4" r="1.7"></circle><path d="M4.5 8.2c2.4.8 4.9 1.2 7.5 1.2s5.1-.4 7.5-1.2"></path><path d="M12 9.4v5m0 0-2.6 6.2M12 14.4l2.6 6.2"></path></svg>';
    btn.addEventListener('mouseenter', function () { btn.style.background = 'rgba(255,122,168,.14)'; btn.style.transform = 'translateY(-2px)'; });
    btn.addEventListener('mouseleave', function () { btn.style.background = '#0A1020'; btn.style.transform = 'none'; });
    document.body.appendChild(btn);
    paint();
    panel.appendChild(close);

    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-a11y-open]') : null;
      if (!t) return;
      e.preventDefault();
      setOpen(!open, t);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
      if (e.key === 'Tab' && open) {
        var f = panel.querySelectorAll('button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    window.dhA11y = { open: function () { setOpen(true); }, close: function () { setOpen(false); } };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
