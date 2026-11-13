document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navPanel = document.getElementById("primaryNav");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const progressBar = document.getElementById("scrollProgress");
  const year = document.getElementById("year");
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = window.localStorage.getItem("sp-theme");
  const preferredTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  document.body.dataset.theme = preferredTheme;

  const updateThemeToggle = () => {
    const isLight = document.body.dataset.theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
    themeToggle.setAttribute("title", `Switch to ${isLight ? "dark" : "light"} theme`);
    themeToggle.querySelector(".theme-label").textContent = isLight ? "Dark mode" : "Light mode";
    document.querySelector('meta[name="theme-color"]').content = isLight ? "#f3f6f8" : "#080d12";
  };
  updateThemeToggle();
  themeToggle.addEventListener("click", () => {
    document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("sp-theme", document.body.dataset.theme);
    updateThemeToggle();
  });

  if (year) year.textContent = String(new Date().getFullYear());
  requestAnimationFrame(() => document.body.classList.add("is-loaded"));

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const setMenuOpen = (open) => {
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };
  menuToggle.addEventListener("click", () => setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"));
  navPanel.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menuToggle.getAttribute("aria-expanded") === "true") setMenuOpen(false);
  });

  const sections = [document.querySelector(".hero"), ...document.querySelectorAll("main section[id]")].filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const targetId = visible.target.classList.contains("hero") ? "home" : visible.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${targetId}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.1, 0.3] });
    sections.forEach((section) => navObserver.observe(section));
  }

  let scrollQueued = false;
  const updateScrollEffects = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    const timeline = document.getElementById("careerTimeline");
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const travel = rect.height + window.innerHeight * 0.42;
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.72 - rect.top) / travel));
      timeline.style.setProperty("--timeline-progress", String(progress));
      const items = [...timeline.querySelectorAll(".timeline-item")];
      const activeIndex = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
      items.forEach((item, index) => item.classList.toggle("is-active", index <= activeIndex));
    }
    scrollQueued = false;
  };
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateScrollEffects);
  }, { passive: true });
  updateScrollEffects();

  const techStrip = document.querySelector(".skills-strip");
  const techTrack = techStrip?.querySelector(".skills-strip-track");
  const firstTechSet = techTrack?.querySelector(".tech-card-set");
  if (techStrip && techTrack && firstTechSet) {
    const duplicateTechSet = firstTechSet.cloneNode(true);
    duplicateTechSet.setAttribute("aria-hidden", "true");
    duplicateTechSet.querySelectorAll("img").forEach((image) => { image.alt = ""; });
    techTrack.append(duplicateTechSet);
    techTrack.classList.add("is-looping");
    techStrip.classList.add("is-looping");
  }
  const seeMoreButton = document.getElementById("seeMoreProjects");
  const projectDetails = [...document.querySelectorAll(".project-details")];
  seeMoreButton.addEventListener("click", () => {
    const expand = seeMoreButton.getAttribute("aria-expanded") !== "true";
    projectDetails.forEach((detail) => { detail.open = expand; });
    seeMoreButton.setAttribute("aria-expanded", String(expand));
    seeMoreButton.innerHTML = expand
      ? 'Hide project details <span aria-hidden="true">↑</span>'
      : 'See more projects <span aria-hidden="true">↓</span>';
  });

  const countElements = [...document.querySelectorAll(".count-up")];
  const setCount = (element, value) => { element.textContent = String(value); };
  const animateCount = (element) => {
    const target = Number(element.dataset.count);
    if (reducedMotion) {
      setCount(element, target);
      return;
    }
    const start = performance.now();
    const duration = 850;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setCount(element, Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reducedMotion || !("IntersectionObserver" in window)) {
    countElements.forEach((element) => setCount(element, element.dataset.count));
  } else {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    countElements.forEach((element) => countObserver.observe(element));
  }

  if (finePointer && !reducedMotion) {
    document.body.classList.add("has-custom-cursor");
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let pointerX = -100;
    let pointerY = -100;
    let cursorFrame = 0;
    const paintCursor = () => {
      const position = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      dot.style.transform = position;
      ring.style.transform = position;
      cursorFrame = 0;
    };
    document.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!cursorFrame) cursorFrame = requestAnimationFrame(paintCursor);
    }, { passive: true });
    document.querySelectorAll("a, button, .project-feature, .service-card").forEach((element) => {
      element.addEventListener("pointerenter", () => ring.classList.add("is-hovering"));
      element.addEventListener("pointerleave", () => ring.classList.remove("is-hovering"));
    });

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--x", `${x * 100}%`);
        card.style.setProperty("--y", `${y * 100}%`);
      });
    });
  }

  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const fields = [
    { input: document.getElementById("contactName"), error: document.getElementById("nameError"), message: "Please enter your name (at least 2 characters)." },
    { input: document.getElementById("contactEmail"), error: document.getElementById("emailError"), message: "Enter a valid email address." },
    { input: document.getElementById("contactMessage"), error: document.getElementById("messageError"), message: "Please add a message of at least 10 characters." }
  ];
  const validateField = ({ input, error }) => {
    const valid = input.checkValidity();
    error.textContent = valid ? "" : input.validity.typeMismatch ? "Enter a valid email address." : input.validity.tooShort ? `Please enter at least ${input.minLength} characters.` : "This field is required.";
    input.setAttribute("aria-invalid", String(!valid));
    return valid;
  };
  fields.forEach((field) => {
    field.input.addEventListener("input", () => {
      validateField(field);
      formStatus.textContent = "";
      formStatus.classList.remove("is-error");
    });
    field.input.addEventListener("blur", () => validateField(field));
  });
  const submitButton = form.querySelector('[type="submit"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      formStatus.textContent = "Please check the highlighted fields.";
      formStatus.classList.add("is-error");
      fields.find((field) => !field.input.checkValidity())?.input.focus();
      return;
    }

    submitButton.disabled = true;
    formStatus.textContent = "Sending your message…";
    formStatus.classList.remove("is-error");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please email me directly.");

      form.reset();
      fields.forEach(({ input, error }) => {
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      });
      formStatus.textContent = "Thanks for reaching out — your message has been sent.";
    } catch (error) {
      formStatus.textContent = error instanceof Error
        ? error.message
        : "Your message could not be sent. Please email me directly.";
      formStatus.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
    }
  });
});
