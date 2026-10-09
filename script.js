document.addEventListener("DOMContentLoaded", () => {
  window.lucide?.createIcons();

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const choice = target?.closest(".avatar-choice");
    if (!choice) return;
    const profileAvatar = document.querySelector("#profile-avatar");
    if (!profileAvatar || !choice.dataset.avatar) return;
    profileAvatar.src = choice.dataset.avatar;
    profileAvatar.alt = choice.dataset.alt || "个人头像";
    document.querySelectorAll(".avatar-choice").forEach((item) => {
      item.classList.toggle("is-active", item === choice);
      item.setAttribute("aria-pressed", String(item === choice));
    });
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const setMenu = (isOpen) => {
    nav?.classList.toggle("is-open", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    if (menuToggle) menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  };

  menuToggle?.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));

  const progressBar = document.querySelector(".reading-progress span");
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const copyButton = document.querySelector(".copy-email");
  const toast = document.querySelector(".toast");
  let toastTimer;
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
    } catch {
      return;
    }
    toast?.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast?.classList.remove("is-visible"), 1600);
  });

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll(".carousel-slide")];
    const label = carousel.querySelector("[data-carousel-label]");
    const count = carousel.querySelector("[data-carousel-count]");
    if (slides.length < 2) return;

    let activeIndex = 0;
    let timer;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.querySelectorAll("video").forEach((video) => {
          if (isActive) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      });
      if (label) label.textContent = slides[activeIndex].dataset.label || "Demo preview";
      if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
    };

    const start = () => {
      if (reducedMotion) return;
      clearInterval(timer);
      timer = setInterval(() => {
        activeIndex = (activeIndex + 1) % slides.length;
        render();
      }, 5200);
    };

    render();
    start();
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", () => clearInterval(timer));
    carousel.addEventListener("focusout", start);
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
