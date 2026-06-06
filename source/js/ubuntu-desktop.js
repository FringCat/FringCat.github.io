(function () {
  const ANIM_MS = 280;
  const ICON = '/images/ubuntu';

  /* Yaru 48px icons — ubuntu/yaru icons/Yaru/48x48 */
  const ICONS = {
    folder: `${ICON}/folder.png`,
    archive: `${ICON}/folder-documents.png`,
    desktop: `${ICON}/user-desktop.png`,
    file: `${ICON}/text-x-generic.png`,
    about: `${ICON}/help-about.png`,
    nautilus: `${ICON}/nautilus.png`,
    github: `${ICON}/folder-remote.png`,
  };

  const OVERVIEW_APPS = [
    { label: '桌面', icon: ICONS.desktop, href: '/' },
    { label: '所有文章', icon: ICONS.nautilus, action: 'all-posts' },
    { label: '归档', icon: ICONS.archive, href: '/archives/' },
    { label: '分类', icon: ICONS.folder, href: '/categories/' },
    { label: '标签', icon: ICONS.folder, href: '/tags/' },
    { label: '关于', icon: ICONS.about, href: '/about/' },
  ];

  function isHomePage() {
    const p = location.pathname.replace(/index\.html$/, '');
    return p === '/' || /^\/page\/\d+\/?$/.test(p);
  }

  function normalizePath(path) {
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
  }

  function imgIcon(src, alt) {
    return `<img src="${src}" alt="${alt}" width="48" height="48" loading="lazy" draggable="false">`;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function animateClose(el, closingClass, onDone) {
    if (!el || prefersReducedMotion()) {
      onDone();
      return;
    }
    el.classList.add(closingClass);
    const done = () => {
      el.removeEventListener('animationend', done);
      onDone();
    };
    el.addEventListener('animationend', done);
    setTimeout(done, ANIM_MS + 80);
  }

  function closeFileManager() {
    const overlay = document.getElementById('ubuntu-fm-overlay');
    if (!overlay?.classList.contains('is-open')) return;
    overlay.classList.add('is-closing');
    const finish = () => overlay.classList.remove('is-open', 'is-closing');
    if (prefersReducedMotion()) finish();
    else setTimeout(finish, ANIM_MS);
  }

  function closeOverview() {
    document.getElementById('ubuntu-overview')?.classList.remove('is-open');
    document.body.classList.remove('ubuntu-overview-open');
  }

  function openOverview() {
    document.getElementById('ubuntu-overview')?.classList.add('is-open');
    document.body.classList.add('ubuntu-overview-open');
    document.getElementById('ubuntu-overview-search')?.focus();
  }

  function launchIcon(icon, action) {
    if (!icon) {
      action();
      return;
    }
    icon.classList.add('is-launching');
    setTimeout(action, prefersReducedMotion() ? 0 : 220);
  }

  function ensureShell() {
    if (!document.getElementById('ubuntu-panel')) {
      const panel = document.createElement('header');
      panel.id = 'ubuntu-panel';
      panel.className = 'ubuntu-panel is-entering';
      panel.innerHTML = `
        <div class="ubuntu-panel-left">
          <button type="button" class="ubuntu-activities" id="ubuntu-activities-btn" aria-expanded="false" aria-controls="ubuntu-overview">
            <span class="ubuntu-activities-dots" aria-hidden="true">
              <span class="ubuntu-workspace-dot"></span>
              <span class="ubuntu-workspace-dot"></span>
              <span class="ubuntu-workspace-dot"></span>
            </span>
            <span class="ubuntu-activities-label">活动</span>
          </button>
        </div>
        <div class="ubuntu-panel-center">
          <button type="button" class="ubuntu-panel-clock" id="ubuntu-clock" title="时钟"></button>
        </div>
        <div class="ubuntu-panel-right">
          <a class="ubuntu-panel-status" href="/archives/" title="归档">${imgIcon(ICONS.archive, '归档')}</a>
          <a class="ubuntu-panel-status" href="/about/" title="关于">${imgIcon(ICONS.about, '关于')}</a>
          <button type="button" class="ubuntu-panel-status ubuntu-theme-btn" id="ubuntu-theme-btn" title="切换主题">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 0 1 0 11V2.5z"/></svg>
          </button>
        </div>`;
      document.body.prepend(panel);

      const overview = document.createElement('div');
      overview.id = 'ubuntu-overview';
      overview.className = 'ubuntu-overview';
      overview.innerHTML = `
        <div class="ubuntu-overview-inner">
          <div class="ubuntu-overview-search-wrap">
            <svg class="ubuntu-overview-search-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M11.2 10.4l3.2 3.2-1.2 1.2-3.2-3.2a5 5 0 1 1 1.2-1.2zM6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
            <input type="search" id="ubuntu-overview-search" class="ubuntu-overview-search" placeholder="输入以搜索…" autocomplete="off">
          </div>
          <div class="ubuntu-overview-workspaces" aria-label="工作区">
            <div class="ubuntu-workspace-thumb is-current"><span>博客桌面</span></div>
            <div class="ubuntu-workspace-thumb"><span>归档</span></div>
          </div>
          <div class="ubuntu-overview-apps" id="ubuntu-overview-apps"></div>
        </div>`;
      document.body.appendChild(overview);

      const apps = document.getElementById('ubuntu-overview-apps');
      OVERVIEW_APPS.forEach((app) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'ubuntu-overview-app';
        el.innerHTML = `${imgIcon(app.icon, app.label)}<span>${app.label}</span>`;
        el.addEventListener('click', async () => {
          closeOverview();
          if (app.href) {
            location.href = app.href;
          } else if (app.action === 'all-posts') {
            const data = await fetchPosts();
            openFileManager('所有文章', '主页 › 博客 › 文章', data.posts);
          }
        });
        apps.appendChild(el);
      });

      document.getElementById('ubuntu-activities-btn').addEventListener('click', () => {
        const open = overview.classList.toggle('is-open');
        document.body.classList.toggle('ubuntu-overview-open', open);
        document.getElementById('ubuntu-activities-btn').setAttribute('aria-expanded', open);
        if (open) document.getElementById('ubuntu-overview-search')?.focus();
      });

      document.getElementById('ubuntu-theme-btn').addEventListener('click', () => {
        document.querySelector('.tool-dark-light-toggle')?.click();
      });

      overview.addEventListener('click', (e) => {
        if (e.target === overview) closeOverview();
      });

      document.getElementById('ubuntu-overview-search')?.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.ubuntu-overview-app').forEach((btn) => {
          const label = btn.querySelector('span')?.textContent?.toLowerCase() || '';
          btn.style.display = !q || label.includes(q) ? '' : 'none';
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeOverview();
          closeFileManager();
        }
      });
    }

    if (!document.getElementById('ubuntu-dock')) {
      const dock = document.createElement('nav');
      dock.id = 'ubuntu-dock';
      dock.className = 'ubuntu-dock is-entering';
      dock.setAttribute('aria-label', 'Dock');
      dock.innerHTML = `
        <div class="ubuntu-dock-bg" aria-hidden="true"></div>
        <div class="ubuntu-dock-items">
          <a href="/" class="ubuntu-dock-item" data-ubuntu-dock="home" title="桌面">
            <span class="ubuntu-dock-icon">${imgIcon(ICONS.desktop, '桌面')}</span>
            <span class="ubuntu-dock-dot" aria-hidden="true"></span>
          </a>
          <a href="/archives/" class="ubuntu-dock-item" data-ubuntu-dock="archive" title="归档">
            <span class="ubuntu-dock-icon">${imgIcon(ICONS.archive, '归档')}</span>
            <span class="ubuntu-dock-dot" aria-hidden="true"></span>
          </a>
          <a href="/about/" class="ubuntu-dock-item" data-ubuntu-dock="about" title="关于">
            <span class="ubuntu-dock-icon">${imgIcon(ICONS.about, '关于')}</span>
            <span class="ubuntu-dock-dot" aria-hidden="true"></span>
          </a>
          <a href="https://github.com/FringCat" class="ubuntu-dock-item" target="_blank" rel="noopener" title="GitHub">
            <span class="ubuntu-dock-icon">${imgIcon(ICONS.github, 'GitHub')}</span>
            <span class="ubuntu-dock-dot" aria-hidden="true"></span>
          </a>
        </div>`;
      document.body.appendChild(dock);
    }

    if (!document.getElementById('ubuntu-fm-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'ubuntu-fm-overlay';
      overlay.className = 'ubuntu-fm-overlay';
      overlay.innerHTML = `
        <div class="ubuntu-fm-window" role="dialog" aria-modal="true">
          <header class="ubuntu-window-header ubuntu-headerbar">
            <div class="ubuntu-window-controls">
              <button type="button" class="titlebutton close" data-ubuntu-fm-close aria-label="关闭"></button>
              <button type="button" class="titlebutton maximize" data-ubuntu-fm-close aria-label="最大化"></button>
              <button type="button" class="titlebutton minimize" data-ubuntu-fm-close aria-label="最小化"></button>
            </div>
            <div class="ubuntu-window-title" id="ubuntu-fm-title">文件</div>
            <div class="ubuntu-window-spacer" aria-hidden="true"></div>
          </header>
          <div class="ubuntu-fm-toolbar">
            <span class="ubuntu-fm-toolbar-icon">${imgIcon(ICONS.nautilus, '')}</span>
            <nav class="ubuntu-fm-path" id="ubuntu-fm-path" aria-label="路径"></nav>
          </div>
          <div class="ubuntu-fm-list" id="ubuntu-fm-list" role="list"></div>
        </div>`;
      document.body.appendChild(overlay);
      overlay.querySelectorAll('[data-ubuntu-fm-close]').forEach((btn) => {
        btn.addEventListener('click', closeFileManager);
      });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeFileManager();
      });
    }
  }

  function updateClock() {
    const el = document.getElementById('ubuntu-clock');
    if (!el) return;
    const now = new Date();
    const wd = now.toLocaleDateString('zh-CN', { weekday: 'short' });
    const d = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    const t = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    el.textContent = `${wd} ${d} ${t}`;
  }

  function updateDockActive() {
    const path = location.pathname;
    document.querySelectorAll('.ubuntu-dock-item[data-ubuntu-dock]').forEach((a) => {
      const active = a.getAttribute('href') === path || (a.dataset.ubuntuDock === 'home' && isHomePage());
      a.classList.toggle('is-active', active);
    });
  }

  function createIcon(label, iconSrc, onClick, href) {
    const item = document.createElement('div');
    item.className = 'ubuntu-desktop-icon';
    item.innerHTML = `${imgIcon(iconSrc, label)}<span>${label}</span>`;
    const select = () => {
      document.querySelectorAll('.ubuntu-desktop-icon').forEach((el) => el.classList.remove('is-selected'));
      item.classList.add('is-selected');
    };
    if (href) {
      item.addEventListener('dblclick', () => launchIcon(item, () => { location.href = href; }));
      item.addEventListener('click', select);
    } else if (onClick) {
      item.addEventListener('dblclick', () => launchIcon(item, onClick));
      item.addEventListener('click', select);
    }
    return item;
  }

  function animateDesktopIcons() {
    document.querySelectorAll('.ubuntu-desktop-icon').forEach((el, i) => {
      el.style.setProperty('--icon-i', i);
      el.classList.remove('is-entering');
      void el.offsetWidth;
      el.classList.add('is-entering');
    });
  }

  function openFileManager(title, pathLabel, items) {
    const overlay = document.getElementById('ubuntu-fm-overlay');
    document.getElementById('ubuntu-fm-title').textContent = title;
    const pathEl = document.getElementById('ubuntu-fm-path');
    pathEl.innerHTML = pathLabel.split(' › ').map((part, i, arr) => {
      const sep = i < arr.length - 1 ? '<span class="ubuntu-fm-sep"> › </span>' : '';
      return `<span class="ubuntu-fm-crumb">${part}</span>${sep}`;
    }).join('');
    const list = document.getElementById('ubuntu-fm-list');
    list.innerHTML = '';
    items.forEach((item, i) => {
      const row = document.createElement('a');
      row.className = 'ubuntu-fm-item';
      row.setAttribute('role', 'listitem');
      row.style.setProperty('--item-i', i);
      row.href = normalizePath(item.path);
      row.innerHTML = `${imgIcon(ICONS.file, item.title)}<span class="ubuntu-fm-name">${item.title}</span><span class="ubuntu-fm-meta">${item.date || ''}</span>`;
      list.appendChild(row);
    });
    overlay.classList.remove('is-closing');
    overlay.classList.add('is-open');
  }

  async function renderDesktop() {
    let desktop = document.getElementById('ubuntu-desktop');
    if (!desktop) {
      desktop = document.createElement('section');
      desktop.id = 'ubuntu-desktop';
      desktop.className = 'ubuntu-desktop';
      const grid = document.createElement('div');
      grid.className = 'ubuntu-desktop-grid';
      grid.id = 'ubuntu-desktop-grid';
      desktop.appendChild(grid);
      document.querySelector('.main-content')?.prepend(desktop);
    }

    const grid = document.getElementById('ubuntu-desktop-grid');
    grid.innerHTML = '';

    grid.appendChild(createIcon('所有文章', ICONS.nautilus, async () => {
      const data = await fetchPosts();
      openFileManager('所有文章', '主页 › 博客 › 文章', data.posts);
    }, null));

    grid.appendChild(createIcon('归档', ICONS.archive, null, '/archives/'));
    grid.appendChild(createIcon('关于', ICONS.about, null, '/about/'));

    try {
      const data = await fetchPosts();
      data.categories.forEach((cat) => {
        grid.appendChild(createIcon(cat.name, ICONS.folder, () => {
          openFileManager(cat.name, `主页 › 博客 › ${cat.name}`, cat.posts);
        }));
      });
      data.posts.forEach((post) => {
        grid.appendChild(createIcon(post.title, ICONS.folder, null, normalizePath(post.path)));
      });
    } catch (err) {
      console.warn('[ubuntu-desktop] 无法加载文章数据', err);
    }

    animateDesktopIcons();
  }

  let postsCache = null;
  async function fetchPosts() {
    if (postsCache) return postsCache;
    postsCache = await (await fetch('/ubuntu-posts.json')).json();
    return postsCache;
  }

  function wrapContentWindow() {
    const main = document.querySelector('.main-content');
    if (!main || main.querySelector('.ubuntu-page-window') || isHomePage()) return;

    const title = document.title.replace(/\s*\|.*$/, '').trim() || '窗口';
    const wrapper = document.createElement('div');
    wrapper.className = 'ubuntu-page-window';
    wrapper.innerHTML = `
      <header class="ubuntu-window-header ubuntu-headerbar">
        <div class="ubuntu-window-controls">
          <button type="button" class="titlebutton close" data-ubuntu-win-close aria-label="关闭"></button>
          <button type="button" class="titlebutton maximize" data-ubuntu-win-close aria-label="最大化"></button>
          <button type="button" class="titlebutton minimize" data-ubuntu-win-close aria-label="最小化"></button>
        </div>
        <div class="ubuntu-window-title">${title}</div>
        <div class="ubuntu-window-spacer" aria-hidden="true"></div>
      </header>
      <div class="ubuntu-window-body"></div>`;

    const body = wrapper.querySelector('.ubuntu-window-body');
    while (main.firstChild) {
      if (main.firstChild.id === 'ubuntu-desktop') {
        main.removeChild(main.firstChild);
        continue;
      }
      body.appendChild(main.firstChild);
    }
    main.appendChild(wrapper);
    requestAnimationFrame(() => wrapper.classList.add('is-opening'));

    wrapper.querySelectorAll('[data-ubuntu-win-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        animateClose(wrapper, 'is-closing', () => { location.href = '/'; });
      });
    });
  }

  function cleanupDesktop() {
    document.getElementById('ubuntu-desktop')?.remove();
    postsCache = null;
  }

  function init() {
    document.body.classList.add('ubuntu-ui', 'ubuntu-boot');
    ensureShell();
    updateClock();
    updateDockActive();
    closeOverview();

    if (isHomePage()) {
      cleanupDesktop();
      renderDesktop();
    } else {
      cleanupDesktop();
      wrapContentWindow();
    }
  }

  function hookSwup() {
    const attach = () => {
      if (!window.swup?.hooks) return false;
      window.swup.hooks.on('page:view', () => requestAnimationFrame(init));
      return true;
    };
    if (!attach()) {
      window.addEventListener('redefine:swup:ready', () => attach(), { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  hookSwup();
  setInterval(updateClock, 30000);
})();
