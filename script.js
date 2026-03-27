const slides = [
  {
    eyebrow: "Live performance telemetry",
    title: ["Future", "Drive", "X1"],
    subtitle: "Experience next-gen engineering with immersive electric acceleration and precision-built aerodynamics.",
    primary: "#ff5a36",
    accent: "#62f3ff",
    panelTitle: "Aerodynamic Control",
    panelDescription: "A sculpted body profile that balances cooling, downforce, and silent high-speed confidence.",
    meta: {
      powertrain: "Dual Motor EV",
      launch: "3.2s / 100 kmh",
      intelligence: "AI Assist Drive"
    },
    specs: [
      { label: "0-100", value: "3.2s" },
      { label: "Top Speed", value: "320 km/h" },
      { label: "Range", value: "600 km" }
    ],
    ticker: [
      "New model launch",
      "Electric revolution",
      "Performance redefined",
      "Autonomous cockpit intelligence"
    ],
    features: ["Launch Vision", "Carbon Aero Shell", "Immersive Cockpit OS"],
    spotlight: {
      title: "Adaptive torque vectoring",
      copy: "Real-time grip balancing keeps the chassis planted through fast transitions and long straights."
    },
    battery: 92,
    climate: "21 C",
    climateCopy: "Biometric comfort sync enabled",
    cta: {
      primary: "Explore Model",
      secondary: "View Specs"
    },
    navLabel: "Future Drive X1"
  },
  {
    eyebrow: "Adaptive hybrid intelligence",
    title: ["Urban", "Pulse", "R7"],
    subtitle: "Built for fast city responses, tactile steering feedback, and a cockpit tuned for connected night driving.",
    primary: "#84f76a",
    accent: "#ffe45b",
    panelTitle: "Night Mode Precision",
    panelDescription: "A low-slung hybrid form engineered for quick urban moves, sensory feedback, and cleaner high-speed airflow.",
    meta: {
      powertrain: "Hybrid Turbo AWD",
      launch: "4.1s / 100 kmh",
      intelligence: "Predictive Lane Sense"
    },
    specs: [
      { label: "Torque", value: "780 Nm" },
      { label: "Drive Mode", value: "Street / Track" },
      { label: "Efficiency", value: "21 km/l" }
    ],
    ticker: [
      "Hybrid response engineering",
      "Cockpit-first interface",
      "Sharper handling profile",
      "Intelligent traction mapping"
    ],
    features: ["Predictive Drift Assist", "Luminous Dash Grid", "Adaptive Sound Canopy"],
    spotlight: {
      title: "Street-to-track calibration",
      copy: "Dynamic suspension mapping reads road inputs and switches chassis behavior in milliseconds."
    },
    battery: 74,
    climate: "19 C",
    climateCopy: "Night cabin airflow optimized",
    cta: {
      primary: "Start Tour",
      secondary: "Compare Trim"
    },
    navLabel: "Urban Pulse R7"
  }
];

const state = {
  index: 0,
  total: slides.length,
  isAnimating: false,
  startX: 0,
  autoRotate: false,
  autoRotateTimer: null,
  navOpen: false,
  pointerX: 0,
  pointerY: 0,
  parallaxFrame: null
};

const desktopMediaQuery = window.matchMedia("(min-width: 981px)");
const reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const track = document.getElementById("track");
const content = document.getElementById("content");
const eyebrowText = document.getElementById("eyebrow-text");
const heroTitle = document.getElementById("hero-title");
const heroSubtitle = document.getElementById("hero-subtitle");
const primaryAction = document.getElementById("primary-action");
const secondaryAction = document.getElementById("secondary-action");
const panelTitle = document.getElementById("panel-title");
const panelDescription = document.getElementById("panel-description");
const specList = document.getElementById("spec-list");
const tickerTrack = document.getElementById("ticker-track");
const progress = document.getElementById("progress");
const metaPowertrain = document.getElementById("meta-powertrain");
const metaLaunch = document.getElementById("meta-launch");
const metaIntelligence = document.getElementById("meta-intelligence");
const featureBand = document.getElementById("feature-band");
const spotlightTitle = document.getElementById("spotlight-title");
const spotlightCopy = document.getElementById("spotlight-copy");
const batteryStat = document.getElementById("battery-stat");
const batteryFill = document.getElementById("battery-fill");
const climateStat = document.getElementById("climate-stat");
const climateCopy = document.getElementById("climate-copy");
const navMeta = document.getElementById("nav-meta");
const sideRail = document.getElementById("side-rail");
const railItems = [...document.querySelectorAll(".rail-item")];
const autoplayToggle = document.getElementById("autoplay-toggle");
const prevSlideButton = document.getElementById("prev-slide");
const nextSlideButton = document.getElementById("next-slide");
const specsSection = document.getElementById("specs-section");
const revealItems = [...document.querySelectorAll(".reveal-on-scroll")];
const backgrounds = [...document.querySelectorAll(".bg")];
const navLinks = [...document.querySelectorAll(".nav-link-pill")];
const navShell = document.querySelector(".nav-shell");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

