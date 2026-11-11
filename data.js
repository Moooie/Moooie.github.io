/**
 * ===================================================================
 * DATA PORTOFOLIO DINAMIS (data.js)
 * Anda dapat dengan mudah mengubah atau menambah data di file ini
 * tanpa perlu menyentuh kode HTML!
 * ===================================================================
 */

const portfolioData = {
  // Informasi Profil & Hero
  profile: {
    name: "Ari Satriya",
    brandName: "AriDev",
    logoSymbol: "</>",
    typingRoles: [
      "Frontend Developer",
      "UI/UX Enthusiast",
      "Modern Web Specialist",
      "Creative Problem Solver"
    ],
    heroSubtitle: "Membangun pengalaman web digital yang elegan, interaktif, responsif, dan berkinerja tinggi dengan standar web modern.",
    availability: "Tersedia untuk Pekerjaan Lepas & Kolaborasi",
    statusOnline: true,
    location: "Jakarta / Surabaya, Indonesia",
    email: "arisatriya@example.com",
    whatsapp: "+62 812-3456-7890",
    whatsappUrl: "https://wa.me/6281234567890",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    aboutImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    experienceYears: 3,
    cvDownloadUrl: "#",
    socials: [
      { name: "GitHub", icon: "fa-brands fa-github", url: "https://github.com" },
      { name: "LinkedIn", icon: "fa-brands fa-linkedin-in", url: "https://linkedin.com" },
      { name: "Instagram", icon: "fa-brands fa-instagram", url: "https://instagram.com" },
      { name: "X / Twitter", icon: "fa-brands fa-x-twitter", url: "https://twitter.com" }
    ]
  },

  // Statistik Pencapaian (Akan dianimasikan counter dari 0)
  stats: [
    { targetNumber: 25, suffix: "+", label: "Proyek Selesai", icon: "fa-solid fa-laptop-code" },
    { targetNumber: 15, suffix: "+", label: "Klien Puas", icon: "fa-regular fa-face-smile" },
    { targetNumber: 99, suffix: "%", label: "Ketepatan Waktu", icon: "fa-regular fa-clock" },
    { targetNumber: 100, suffix: "%", label: "Desain Responsif", icon: "fa-solid fa-mobile-screen-button" }
  ],

  // Layanan / Services yang Ditawarkan
  services: [
    {
      icon: "fa-solid fa-code",
      title: "Pengembangan Frontend",
      description: "Membuat antarmuka web modern dengan HTML5 semantik, CSS3 responsif, JavaScript mutakhir, dan framework modern seperti React."
    },
    {
      icon: "fa-solid fa-palette",
      title: "UI/UX & Desain Web",
      description: "Merancang wireframe, mockup, dan prototipe interaktif di Figma yang fokus pada kemudahan navigasi dan kepuasan pengguna."
    },
    {
      icon: "fa-solid fa-gauge-high",
      title: "Optimasi Kecepatan & SEO",
      description: "Memastikan website memiliki performa cepat, skor Google PageSpeed tinggi, dan ramah terhadap mesin pencari."
    },
    {
      icon: "fa-solid fa-mobile-screen",
      title: "Desain Mobile-First",
      description: "Tampilan website yang presisi dan nyaman diakses di smartphone, tablet, laptop, hingga layar monitor lebar."
    }
  ],

  // Keahlian Teknis (Skill Categories)
  skills: [
    {
      category: "Frontend Development",
      icon: "fa-solid fa-desktop",
      tags: ["HTML5", "CSS3 / SCSS", "JavaScript (ES6+)", "React.js", "Tailwind CSS", "Bootstrap"],
      bars: [
        { name: "HTML5 & Semantic Web", level: 95 },
        { name: "CSS3, Flexbox & Grid", level: 90 },
        { name: "Modern JavaScript (ES6+)", level: 85 },
        { name: "React.js & State Management", level: 80 }
      ]
    },
    {
      category: "UI/UX & Desain Grafis",
      icon: "fa-solid fa-pen-nib",
      tags: ["Figma", "Wireframing", "Responsive UI", "Design Systems", "Prototyping"],
      bars: [
        { name: "Figma & Wireframing", level: 88 },
        { name: "UI/UX Architecture", level: 82 },
        { name: "Mobile Responsiveness", level: 95 },
        { name: "Design System Guidelines", level: 85 }
      ]
    },
    {
      category: "Workflow & Alat Pendukung",
      icon: "fa-solid fa-toolbox",
      tags: ["Git & GitHub", "NPM / Vite", "REST APIs", "Vercel / Netlify", "Web Performance"],
      bars: [
        { name: "Git Version Control", level: 88 },
        { name: "Performance & SEO Optimization", level: 85 },
        { name: "Deployment & CI/CD Basics", level: 90 },
        { name: "API Integration & Async JS", level: 84 }
      ]
    }
  ],

  // Proyek Portofolio Dinamis (Mendukung filter, pencarian teks, dan modal detail)
  projects: [
    {
      id: "proj-backrooms",
      title: "Escape The Backrooms: Liminal Horror Co-op (3D)",
      category: "fullstack",
      categoryLabel: "3D Survival Horror Co-op",
      year: "2024",
      client: "Game Development Project",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Game horor psikologis 3D Backrooms Level 0 dengan persembunyian loker & tahan napas, entitas The Bacteria, RPG upgrade, serta WebRTC P2P Co-op multiplayer.",
      fullDesc: "Game horor liminal 3D First-Person multiplayer berbasis web dengan Three.js dan Web Audio API murni. Menghadirkan labirin Level 0: The Yellow Lobby dengan tekstur wallpaper & karpet lembab prosedural, entitas The Bacteria dengan AI cerdas (Patroli, Investigasi, Pengejaran, dan Mengendus Loker), sistem persembunyian loker dengan tahan napas mekanik tombol Spasi, pohon atribut RPG survivor (Lungs, Mental Fortitude, Stealth, Perception) dengan skill Insting [Q], Langkah Hantu [Z], Umpan Suara [X], serta konektivitas Co-op Multiplayer P2P WebRTC via PeerJS lengkap dengan status pingsan/revive, penanda 3D Ping [V], dan Walkie-Talkie voice chat.",
      tags: ["Three.js", "WebRTC", "PeerJS", "Horor 3D", "Web Audio API", "Co-op P2P"],
      features: [
        "Kontrol 3D First-Person penuh (WASD + Mouse Pointer Lock 360° + Sprint + Crouch) dengan head-bobbing imersif",
        "Suasana Liminal Level 0 otentik: Wallpaper kuning lembab, karpet kusam berair, dan dengung lampu neon 60Hz",
        "Mekanik Bersembunyi di Loker Besi [E] dengan indikator detak jantung dan pengukur menahan napas [Tahan Spasi]",
        "Entitas AI 'The Bacteria' dengan sensor pandangan garis pandang (LOS), deteksi suara derap langkah, dan investigasi loker",
        "Pohon Peningkatan Atribut RPG via [TAB]: Kapasitas Paru-paru, Ketahanan Mental, Langkah Hening, dan Persepsi Baterai",
        "3 Skill Aktif Survivor: [Q] Insting (X-Ray radar entitas), [Z] Langkah Hantu (lari senyap tanpa stamina), [X] Umpan Koin Suara",
        "Manajemen Logistik: Baterai Senter [1], Air Almond Pemulih Sanity [2], dan Suntikan Adrenalin [3]",
        "Multiplayer P2P Co-op WebRTC (PeerJS) dengan Room Code: Model Hazmat Suit 3D, sinkronisasi posisi & senter, sistem Downed & Revive 3 detik, serta Walkie-Talkie Voice Chat radio",
        "Tujuan Akhir Meloloskan Diri: Kumpulkan 3 Kaset Rekaman & 1 Keycard untuk membuka pintu darurat No-Clip"
      ],
      demoUrl: "backrooms.html",
      githubUrl: "https://github.com/example/escape-the-backrooms-3d"
    },
    {
      id: "proj-racing",
      title: "Sunset Drift Masters (3D Car Racing Game)",
      category: "fullstack",
      categoryLabel: "3D Arcade Racing Game",
      year: "2024",
      client: "Game Development Project",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Game balapan mobil 3D arcade berkecepatan tinggi dengan mobil Drift Master, 5 pembalap NPC cerdas, suasana senja keemasan, dan kotak power-up di sirkuit.",
      fullDesc: "Permainan balap mobil 3D dengan Three.js bertema atmosfer senja keemasan (Golden Sunset). Menghadirkan mobil 'Drift Master RX-8' dengan mekanik drifting bersuara decitan ban & asap ban, 5 pembalap AI NPC yang saling bersaing menyalip, kotak power-up misteri di jalanan (Roket Pengejar, Mega Nitro Boost, Tumpahan Oli, Perisai Energi), radar minimap real-time, speedometer digital KM/H, penghitung lap (3 lap), dan sistem audio mesin dinamis via Web Audio API.",
      tags: ["Three.js", "WebGL", "Car Physics", "AI Navigation", "Drifting", "Power-ups"],
      features: [
        "Mobil Pilihan: 'Drift Master RX-8' dengan handling tajam dan akselerasi responsif",
        "5 Lawan Pembalap NPC Cerdas dengan kepribadian unik dan sistem menyalip natural",
        "Suasana Senja Keemasan (Golden Sunset) dengan pencahayaan hangat dan bayangan dramatis",
        "Kotak Power-up di Sirkuit: Roket Pengejar, Mega Nitro, Tumpahan Oli, dan Perisai Energi",
        "Mekanik Drifting di Tikungan dengan jejak ban, partikel asap, dan hadiah Drift Boost",
        "Radar Minimap 2D Real-time melacak posisi semua 6 pembalap di sirkuit",
        "Speedometer Digital (KM/H) & Pengukur Bar Nitro",
        "Sistem Audio Sintetis Lengkap: Deru mesin naik-turun, decitan ban, ledakan roket, dan fanfare kemenangan"
      ],
      demoUrl: "racing.html",
      githubUrl: "https://github.com/example/sunset-drift-masters"
    },
    {
      id: "proj-minecraft",
      title: "Minecraft Web 3D Edition (HTML, CSS, Three.js)",
      category: "fullstack",
      categoryLabel: "3D Voxel Web Game",
      year: "2024",
      client: "Voxel Sandbox Project",
      image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Klon Minecraft 3D voxel otentik di browser dengan menebang pohon, menambang batu/bijih, crafting 2x2 & 3x3, pedang, bow & arrow, inventory 'E', dan monster zombie.",
      fullDesc: "Pengembangan game sandbox voxel 3D 'plek ketiplek' Minecraft berbasis web dengan pustaka Three.js dan tekstur prosedural pixelated 16x16. Memiliki kontrol sudut pandang orang pertama (First-Person), mekanik menebang pohon, menambang batu dan bijih besi/batu bara/berlian, menaruh blok, animasi retakan saat memecah blok, sistem crafting lengkap (resep meja kerja 2x2 dan 3x3), senjata pedang dan busur panah fungsional, slot hotbar 1-9, inventory penuh 27 slot, serta siklus siang/malam dinamis.",
      tags: ["Three.js", "WebGL", "Voxel Engine", "Procedural Textures", "Web Audio API"],
      features: [
        "Kontrol 3D First-Person penuh (WASD + Mouse Look 360° + Jump + Sneak)",
        "Mekanik menebang pohon (Oak Log & Leaves) dan menambang (Batu, Batu Bara, Besi, Berlian)",
        "Animasi retakan progresif saat menambang blok dengan progress bar",
        "Menaruh blok pada sisi kubus (Raycasting normal vector)",
        "Sistem 2 Senjata: Pedang (tebasan serang) dan Busur Panah (tembakan proyektil 3D melengkung)",
        "Inventory GUI otentik tombol 'E' dengan slot 27 item, hotbar 9 slot, dan Crafting Grid 2x2 & 3x3",
        "Resep crafting Minecraft lengkap: Kayu -> Papan -> Tongkat -> Meja Kerja -> Pedang -> Busur -> Panah",
        "Monster Zombie yang mengejar pemain dan Babi ramah penghasil daging",
        "Siklus Siang dan Malam (Matahari dan Bulan bergerak di langit) dengan efek audio sintetis offline"
      ],
      demoUrl: "minecraft.html",
      githubUrl: "https://github.com/example/minecraft-web-3d"
    },
    {
      id: "proj-game",
      title: "Stickman: Shadow Reckoning (2D Action Game)",
      category: "fullstack",
      categoryLabel: "HTML5 Canvas Game",
      year: "2024",
      client: "Game Development Project",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Game aksi RPG platformer stickman 60 FPS dengan jalan cerita bercabang, upgrade atribut, pedang & panah, sistem stamina, serta pertarungan bos.",
      fullDesc: "Permainan aksi 2D berbasis HTML5 Canvas murni tanpa dependensi eksternal. Menghadirkan stickman dengan animasi prosedural, sistem pertempuran 2 senjata (Pedang melee & Busur Panah berkecepatan tinggi), mekanik dodge/dash ber-stamina dengan i-frames, panjat tangga bangunan, serta pohon atribut RPG (HP, Stamina, Damage, Agility).",
      tags: ["HTML5 Canvas", "JavaScript", "Web Audio API", "Physics Engine", "RPG Systems"],
      features: [
        "2 Senjata Aktif: Pedang (tebasan kombo) & Busur Panah (proyektil gravitasi)",
        "Mekanik Dash/Dodge dengan konsumsi stamina & invulnerability frames",
        "Sistem dialog cerita bercabang dengan pilihan taktik berhadiah",
        "Pohon peningkatan atribut karakter: Vitalitas, Stamina, Pedang, Panah, Kelincahan",
        "Level multi-tahap dengan bangunan (tangga & atap), rintangan duri, pendulum pisau, dan pertarungan bos epik",
        "Efek suara sintesis 100% offline via Web Audio API"
      ],
      demoUrl: "game.html",
      githubUrl: "https://github.com/example/stickman-shadow-reckoning"
    },
    {
      id: "proj-1",
      title: "Modern E-Commerce Storefront",
      category: "frontend",
      categoryLabel: "Frontend Web",
      year: "2024",
      client: "Toko Busana Lokal",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Landing page toko online dengan filter produk dinamis, keranjang belanja interaktif, dan animasi mikro.",
      fullDesc: "Platform storefront e-commerce yang dirancang untuk memberikan pengalaman berbelanja instan. Dilengkapi dengan keranjang belanja interaktif berbasis LocalStorage, filter harga dan kategori secara real-time, serta checkout order via WhatsApp otomatis.",
      tags: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
      features: [
        "Filter produk instan tanpa reload halaman",
        "Keranjang belanja interaktif dengan sinkronisasi local storage",
        "Integrasi langsung ke formulir checkout WhatsApp",
        "Animasi mikro responsif pada setiap interaksi"
      ],
      demoUrl: "https://example.com/demo-ecommerce",
      githubUrl: "https://github.com/example/ecommerce-storefront"
    },
    {
      id: "proj-2",
      title: "SaaS Analytics & Admin Dashboard",
      category: "fullstack",
      categoryLabel: "Web App",
      year: "2024",
      client: "Fintech Startup",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Dashboard analitik interaktif dengan visualisasi data grafik real-time, dark mode, dan export data.",
      fullDesc: "Aplikasi dashboard manajemen data perusahaan berbasis web yang menyajikan analitik penjualan, trafik pelanggan, dan grafik performa bulanan secara interaktif dengan opsi export PDF & Excel.",
      tags: ["React", "Chart.js", "Tailwind CSS", "REST API"],
      features: [
        "Visualisasi grafik interaktif dengan Chart.js",
        "Dukungan mode gelap dan terang secara mulus",
        "Export laporan keuangan ke format CSV dan PDF",
        "Sistem autentikasi role pengguna (Admin / Viewer)"
      ],
      demoUrl: "https://example.com/demo-dashboard",
      githubUrl: "https://github.com/example/saas-analytics-dashboard"
    },
    {
      id: "proj-3",
      title: "Fintech Mobile App Concept",
      category: "uiux",
      categoryLabel: "UI/UX Design",
      year: "2023",
      client: "Eksplorasi Pribadi",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Desain antarmuka aplikasi perbankan modern yang fokus pada transfer instan, budgeting, dan keamanan.",
      fullDesc: "Studi kasus perancangan antarmuka pengguna komprehensif untuk aplikasi keuangan digital generasi masa depan. Menggunakan palet warna modern, tata letak kartu intuitif, dan alur transaksi yang meminimalkan friksi pengguna.",
      tags: ["Figma", "UI/UX", "Design System", "Prototyping"],
      features: [
        "Sistem komponen desain modular (Figma Design System)",
        "User flow transfer dana cepat kurang dari 3 langkah",
        "Widget pelacakan anggaran bulanan visual",
        "Prototipe interaktif dengan animasi micro-interactions"
      ],
      demoUrl: "https://figma.com/@example/fintech-concept",
      githubUrl: "https://github.com/example/fintech-case-study"
    },
    {
      id: "proj-4",
      title: "Developer Blog & Tech Hub",
      category: "frontend",
      categoryLabel: "Frontend Web",
      year: "2023",
      client: "Komunitas Koding",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Platform artikel dan dokumentasi ramah SEO dengan pencarian cepat, waktu baca, dan syntax highlighting.",
      fullDesc: "Portal artikel teknologi dan tutorial pemrograman yang dibangun dengan fokus pada kecepatan muat dan keterbacaan tinggi. Memiliki fitur filter tag artikel, perkiraan waktu membaca, serta blok kode pemrograman yang rapi.",
      tags: ["HTML5", "CSS Grid", "JavaScript", "Markdown"],
      features: [
        "Skor Google Lighthouse 98+ untuk SEO & Aksesibilitas",
        "Blok kode rapi dengan fitur 'Salin Kode' sekali klik",
        "Mode baca bebas gangguan (Distraction Free Reader)",
        "Pencarian instan berbasis kata kunci judul dan tag"
      ],
      demoUrl: "https://example.com/demo-devblog",
      githubUrl: "https://github.com/example/dev-blog"
    },
    {
      id: "proj-5",
      title: "Interactive Kanban Task Manager",
      category: "fullstack",
      categoryLabel: "Web App",
      year: "2023",
      client: "Productivity Tool",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Aplikasi papan Kanban drag-and-drop dengan pelacakan status pekerjaan dan sinkronisasi lokal.",
      fullDesc: "Aplikasi manajemen tugas produktivitas tim yang memungkinkan pengguna memindahkan kartu pekerjaan antar kolom (To Do, In Progress, Done) secara mulus dengan dukungan filter prioritas tugas.",
      tags: ["JavaScript", "Drag & Drop API", "CSS3", "LocalStorage"],
      features: [
        "Fitur seret dan lepas (Drag & Drop) kartu tugas",
        "Label prioritas warna (Tinggi, Sedang, Rendah)",
        "Penyimpanan otomatis agar data tidak hilang saat browser ditutup",
        "Pencarian dan penyaringan tugas berdasarkan deadline"
      ],
      demoUrl: "https://example.com/demo-kanban",
      githubUrl: "https://github.com/example/kanban-board"
    },
    {
      id: "proj-6",
      title: "Artisan Coffee House Branding Web",
      category: "uiux",
      categoryLabel: "UI/UX Design",
      year: "2023",
      client: "Cafe Roastery",
      image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Website bertema hangat dan mewah untuk coffee shop, dilengkapi menu digital dan reservasi meja.",
      fullDesc: "Website profil bisnis coffee shop terkemuka yang menonjolkan estetika hangat, aroma kopi, menu digital dinamis dengan estimasi kalori/rasa, serta form reservasi meja online.",
      tags: ["Figma", "HTML5", "CSS Animation", "Responsive"],
      features: [
        "Desain tipografi yang elegan dan bernuansa premium",
        "Menu kopi interaktif dengan tab kategori biji kopi",
        "Sistem form reservasi meja dengan konfirmasi langsung",
        "Peta lokasi interaktif dan integrasi Google Maps"
      ],
      demoUrl: "https://example.com/demo-coffeeshop",
      githubUrl: "https://github.com/example/coffee-house"
    }
  ],

  // Riwayat Pengalaman & Edukasi
  timeline: [
    {
      date: "2023 - Sekarang",
      role: "Lead Frontend Developer",
      company: "Creative Digital Agency",
      description: "Memimpin perancangan arsitektur antarmuka untuk belasan website klien, mengoptimasi performa web hingga 40%, dan mentoring developer junior."
    },
    {
      date: "2021 - 2023",
      role: "Junior Web Developer",
      company: "Tech Startup Nusantara",
      description: "Mengembangkan komponen antarmuka responsif menggunakan HTML, CSS, JavaScript modern, dan berkolaborasi erat dengan tim UI/UX Designer."
    },
    {
      date: "2020 - 2021",
      role: "Freelance UI Designer & Coder",
      company: "Remote Client Projects",
      description: "Mengerjakan berbagai proyek pembuatan website portofolio, landing page UMKM, dan mendesain aset digital interaktif untuk klien lokal & luar negeri."
    },
    {
      date: "2017 - 2021",
      role: "S1 Teknik Informatika / Ilmu Komputer",
      company: "Universitas Unggulan",
      description: "Lulus dengan predikat sangat memuaskan, fokus pada Rekayasa Perangkat Lunak, Human-Computer Interaction (HCI), dan Algoritma Pemrograman."
    }
  ],

  // Ulasan & Testimoni Klien
  testimonials: [
    {
      name: "Budi Pratama",
      role: "CEO di TechNusantara",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      quote: "Ari memiliki kemampuan luar biasa dalam menerjemahkan rancangan visual yang rumit menjadi website yang sangat cepat, responsif, dan mudah digunakan!",
      rating: 5
    },
    {
      name: "Sarah Wijaya",
      role: "Product Manager di CreativeHub",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      quote: "Kerja sama dengan Ari sangat menyenangkan. Komunikasi cepat, kode bersih, dan proyek selesai bahkan lebih cepat dari tenggat waktu yang disepakati.",
      rating: 5
    },
    {
      name: "Dian Kurnia",
      role: "Founder Kopi Artisan",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
      quote: "Landing page yang dibuat Ari mendongkrak reservasi meja kami hingga 70%! Tampilannya sangat estetis dan disukai banyak pelanggan.",
      rating: 5
    }
  ],

  // Palet Warna Kustom yang Dapat Dipilih di Theme Customizer
  colorPalettes: [
    { name: "Indigo", primary: "#6366f1", hover: "#4f46e5", glow: "rgba(99, 102, 241, 0.35)", secondary: "#22d3ee" },
    { name: "Emerald", primary: "#10b981", hover: "#059669", glow: "rgba(16, 185, 129, 0.35)", secondary: "#34d399" },
    { name: "Cyan", primary: "#06b6d4", hover: "#0891b2", glow: "rgba(6, 182, 212, 0.35)", secondary: "#38bdf8" },
    { name: "Violet", primary: "#8b5cf6", hover: "#7c3aed", glow: "rgba(139, 92, 246, 0.35)", secondary: "#ec4899" },
    { name: "Rose", primary: "#f43f5e", hover: "#e11d48", glow: "rgba(244, 63, 94, 0.35)", secondary: "#fb7185" },
    { name: "Amber", primary: "#f59e0b", hover: "#d97706", glow: "rgba(245, 158, 11, 0.35)", secondary: "#fbbf24" }
  ]
};
