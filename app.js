const page = document.body.dataset.page;
const app = document.getElementById("app");

function topbar() {
  return `
    <div class="page-topbar">
      <img src="../assets/Smilelandium.png" class="logo">
      <a class="github-btn" href="https://github.com/Smilelandium/Smilelandium.Github.io" target="_blank">
        <svg viewBox="0 0 16 16" width="24" fill="white">
          <path d="M8 0C3.58 0 0 3.58 0 8..."></path>
        </svg>
      </a>
    </div>
  `;
}

function left() {
  return `
    <div class="panel">
      <div class="profile-card">
        <img class="avatar" src="../assets/profile.png">

        <div class="quick-links">
          <div class="small-btn">Roblox</div>
          <div class="small-btn">Telegram</div>
        </div>

        <div class="discord-btn">Discord</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">ANNOUNCEMENTS</div>
      <div id="ann"></div>
    </div>
  `;
}

function nav() {
  return `
    <div class="panel">
      <div class="panel-head">NAVIGATION</div>
      ${DATA.nav.map(n => `<a class="nav-btn" href="${n.href}">${n.label}</a>`).join("")}
    </div>
  `;
}

function cards(arr) {
  return `
    <div class="grid">
      ${arr.map(i => `
        <div class="card">
          <div class="card-media"></div>
          <div class="card-body">${i.title}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function content() {
  if (page === "games") return cards(DATA.games);
  if (page === "projects") return cards(DATA.projects);
  if (page === "team") return cards(DATA.team);
  if (page === "announcements") return `<div id="ann-main"></div>`;
  return cards(DATA.games);
}

app.innerHTML = `
  ${topbar()}
  <div class="layout">
    <div>${left()}</div>
    <div class="panel">${content()}</div>
    <div>${nav()}</div>
  </div>
`;

async function loadAnn() {
  const res = await fetch("../announcements/index.json");
  const data = await res.json();

  document.getElementById("ann").innerHTML =
    data.map(a => `<div class="announcement-item">${a.title}</div>`).join("");
}

loadAnn();