function isDesktopView() {
  return desktopMediaQuery.matches;
}

function prefersReducedMotion() {
  return reducedMotionMediaQuery.matches;
}

function buildTitle(parts) {
  return `
    <span>${parts[0]}</span><br>
    <span class="outline">${parts[1]}</span><br>
    <span class="gradient">${parts[2]}</span>
  `;
}

function buildSpecs(items) {
  return items.map((item) => `
    <div class="spec-item">
      <span class="spec-label">${item.label}</span>
      <span class="spec-value">${item.value}</span>
    </div>
  `).join("");
}

function buildTicker(items) {
  return items.map((item) => `<span>${item}</span>`).join("");
}

function buildFeatures(items) {
  const featureIcons = ["stars", "layers", "cpu"];

  return items.map((item, index) => `
    <div class="feature-chip">
      <i class="bi bi-${featureIcons[index % featureIcons.length]} me-2"></i>${item}
    </div>
  `).join("");
}

function updateProgress(index) {
  [...progress.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
}

function updateRail(index) {
  railItems.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
    item.setAttribute("aria-current", itemIndex === index ? "true" : "false");
  });
}

function animateContentIn() {
  if (prefersReducedMotion()) {
    content.style.opacity = "1";
    content.style.transform = "translateY(0)";
    return;
  }

  content.style.transition = "none";
  content.style.opacity = "0";
  content.style.transform = "translateY(36px)";
  void content.offsetHeight;
  content.style.transition = "opacity 0.55s ease, transform 0.85s ease";
  content.style.opacity = "1";
  content.style.transform = "translateY(0)";
}

function applySlide(index) {
  const slide = slides[index];

  track.style.transform = `translateX(-${index * 100}vw)`;
  document.documentElement.style.setProperty("--primary", slide.primary);
  document.documentElement.style.setProperty("--accent", slide.accent);

  eyebrowText.innerHTML = `<i class="bi bi-speedometer2 me-2"></i>${slide.eyebrow}`;
  heroTitle.innerHTML = buildTitle(slide.title);
  heroSubtitle.textContent = slide.subtitle;
  primaryAction.innerHTML = `<i class="bi bi-lightning-charge-fill me-2"></i>${slide.cta.primary}`;
  secondaryAction.innerHTML = `<i class="bi bi-list-check me-2"></i>${slide.cta.secondary}`;
  panelTitle.textContent = slide.panelTitle;
  panelDescription.textContent = slide.panelDescription;
  metaPowertrain.textContent = slide.meta.powertrain;
  metaLaunch.textContent = slide.meta.launch;
  metaIntelligence.textContent = slide.meta.intelligence;
  specList.innerHTML = buildSpecs(slide.specs);
  tickerTrack.innerHTML = buildTicker(slide.ticker);
  featureBand.innerHTML = buildFeatures(slide.features);
  spotlightTitle.textContent = slide.spotlight.title;
  spotlightCopy.textContent = slide.spotlight.copy;
  batteryStat.textContent = `${slide.battery}%`;
  batteryFill.style.width = `${slide.battery}%`;
  climateStat.textContent = slide.climate;
  climateCopy.textContent = slide.climateCopy;
  const navHintIcon = isDesktopView() ? "mouse" : "phone";
  const navHintText = isDesktopView() ? "wheel, arrows, swipe" : "tap, arrows, swipe";

  navMeta.innerHTML = `<i class="bi bi-${navHintIcon} me-2"></i>${index + 1}/${slides.length} active | ${navHintText}`;

  updateProgress(index);
  updateRail(index);
  animateContentIn();
}

function goToSlide(nextIndex) {
  if (state.isAnimating) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(state.total - 1, nextIndex));

  if (safeIndex === state.index) {
    return;
  }

  state.isAnimating = true;
  state.index = safeIndex;
  applySlide(state.index);

  window.setTimeout(() => {
    state.isAnimating = false;
  }, 900);
}

function switchSlide(direction) {
  goToSlide(state.index + direction);
}

