window.SITE_DATA = {
  siteName: "SMILELANDIUM",
  subtitle: "text",
  description:
    "Welcome to SmileLANDIUM. Здесь будут игры, проекты, команда и отдельная announcements / shop зона.",
  avatar: "../assets/profile.png",
  heroLogo: "../assets/logo.png",

  nav: [
    { href: "home.html", label: "HOME", page: "home" },
    { href: "games.html", label: "GAMES", page: "games" },
    { href: "projects.html", label: "PROJECTS", page: "projects" },
    { href: "announcements.html", label: "STORE", page: "announcements" },
    { href: "team.html", label: "TEAM", page: "team" }
  ],

  social: [
    { href: "#", label: "Roblox" },
    { href: "#", label: "Telegram" }
  ],

  announcementsIndex: "../announcements/index.json",

  shop: [
    {
      title: "Smile Shirt",
      text: "Basic item for the shop.",
      price: "100 R$",
      image: "../assets/shop-1.png"
    },
    {
      title: "Smile Cap",
      text: "Secondary cosmetic item.",
      price: "150 R$",
      image: "../assets/shop-2.png"
    }
  ],

  games: [
    {
      title: "ChAOTIC BATTLеz",
      text: "Arena game with fast combat and chaotic pacing.",
      image: "../assets/game-chaotic-battlez.png",
      status: "PLAY"
    },
    {
      title: "Astral Ground",
      text: "Atmospheric game with a lighter visual style.",
      image: "../assets/game-astral-ground.png",
      status: "PLAY"
    }
  ],

  projects: [
    {
      title: "Project One",
      text: "Main public project page with active updates.",
      image: "../assets/project-1.png",
      status: "ACTIVE"
    },
    {
      title: "Project Two",
      text: "Experimental project or prototype section.",
      image: "../assets/project-2.png",
      status: "WIP"
    }
  ],

  team: [
    {
      title: "Sssmmilles",
      text: "Owner / Founder",
      image: "../assets/team-1.png",
      status: "LEAD"
    },
    {
      title: "Member",
      text: "Developer / Designer",
      image: "../assets/team-2.png",
      status: "TEAM"
    }
  ]
};