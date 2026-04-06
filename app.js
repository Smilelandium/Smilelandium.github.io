(function () {
  const DATA = window.SITE_DATA;
  let announcementsCache = null;

  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");

  function asset(path) {
    return new URL(path, window.location.href).href;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function markdownToHtml(md) {
    const lines = String(md).replace(/\r/g, "").split("\n");
    let html = "";
    let inList = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        continue;
      }

      if (/^#{1,3}\s+/.test(line)) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        const level = line.match(/^#+/)[0].length;
        const text = escapeHtml(line.slice(level).trim());
        html += `<h${level}>${text}</h${level}>`;
        continue;
      }

      if (/^\-\s+/.test(line)) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${escapeHtml(line.slice(2).trim())}</li>`;
        continue;
      }

      if (inList) {
        html += "</ul>";
        inList = false;
      }

      html += `<p>${escapeHtml(line)}</p>`;
    }

    if (inList) html += "</ul>";
    return html;
  }

  function safeImageTag(src, alt) {
    const resolved = asset(src || "");
    return `
      <div class="card-media">
        <img src="${resolved}" alt="${escapeHtml(alt)}"
          onerror="this.remove();this.parentElement.innerHTML='<div class=&quot;placeholder&quot;>IMAGE</div>'">
      </div>
    `;
  }

  function renderCards(items, type) {
    return `
      <div class="grid ${type}">
        ${items.map(item => `
          <article class="card">
            ${safeImageTag(item.image, item.title)}
            <div class="card-body">
              <h3 class="card-title">${escapeHtml(item.title)}</h3>
              <p class="card-text">${escapeHtml(item.text)}</p>
              <div class="meta-row">
                <span class="status-pill">${escapeHtml(item.status || "")}</span>
                <span></span>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderTopBar() {
    return `
      <header class="page-topbar">
        <div class="brand">
          <img class="logo" src="${asset("../assets/images/Smilelandium.png")}" alt="SMILELANDIUM"
               onerror="this.style.display='none'">

          <div class="brand-text">
            <div class="brand-version">${escapeHtml(DATA.version)}</div>
            <div class="brand-sub">.GITHUB.IO</div>
          </div>
        </div>

        <a class="github-btn"
           href="https://github.com/Smilelandium/Smilelandium.Github.io"
           target="_blank"
           rel="noreferrer"
           aria-label="GitHub repository">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
            -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
            -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82
            .64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
            .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19
            0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
          </svg>
        </a>
      </header>
    `;
  }

  function renderLeftColumn() {
    return `
      <div class="panel">
        <div class="panel-body">
          <div class="profile-card">
            <div class="avatar-wrap">
              <img class="avatar" src="${asset(DATA.avatar)}" alt="Profile"
                   onerror="this.style.display='none'">
            </div>

            <div class="quick-links">
              <a class="small-btn" href="https://www.roblox.com/communities/35162017">Roblox</a>
              <a class="small-btn" href="https://t.me/Smilelandium">Telegram</a>
            </div>

            <a class="discord-btn" href="https://discord.gg/4tZgcEUP8T">Discord</a>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">ANNOUNCEMENTS</div>
        <div class="panel-body">
          <div id="sidebar-announcements" class="scroll-box">
            <div class="announcement-item">
              <div class="announcement-title">Loading...</div>
              <p class="announcement-text">Announcements are loading.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRightNav(activePage) {
    return `
      <div class="panel">
        <div class="panel-head">NAVIGATION</div>
        <div class="panel-body right-nav">
          ${DATA.nav.map(item => `
            <a class="nav-btn ${activePage === item.page ? "active" : ""}" href="${item.href}">
              ${item.label}
            </a>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderHome() {
    return `
      <section class="hero">
        <img class="hero-logo" src="${asset(DATA.heroLogo)}" alt="SMILELANDIUM"
             onerror="this.style.display='none'">
        <div class="hero-copy">${escapeHtml(DATA.subtitle)}</div>
      </section>
      <div class="section-title">GAMES</div>
    `;
  }

  function renderGames() {
    return `
      ${renderCards(DATA.games, "games")}
    `;
  }

  function renderProjects() {
    return `
      ${renderCards(DATA.projects, "projects")}
    `;
  }

  function renderTeam() {
    return `
      ${renderCards(DATA.team, "team")}
    `;
  }

  async function fetchAnnouncements() {
    if (announcementsCache) return announcementsCache;

    const indexUrl = new URL(DATA.announcementsIndex, window.location.href).href;
    const indexRes = await fetch(indexUrl, { cache: "no-store" });

    if (!indexRes.ok) {
      throw new Error("Cannot load announcements index");
    }

    const index = await indexRes.json();
    const baseFolder = indexUrl.slice(0, indexUrl.lastIndexOf("/") + 1);

    const items = [];
    for (const item of index) {
      const mdUrl = new URL(item.file, baseFolder).href;
      const mdRes = await fetch(mdUrl, { cache: "no-store" });
      if (!mdRes.ok) continue;

      const mdText = await mdRes.text();
      items.push({
        title: item.title || "Announcement",
        date: item.date || "",
        html: markdownToHtml(mdText)
      });
    }

    announcementsCache = items;
    return items;
  }

  async function loadSidebarAnnouncements() {
    const box = document.getElementById("sidebar-announcements");
    if (!box) return;

    try {
      const items = await fetchAnnouncements();

      box.innerHTML = items.length
        ? items.map(item => `
            <div class="announcement-item">
              <div class="announcement-title">${escapeHtml(item.title)}</div>
              <div class="announcement-date">${escapeHtml(item.date)}</div>
            </div>
          `).join("")
        : `
          <div class="announcement-item">
            <div class="announcement-title">No announcements</div>
            <p class="announcement-text">Add .md files in announcements/ and register them in index.json.</p>
          </div>
        `;
    } catch (err) {
      box.innerHTML = `
        <div class="announcement-item">
          <div class="announcement-title">Error</div>
          <p class="announcement-text">Failed to load announcements.</p>
        </div>
      `;
      console.error(err);
    }
  }

  const pageContent = page === "games"
    ? renderGames()
    : page === "projects"
    ? renderProjects()
    : page === "team"
    ? renderTeam()
    : renderHome();

  app.innerHTML = `
    ${renderTopBar()}
    <div class="layout">
      <aside class="left-column sections-stack">
        ${renderLeftColumn()}
      </aside>

      <main class="panel content-panel">
        <div class="panel-head">${page.toUpperCase()}</div>
        <div class="panel-body">
          ${pageContent}
        </div>
      </main>

      <aside class="right-column">
        ${renderRightNav(page)}
      </aside>
    </div>
  `;

  loadSidebarAnnouncements();
})();