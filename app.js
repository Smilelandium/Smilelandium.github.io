(function () {
  const DATA = window.SITE_DATA;

  function asset(path) {
    return new URL(path, window.location.href).href;
  }

  function safeImageTag(src, alt) {
    if (!src) {
      return `<div class="card-media"><div class="placeholder">IMAGE</div></div>`;
    }

    const resolved = asset(src);

    return `
      <div class="card-media">
        <img src="${resolved}" alt="${alt}" onerror="this.remove();this.parentElement.innerHTML='<div class=&quot;placeholder&quot;>IMAGE</div>'">
      </div>
    `;
  }

  function renderNav(activePage) {
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

  function renderLeftColumn() {
    return `
      <div class="panel">
        <div class="panel-body">
          <div class="profile-card">
            <img class="avatar" src="${asset(DATA.avatar)}" alt="Profile" onerror="this.style.display='none'">
            <div>
              <div class="panel-head" style="margin:0 0 10px; border-radius: 10px;">Description</div>
              <div class="description-box">${DATA.description}</div>
            </div>
          </div>

          <div class="quick-links">
            ${DATA.social.map(link => `<a class="small-btn" href="${link.href}">${link.label}</a>`).join("")}
          </div>

          <a class="discord-btn" href="#">Discord</a>
        </div>
      </div>
    `;
  }

  function renderAnnouncementsPreview(items) {
    return `
      <div class="panel">
        <div class="panel-head">Announcements</div>
        <div class="panel-body">
          <div class="scroll-box">
            ${items.map(item => `
              <div class="announcement-item">
                <div class="announcement-title">${escapeHtml(item.title || "Announcement")}</div>
                <p class="announcement-text">${escapeHtml(item.text || "")}</p>
                <div class="announcement-date">${escapeHtml(item.date || "")}</div>
              </div>
            `).join("")}
          </div>
        </div>
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
                ${item.price ? `<span>${escapeHtml(item.price)}</span>` : `<span></span>`}
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderHome() {
    return `
      <section class="hero">
        <img class="hero-logo" src="${asset(DATA.heroLogo)}" alt="${DATA.siteName}" onerror="this.style.display='none'">
        <div class="hero-copy">${escapeHtml(DATA.subtitle)}</div>
      </section>

      <div class="section-title">Games</div>
      ${renderCards(DATA.games, "games")}
    `;
  }

  function renderGames() {
    return `
      <div class="section-title">Games</div>
      ${renderCards(DATA.games, "games")}
    `;
  }

  function renderProjects() {
    return `
      <div class="section-title">Projects</div>
      ${renderCards(DATA.projects, "projects")}
    `;
  }

  function renderTeam() {
    return `
      <div class="section-title">Team</div>
      ${renderCards(DATA.team, "team")}
    `;
  }

  function renderAnnouncements() {
    return `
      <div class="section-title">Announcements</div>
      <div id="announcements-list" class="grid" style="grid-template-columns: 1fr;"></div>

      <div class="section-title">Shop</div>
      ${renderCards(DATA.shop, "shop")}
    `;
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
    const escaped = escapeHtml(md);

    return escaped
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/^\- (.*)$/gm, "<li>$1</li>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  }

  async function loadAnnouncements() {
    const listTarget = document.getElementById("announcements-list");
    if (!listTarget) return;

    try {
      const indexRes = await fetch(DATA.announcementsIndex, { cache: "no-store" });
      if (!indexRes.ok) throw new Error("Cannot load announcements/index.json");

      const index = await indexRes.json();

      const blocks = [];
      for (const item of index) {
        const mdRes = await fetch(new URL(item.file, window.location.href).href, { cache: "no-store" });
        if (!mdRes.ok) continue;

        const mdText = await mdRes.text();
        blocks.push(`
          <div class="announcement-item">
            <div class="announcement-title">${escapeHtml(item.title || "Announcement")}</div>
            <div class="announcement-date">${escapeHtml(item.date || "")}</div>
            <div class="markdown"><p>${markdownToHtml(mdText)}</p></div>
          </div>
        `);
      }

      listTarget.innerHTML = blocks.join("") || `
        <div class="announcement-item">
          <div class="announcement-title">No announcements</div>
          <p class="announcement-text">Add .md files and register them in announcements/index.json.</p>
        </div>
      `;
    } catch (err) {
      listTarget.innerHTML = `
        <div class="announcement-item">
          <div class="announcement-title">Error</div>
          <p class="announcement-text">Failed to load announcements.</p>
        </div>
      `;
      console.error(err);
    }
  }

  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");

  app.innerHTML = `
    <header class="page-topbar">
      <div class="brand">
        <img src="${asset("../assets/logo.png")}" alt="Logo" onerror="this.style.display='none'">
        <div class="title">
          <span class="smile">Smile</span><span class="landium">LANDIUM</span><span class="dot">.GITHUB.IO</span>
        </div>
      </div>
      <a class="github-btn" href="#" aria-label="GitHub">
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

    <div class="layout">
      <aside class="left-column sections-stack">
        ${renderLeftColumn()}
        ${page === "announcements" ? renderAnnouncementsPreview([]) : renderAnnouncementsPreview([])}
      </aside>

      <main class="panel content-panel">
        <div class="panel-head" style="font-size: 20px;">${page.charAt(0).toUpperCase() + page.slice(1)}</div>
        <div class="panel-body">
          ${
            page === "home" ? renderHome() :
            page === "games" ? renderGames() :
            page === "projects" ? renderProjects() :
            page === "team" ? renderTeam() :
            page === "announcements" ? renderAnnouncements() :
            renderHome()
          }
        </div>
      </main>

      <aside class="right-column">
        ${renderNav(page)}
        <div class="panel" style="margin-top: 12px;">
          <div class="panel-head">TEAM</div>
          <div class="panel-body">
            <a class="shop-btn" href="team.html">TEAM</a>
          </div>
        </div>
      </aside>
    </div>
  `;

  if (page === "announcements") {
    loadAnnouncements();
  }
})();