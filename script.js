/**
 * ===================================================================
 * PORTFOLIO JAVASCRIPT (DYNAMIC ENGINE)
 * Author: Ari Satriya
 * Connects data from data.js into dynamic UI elements & interactions
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure data exists
  if (typeof portfolioData === 'undefined') {
    console.error('Data portofolio (data.js) tidak ditemukan!');
    return;
  }

  // -----------------------------------------------------------------
  // 1. DYNAMIC PROFILE & HERO INJECTION
  // -----------------------------------------------------------------
  const { profile } = portfolioData;

  // Brand & Logo
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    navLogo.innerHTML = `
      <span class="logo-symbol">${profile.logoSymbol}</span>
      <span class="logo-text">${profile.brandName.slice(0, 3)}<span>${profile.brandName.slice(3)}</span></span>
    `;
  }

  // Hero Name & Status
  const heroName = document.getElementById('heroName');
  if (heroName) heroName.textContent = profile.name;

  const heroAvailability = document.getElementById('heroAvailabilityText');
  if (heroAvailability) heroAvailability.textContent = profile.availability;

  const heroDesc = document.getElementById('heroDescription');
  if (heroDesc) heroDesc.textContent = profile.heroSubtitle;

  const heroAvatar = document.getElementById('heroAvatarImg');
  if (heroAvatar) {
    heroAvatar.src = profile.avatarUrl;
    heroAvatar.alt = `Foto Profil ${profile.name}`;
  }

  // Social Links
  const heroSocials = document.getElementById('heroSocialsContainer');
  const footerSocials = document.getElementById('footerSocialsContainer');
  if (heroSocials) {
    const socialsHtml = profile.socials
      .map(
        (s) =>
          `<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}" title="${s.name}">
            <i class="${s.icon}"></i>
          </a>`
      )
      .join('');
    heroSocials.innerHTML = socialsHtml;
    if (footerSocials) footerSocials.innerHTML = socialsHtml;
  }

  // -----------------------------------------------------------------
  // 2. TYPEWRITER EFFECT
  // -----------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement && profile.typingRoles && profile.typingRoles.length > 0) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const pauseDelay = 1800;

    function typeWriter() {
      const currentRole = profile.typingRoles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? erasingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % profile.typingRoles.length;
        timeout = 400;
      }

      setTimeout(typeWriter, timeout);
    }

    typeWriter();
  }

  // -----------------------------------------------------------------
  // 3. LIVE CLOCK TICKER (WIB)
  // -----------------------------------------------------------------
  const liveClockText = document.getElementById('liveClockText');
  function updateLiveClock() {
    if (!liveClockText) return;
    const now = new Date();
    // Format to WIB (UTC+7)
    const options = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeString = new Intl.DateTimeFormat('id-ID', options).format(now);
    liveClockText.textContent = `${timeString} WIB`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // -----------------------------------------------------------------
  // 4. ABOUT SECTION INJECTION
  // -----------------------------------------------------------------
  const aboutImg = document.getElementById('aboutImg');
  if (aboutImg) aboutImg.src = profile.aboutImage;

  const aboutExpNumber = document.getElementById('aboutExpNumber');
  if (aboutExpNumber) aboutExpNumber.textContent = `${profile.experienceYears}+`;

  const aboutInfoGrid = document.getElementById('aboutInfoGrid');
  if (aboutInfoGrid) {
    aboutInfoGrid.innerHTML = `
      <div class="info-item">
        <i class="fa-solid fa-user-check"></i>
        <div>
          <span>Nama:</span>
          <strong>${profile.name}</strong>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-location-dot"></i>
        <div>
          <span>Lokasi:</span>
          <strong>${profile.location}</strong>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-envelope"></i>
        <div>
          <span>Email:</span>
          <strong>${profile.email}</strong>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-briefcase"></i>
        <div>
          <span>Status:</span>
          <strong>Freelance / Full-time</strong>
        </div>
      </div>
    `;
  }

  const downloadCvBtn = document.getElementById('downloadCvBtn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      if (profile.cvDownloadUrl && profile.cvDownloadUrl !== '#') {
        window.open(profile.cvDownloadUrl, '_blank');
      } else {
        showToast('Info Unduhan CV', 'File PDF CV siap dihubungkan melalui portfolioData.profile.cvDownloadUrl di data.js!');
      }
    });
  }

  // -----------------------------------------------------------------
  // 5. ANIMATED STATS COUNTER
  // -----------------------------------------------------------------
  const statsContainer = document.getElementById('statsRowContainer');
  if (statsContainer && portfolioData.stats) {
    statsContainer.innerHTML = portfolioData.stats
      .map(
        (stat) => `
        <div class="stat-card">
          <i class="${stat.icon} stat-icon"></i>
          <div class="stat-number" data-target="${stat.targetNumber}" data-suffix="${stat.suffix}">0${stat.suffix}</div>
          <div class="stat-title">${stat.label}</div>
        </div>
      `
      )
      .join('');

    // Animate stats when scrolled into view
    let statsAnimated = false;
    const statElements = statsContainer.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statElements.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600; // ms
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                el.textContent = `${target}${suffix}`;
                clearInterval(timer);
              } else {
                el.textContent = `${Math.floor(current)}${suffix}`;
              }
            }, stepTime);
          });
        }
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(statsContainer);
  }

  // -----------------------------------------------------------------
  // 6. SERVICES SECTION INJECTION
  // -----------------------------------------------------------------
  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid && portfolioData.services) {
    servicesGrid.innerHTML = portfolioData.services
      .map(
        (srv) => `
        <div class="service-card">
          <div class="service-icon"><i class="${srv.icon}"></i></div>
          <h3 class="service-title">${srv.title}</h3>
          <p class="service-desc">${srv.description}</p>
        </div>
      `
      )
      .join('');
  }

  // -----------------------------------------------------------------
  // 7. SKILLS SECTION INJECTION & ANIMATED PROGRESS BARS
  // -----------------------------------------------------------------
  const skillsGrid = document.getElementById('skillsGrid');
  if (skillsGrid && portfolioData.skills) {
    skillsGrid.innerHTML = portfolioData.skills
      .map(
        (cat) => `
        <div class="skill-category-card">
          <div class="category-header">
            <div class="category-icon"><i class="${cat.icon}"></i></div>
            <h3>${cat.category}</h3>
          </div>
          <div class="skill-tags">
            ${cat.tags.map((t) => `<span class="skill-tag">${t}</span>`).join('')}
          </div>
          <div class="skill-bars">
            ${cat.bars
              .map(
                (bar) => `
              <div class="bar-group">
                <div class="bar-info">
                  <span>${bar.name}</span>
                  <span>${bar.level}%</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" data-level="${bar.level}"></div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');

    // Animate skill bars when in view
    let skillsAnimated = false;
    const skillBarsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          const barFills = skillsGrid.querySelectorAll('.bar-fill');
          barFills.forEach((fill) => {
            const level = fill.getAttribute('data-level');
            fill.style.width = `${level}%`;
          });
        }
      },
      { threshold: 0.25 }
    );

    skillBarsObserver.observe(skillsGrid);
  }

  // -----------------------------------------------------------------
  // 8. DYNAMIC PROJECTS: RENDERING, SEARCH, FILTER & DETAIL MODAL
  // -----------------------------------------------------------------
  const projectsGrid = document.getElementById('projectsGrid');
  const projectFiltersContainer = document.getElementById('projectFiltersContainer');
  const projectSearchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const projectCountIndicator = document.getElementById('projectCountIndicator');
  const emptyState = document.getElementById('projectsEmptyState');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  // Calculate Category Counts
  function setupProjectFilters() {
    if (!projectFiltersContainer || !portfolioData.projects) return;

    const allProjects = portfolioData.projects;
    const categoryCounts = {
      all: allProjects.length,
      frontend: allProjects.filter((p) => p.category === 'frontend').length,
      fullstack: allProjects.filter((p) => p.category === 'fullstack').length,
      uiux: allProjects.filter((p) => p.category === 'uiux').length
    };

    projectFiltersContainer.innerHTML = `
      <button class="filter-btn active" data-filter="all">
        Semua <span class="filter-count">${categoryCounts.all}</span>
      </button>
      <button class="filter-btn" data-filter="frontend">
        Frontend Web <span class="filter-count">${categoryCounts.frontend}</span>
      </button>
      <button class="filter-btn" data-filter="fullstack">
        Web App <span class="filter-count">${categoryCounts.fullstack}</span>
      </button>
      <button class="filter-btn" data-filter="uiux">
        UI/UX Design <span class="filter-count">${categoryCounts.uiux}</span>
      </button>
    `;

    // Add filter click event
    const filterButtons = projectFiltersContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter');
        renderProjects();
      });
    });
  }

  function renderProjects() {
    if (!projectsGrid || !portfolioData.projects) return;

    const query = currentSearchQuery.toLowerCase().trim();

    // Filter projects based on category and search query
    const filtered = portfolioData.projects.filter((p) => {
      const matchCategory = currentCategory === 'all' || p.category === currentCategory;
      const matchSearch =
        query === '' ||
        p.title.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });

    // Update count indicator
    const totalCount = portfolioData.projects.length;
    if (projectCountIndicator) {
      if (query !== '' || currentCategory !== 'all') {
        projectCountIndicator.textContent = `Menampilkan ${filtered.length} dari total ${totalCount} proyek`;
      } else {
        projectCountIndicator.textContent = `Menampilkan seluruh ${totalCount} proyek`;
      }
    }

    // Handle Empty State
    if (filtered.length === 0) {
      projectsGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    // Render Cards
    projectsGrid.innerHTML = filtered
      .map(
        (project) => `
        <div class="project-card" data-id="${project.id}">
          <div class="project-img-wrapper">
            <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />
            <div class="project-overlay">
              <button class="overlay-btn view-detail-btn" data-id="${project.id}" title="Lihat Detail Lengkap">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </button>
              ${
                project.githubUrl
                  ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="overlay-btn" title="Source Code GitHub">
                      <i class="fa-brands fa-github"></i>
                    </a>`
                  : ''
              }
            </div>
          </div>
          <div class="project-info">
            <div class="project-tags">
              ${project.tags.map((t) => `<span>${t}</span>`).join('')}
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.shortDesc}</p>
            <div class="project-links">
              <button class="link-item view-detail-btn" data-id="${project.id}">
                <i class="fa-solid fa-circle-info"></i> Detail Proyek
              </button>
              ${
                project.demoUrl
                  ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="link-item">
                      <i class="fa-solid fa-eye"></i> Demo Live &rarr;
                    </a>`
                  : ''
              }
            </div>
          </div>
        </div>
      `
      )
      .join('');

    // Attach click event for detail modals
    const detailBtns = projectsGrid.querySelectorAll('.view-detail-btn');
    detailBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-id');
        openProjectModal(projectId);
      });
    });
  }

  // Search input events
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (clearSearchBtn) {
        if (currentSearchQuery.length > 0) {
          clearSearchBtn.classList.add('show');
        } else {
          clearSearchBtn.classList.remove('show');
        }
      }
      renderProjects();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      projectSearchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.classList.remove('show');
      projectSearchInput.focus();
      renderProjects();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (projectSearchInput) projectSearchInput.value = '';
      currentSearchQuery = '';
      if (clearSearchBtn) clearSearchBtn.classList.remove('show');
      currentCategory = 'all';

      const filterButtons = projectFiltersContainer.querySelectorAll('.filter-btn');
      filterButtons.forEach((b) => {
        if (b.getAttribute('data-filter') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      renderProjects();
    });
  }

  setupProjectFilters();
  renderProjects();

  // -----------------------------------------------------------------
  // 9. PROJECT DETAIL MODAL LOGIC
  // -----------------------------------------------------------------
  const projectModal = document.getElementById('projectModal');
  const projectModalBody = document.getElementById('projectModalBody');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');

  function openProjectModal(id) {
    const project = portfolioData.projects.find((p) => p.id === id);
    if (!project || !projectModalBody) return;

    projectModalBody.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="modal-project-img" />
      <div class="modal-project-meta">
        <span class="modal-meta-item"><i class="fa-solid fa-folder-open text-primary"></i> ${project.categoryLabel}</span>
        <span class="modal-meta-item"><i class="fa-solid fa-calendar-days text-primary"></i> Tahun ${project.year}</span>
        <span class="modal-meta-item"><i class="fa-solid fa-building text-primary"></i> ${project.client}</span>
      </div>
      <h2 class="modal-project-title">${project.title}</h2>
      <p class="modal-project-desc">${project.fullDesc}</p>

      <h4><i class="fa-solid fa-star text-primary"></i> Fitur &amp; Keunggulan Utama:</h4>
      <ul class="modal-features-list">
        ${project.features.map((feat) => `<li><i class="fa-solid fa-circle-check"></i> <span>${feat}</span></li>`).join('')}
      </ul>

      <div class="project-tags" style="margin-top: 1rem;">
        ${project.tags.map((t) => `<span>${t}</span>`).join('')}
      </div>

      <div class="modal-actions">
        ${
          project.demoUrl
            ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Kunjungi Demo Langsung</span>
              </a>`
            : ''
        }
        ${
          project.githubUrl
            ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                <i class="fa-brands fa-github"></i>
                <span>Lihat Kode di GitHub</span>
              </a>`
            : ''
        }
      </div>
    `;

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // -----------------------------------------------------------------
  // 10. TIMELINE / EXPERIENCE INJECTION
  // -----------------------------------------------------------------
  const timelineContainer = document.getElementById('timelineContainer');
  if (timelineContainer && portfolioData.timeline) {
    timelineContainer.innerHTML = portfolioData.timeline
      .map(
        (item, index) => `
        <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-date">${item.date}</span>
            <h3 class="timeline-role">${item.role}</h3>
            <h4 class="timeline-company">${item.company}</h4>
            <p>${item.description}</p>
          </div>
        </div>
      `
      )
      .join('');
  }

  // -----------------------------------------------------------------
  // 11. TESTIMONIALS SLIDER INJECTION & LOGIC
  // -----------------------------------------------------------------
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonialBtn');
  const nextBtn = document.getElementById('nextTestimonialBtn');

  if (testimonialTrack && portfolioData.testimonials) {
    const list = portfolioData.testimonials;
    let currentSlide = 0;
    let autoplayTimer = null;

    testimonialTrack.innerHTML = list
      .map(
        (t) => `
        <div class="testimonial-card">
          <div class="testimonial-rating">
            ${Array.from({ length: t.rating }, () => '<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <p class="testimonial-quote">${t.quote}</p>
          <div class="testimonial-author">
            <img src="${t.avatar}" alt="${t.name}" class="author-avatar" />
            <div>
              <div class="author-name">${t.name}</div>
              <div class="author-role">${t.role}</div>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    // Generate Dots
    if (testimonialDots) {
      testimonialDots.innerHTML = list
        .map((_, i) => `<span class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`)
        .join('');

      const dots = testimonialDots.querySelectorAll('.slider-dot');
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          goToSlide(parseInt(dot.getAttribute('data-index'), 10));
        });
      });
    }

    function updateSlider() {
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      if (testimonialDots) {
        const dots = testimonialDots.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentSlide);
        });
      }
    }

    function goToSlide(index) {
      currentSlide = (index + list.length) % list.length;
      updateSlider();
      resetAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 6000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();
  }

  // -----------------------------------------------------------------
  // 12. CONTACT INFO INJECTION & FORM HANDLER WITH LOCALSTORAGE
  // -----------------------------------------------------------------
  const contactInfoContainer = document.getElementById('contactInfoContainer');
  if (contactInfoContainer) {
    contactInfoContainer.innerHTML = `
      <div class="contact-card">
        <div class="contact-card-icon"><i class="fa-solid fa-envelope"></i></div>
        <div>
          <h4>Email</h4>
          <p>${profile.email}</p>
          <a href="mailto:${profile.email}" class="card-link">Kirim Email Langsung &rarr;</a>
        </div>
      </div>

      <div class="contact-card">
        <div class="contact-card-icon"><i class="fa-brands fa-whatsapp"></i></div>
        <div>
          <h4>WhatsApp</h4>
          <p>${profile.whatsapp}</p>
          <a href="${profile.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="card-link">Chat via WhatsApp &rarr;</a>
        </div>
      </div>

      <div class="contact-card">
        <div class="contact-card-icon"><i class="fa-solid fa-location-dot"></i></div>
        <div>
          <h4>Domisili Kerja</h4>
          <p>${profile.location}</p>
          <span class="card-note">Tersedia untuk Kerja Remote / WFH</span>
        </div>
      </div>
    `;
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');
  const inboxCountBadge = document.getElementById('inboxCountBadge');

  function getStoredMessages() {
    try {
      const messages = localStorage.getItem('portfolio_messages');
      return messages ? JSON.parse(messages) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredMessages(messages) {
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    updateInboxBadge();
  }

  function updateInboxBadge() {
    if (!inboxCountBadge) return;
    const count = getStoredMessages().length;
    inboxCountBadge.textContent = count;
    inboxCountBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  updateInboxBadge();

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';
      submitBtn.disabled = true;

      // Simulate sending delay
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;

        // Save to LocalStorage
        const newMessage = {
          id: Date.now(),
          name,
          email,
          subject,
          message,
          date: new Date().toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        };

        const existingMessages = getStoredMessages();
        existingMessages.unshift(newMessage);
        saveStoredMessages(existingMessages);

        contactForm.reset();
        showToast('Pesan Berhasil Terkirim!', `Halo ${name}, pesan Anda telah disimpan dan saya akan segera menghubungi Anda.`);
      }, 900);
    });
  }

  function showToast(title, message) {
    if (!toast) return;

    const titleEl = toast.querySelector('.toast-title');
    const msgEl = toast.querySelector('.toast-msg');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // -----------------------------------------------------------------
  // 13. INBOX / KOTAK MASUK VIEWER MODAL
  // -----------------------------------------------------------------
  const openInboxBtn = document.getElementById('openInboxBtn');
  const inboxModal = document.getElementById('inboxModal');
  const closeInboxModalBtn = document.getElementById('closeInboxModalBtn');
  const dismissInboxModalBtn = document.getElementById('dismissInboxModalBtn');
  const clearInboxBtn = document.getElementById('clearInboxBtn');
  const inboxListContainer = document.getElementById('inboxListContainer');

  function renderInbox() {
    if (!inboxListContainer) return;
    const messages = getStoredMessages();

    if (messages.length === 0) {
      inboxListContainer.innerHTML = `
        <div class="inbox-empty">
          <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 0.75rem; color: var(--text-light);"></i>
          <p>Belum ada pesan yang masuk dari formulir kontak.</p>
        </div>
      `;
      return;
    }

    inboxListContainer.innerHTML = messages
      .map(
        (msg) => `
        <div class="inbox-card" data-msg-id="${msg.id}">
          <div class="inbox-header">
            <div>
              <div class="inbox-sender-name">${msg.name}</div>
              <div class="inbox-email">${msg.email}</div>
            </div>
            <div class="inbox-date">${msg.date}</div>
          </div>
          <div class="inbox-subject">Subjek: ${msg.subject}</div>
          <div class="inbox-text">${msg.message}</div>
          <button class="inbox-delete-item" data-delete-id="${msg.id}">
            <i class="fa-solid fa-trash"></i> Hapus Pesan
          </button>
        </div>
      `
      )
      .join('');

    // Delete single message listener
    const deleteButtons = inboxListContainer.querySelectorAll('.inbox-delete-item');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idToDelete = parseInt(btn.getAttribute('data-delete-id'), 10);
        const updated = getStoredMessages().filter((m) => m.id !== idToDelete);
        saveStoredMessages(updated);
        renderInbox();
      });
    });
  }

  function openInbox() {
    renderInbox();
    if (inboxModal) {
      inboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeInbox() {
    if (inboxModal) {
      inboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openInboxBtn) openInboxBtn.addEventListener('click', openInbox);
  if (closeInboxModalBtn) closeInboxModalBtn.addEventListener('click', closeInbox);
  if (dismissInboxModalBtn) dismissInboxModalBtn.addEventListener('click', closeInbox);
  if (inboxModal) {
    inboxModal.addEventListener('click', (e) => {
      if (e.target === inboxModal) closeInbox();
    });
  }

  if (clearInboxBtn) {
    clearInboxBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin menghapus seluruh pesan di kotak masuk lokal?')) {
        saveStoredMessages([]);
        renderInbox();
      }
    });
  }

  // -----------------------------------------------------------------
  // 14. THEME & DYNAMIC ACCENT COLOR CUSTOMIZER
  // -----------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const openCustomizerBtn = document.getElementById('openCustomizerBtn');
  const closeCustomizerBtn = document.getElementById('closeCustomizerBtn');
  const customizerDrawer = document.getElementById('customizerDrawer');
  const resetCustomizerBtn = document.getElementById('resetCustomizerBtn');
  const paletteSwatchesContainer = document.getElementById('paletteSwatchesContainer');
  const themeChoiceDark = document.getElementById('themeChoiceDark');
  const themeChoiceLight = document.getElementById('themeChoiceLight');
  const htmlElement = document.documentElement;

  // Render Palette Swatches
  function setupColorPalettes() {
    if (!paletteSwatchesContainer || !portfolioData.colorPalettes) return;

    const savedPalette = localStorage.getItem('portfolio_accent_palette') || 'Indigo';

    paletteSwatchesContainer.innerHTML = portfolioData.colorPalettes
      .map(
        (pal) => `
        <div class="palette-swatch-item ${pal.name === savedPalette ? 'active' : ''}" data-palette-name="${pal.name}">
          <div class="color-dot" style="background: ${pal.primary};"></div>
          <span class="palette-name">${pal.name}</span>
        </div>
      `
      )
      .join('');

    const swatchItems = paletteSwatchesContainer.querySelectorAll('.palette-swatch-item');
    swatchItems.forEach((item) => {
      item.addEventListener('click', () => {
        const palName = item.getAttribute('data-palette-name');
        applyColorPalette(palName);
        swatchItems.forEach((s) => s.classList.remove('active'));
        item.classList.add('active');
      });
    });

    if (savedPalette) {
      applyColorPalette(savedPalette);
    }
  }

  function applyColorPalette(paletteName) {
    const palette = portfolioData.colorPalettes.find((p) => p.name === paletteName);
    if (!palette) return;

    htmlElement.style.setProperty('--primary', palette.primary);
    htmlElement.style.setProperty('--primary-hover', palette.hover);
    htmlElement.style.setProperty('--primary-glow', palette.glow);
    htmlElement.style.setProperty('--secondary', palette.secondary);

    localStorage.setItem('portfolio_accent_palette', paletteName);
  }

  // Theme (Dark / Light) Setup
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  setTheme(savedTheme);

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);

    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    }

    if (themeChoiceDark && themeChoiceLight) {
      themeChoiceDark.classList.toggle('active', theme === 'dark');
      themeChoiceLight.classList.toggle('active', theme === 'light');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  if (themeChoiceDark) themeChoiceDark.addEventListener('click', () => setTheme('dark'));
  if (themeChoiceLight) themeChoiceLight.addEventListener('click', () => setTheme('light'));

  // Open/Close Customizer Drawer
  if (openCustomizerBtn) {
    openCustomizerBtn.addEventListener('click', () => {
      customizerDrawer.classList.toggle('open');
    });
  }

  if (closeCustomizerBtn) {
    closeCustomizerBtn.addEventListener('click', () => {
      customizerDrawer.classList.remove('open');
    });
  }

  if (resetCustomizerBtn) {
    resetCustomizerBtn.addEventListener('click', () => {
      applyColorPalette('Indigo');
      setTheme('dark');
      setupColorPalettes();
      showToast('Tema Direset', 'Warna dan tema telah dikembalikan ke standar awal.');
    });
  }

  setupColorPalettes();

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeInbox();
      if (customizerDrawer) customizerDrawer.classList.remove('open');
    }
  });

  // -----------------------------------------------------------------
  // 15. NAVBAR STICKY, ACTIVE LINK SCROLLSPY & MOBILE MENU
  // -----------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }

  // ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 130;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (targetLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  });

  // Footer Dynamic Year & Copyright
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  const footerCopyrightName = document.getElementById('footerCopyrightName');
  if (footerCopyrightName) footerCopyrightName.textContent = profile.name;
});