function stopAutoRotate() {
  if (state.autoRotateTimer) {
    window.clearInterval(state.autoRotateTimer);
    state.autoRotateTimer = null;
  }
}

function startAutoRotate() {
  stopAutoRotate();
  state.autoRotateTimer = window.setInterval(() => {
    const nextIndex = (state.index + 1) % state.total;
    goToSlide(nextIndex);
  }, 4200);
}

function setAutoRotate(enabled) {
  state.autoRotate = enabled;
  autoplayToggle.setAttribute("aria-pressed", String(enabled));
  autoplayToggle.innerHTML = enabled
    ? '<i class="bi bi-pause-circle me-2"></i>Auto Rotate On'
    : '<i class="bi bi-play-circle me-2"></i>Auto Rotate Off';

  if (enabled) {
    startAutoRotate();
  } else {
    stopAutoRotate();
  }
}

function handleWheel(event) {
  if (!isDesktopView()) {
    return;
  }

  const sceneThreshold = window.innerHeight * 0.6;

  if (window.scrollY > sceneThreshold) {
    return;
  }

  if (Math.abs(event.deltaY) < 12) {
    return;
  }

  switchSlide(event.deltaY > 0 ? 1 : -1);
}

function handleTouchStart(event) {
  state.startX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  const deltaX = event.changedTouches[0].clientX - state.startX;

  if (deltaX < -50) {
    switchSlide(1);
  }

  if (deltaX > 50) {
    switchSlide(-1);
  }
}

function handleKeyboard(event) {
  if (state.navOpen && event.key === "Escape") {
    setNavOpen(false);
    return;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    switchSlide(1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    switchSlide(-1);
  }
}

function handleParallax(event) {
  if (!isDesktopView() || prefersReducedMotion()) {
    return;
  }

  state.pointerX = (event.clientX / window.innerWidth - 0.5) * 18;
  state.pointerY = (event.clientY / window.innerHeight - 0.5) * 14;

  if (state.parallaxFrame) {
    return;
  }

  state.parallaxFrame = window.requestAnimationFrame(() => {
    backgrounds.forEach((background) => {
      background.style.transform = `scale(1.08) translate(${state.pointerX}px, ${state.pointerY}px)`;
    });

    state.parallaxFrame = null;
  });
}

function handleRailClick(event) {
  const item = event.target.closest(".rail-item");

  if (!item) {
    return;
  }

  const index = Number(item.dataset.slide);

  if (!Number.isNaN(index)) {
    goToSlide(index);
  }
}

function handleNavLinkClick(event) {
  const link = event.currentTarget;
  const targetSelector = link.getAttribute("href");

  if (!targetSelector || !targetSelector.startsWith("#")) {
    return;
  }

  const target = document.querySelector(targetSelector);

  if (!target) {
    return;
  }

  event.preventDefault();
  setNavOpen(false);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setNavOpen(isOpen) {
  state.navOpen = isOpen;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navShell.classList.toggle("nav-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen && !isDesktopView());

  if (isDesktopView()) {
    navMenu.removeAttribute("aria-hidden");
  } else {
    navMenu.setAttribute("aria-hidden", String(!isOpen));
  }
}

function syncResponsiveState() {
  if (isDesktopView()) {
    setNavOpen(false);
    navMenu.removeAttribute("aria-hidden");
    document.body.classList.remove("nav-open");
    return;
  }

  navMenu.setAttribute("aria-hidden", String(!state.navOpen));
}

function revealOnScroll(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}

window.addEventListener("wheel", handleWheel, { passive: true });
window.addEventListener("keydown", handleKeyboard);
window.addEventListener("touchstart", handleTouchStart, { passive: true });
window.addEventListener("touchend", handleTouchEnd, { passive: true });
window.addEventListener("mousemove", handleParallax);
window.addEventListener("resize", syncResponsiveState);
sideRail.addEventListener("click", handleRailClick);
autoplayToggle.addEventListener("click", () => {
  setAutoRotate(!state.autoRotate);
});
prevSlideButton.addEventListener("click", () => {
  switchSlide(-1);
});
nextSlideButton.addEventListener("click", () => {
  switchSlide(1);
});
secondaryAction.addEventListener("click", () => {
  specsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});
primaryAction.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
navToggle.addEventListener("click", () => {
  setNavOpen(!state.navOpen);
});

const revealObserver = new IntersectionObserver(revealOnScroll, {
  threshold: 0.2
});

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

navLinks.forEach((link) => {
  link.addEventListener("click", handleNavLinkClick);
});

syncResponsiveState();
applySlide(state.index);
