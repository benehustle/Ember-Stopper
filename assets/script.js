// 1) loadIncludes()
async function loadIncludes() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch("includes/header.html"),
      fetch("includes/footer.html")
    ]);

    if (headerPlaceholder && headerRes.ok) {
      headerPlaceholder.innerHTML = await headerRes.text();
    }
    if (footerPlaceholder && footerRes.ok) {
      footerPlaceholder.innerHTML = await footerRes.text();
    }
  } catch (error) {
    console.error("Include loading failed:", error);
  } finally {
    initNav();
    setActiveNavLink();
  }
}

// 2) initNav()
function initNav() {
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".nav-drawer");
  const overlay = document.querySelector(".nav-overlay");
  const drawerLinks = document.querySelectorAll(".nav-drawer a");
  const desktopServicesItem = document.querySelector(".nav__item--services");
  const desktopServicesToggle = document.querySelector(".nav__services-toggle");
  const mobileServicesItem = document.querySelector(".nav__mobile-services");
  const mobileServicesToggle = document.querySelector(".nav__mobile-services-toggle");

  const closeDrawer = () => {
    if (!drawer || !overlay) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const openDrawer = () => {
    if (!drawer || !overlay) return;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeDrawer);
  }

  if (desktopServicesItem && desktopServicesToggle) {
    const closeDesktopServices = () => {
      desktopServicesItem.classList.remove("is-open");
      desktopServicesToggle.setAttribute("aria-expanded", "false");
    };
    const openDesktopServices = () => {
      desktopServicesItem.classList.add("is-open");
      desktopServicesToggle.setAttribute("aria-expanded", "true");
    };
    desktopServicesToggle.addEventListener("click", (event) => {
      event.preventDefault();
      if (desktopServicesItem.classList.contains("is-open")) {
        closeDesktopServices();
      } else {
        openDesktopServices();
      }
    });
    document.addEventListener("click", (event) => {
      if (!desktopServicesItem.contains(event.target)) {
        closeDesktopServices();
      }
    });
    window.addEventListener("scroll", closeDesktopServices, { passive: true });
  }

  if (mobileServicesItem && mobileServicesToggle) {
    mobileServicesToggle.addEventListener("click", () => {
      const isOpen = mobileServicesItem.classList.toggle("is-open");
      mobileServicesToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// 3) setActiveNavLink()
function setActiveNavLink() {
  const rawPath = window.location.pathname.split("/").pop() || "index.html";
  const currentPath = rawPath === "" ? "index.html" : rawPath;
  const navLinks = document.querySelectorAll(".nav__link, .nav__mobile-link, .nav__submenu-link, .nav__mobile-sublink");
  const servicePages = new Set([
    "services.html",
    "ember-stopper-home-cover-system.html",
    "product-supply-delivery.html",
    "installation-guidance-support.html",
    "bushfire-preparedness-consulting.html",
    "property-risk-assessment.html"
  ]);

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const cleanHref = href.replace("./", "");
    if (cleanHref === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (servicePages.has(currentPath)) {
    const desktopServicesItem = document.querySelector(".nav__item--services");
    const mobileServicesItem = document.querySelector(".nav__mobile-services");
    const desktopServicesToggle = document.querySelector(".nav__services-toggle");
    const mobileServicesToggle = document.querySelector(".nav__mobile-services-toggle");
    if (desktopServicesItem) {
      desktopServicesItem.classList.add("is-open");
    }
    if (desktopServicesToggle) {
      desktopServicesToggle.classList.add("active");
      desktopServicesToggle.setAttribute("aria-expanded", "true");
    }
    if (mobileServicesItem) {
      mobileServicesItem.classList.add("is-open");
    }
    if (mobileServicesToggle) {
      mobileServicesToggle.classList.add("active");
      mobileServicesToggle.setAttribute("aria-expanded", "true");
    }
  }
}

// 4) initSmoothScroll()
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });
}

// 5) initScrollAnimations()
function initScrollAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
  document.querySelectorAll(".animate-stagger").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
      observer.observe(child);
    });
  });
}

// 6) initCounters()
function initCounters() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".stat-number").forEach((el) => {
      el.textContent = el.dataset.target + (el.dataset.suffix || "");
    });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals, 10) || 0;
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + (progress === 1 ? suffix : "");
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-number").forEach((el) => observer.observe(el));
}

// 7) initCallBar()
function initCallBar() {
  const callBar = document.querySelector(".call-bar");
  if (!callBar) return;

  const dismissed = sessionStorage.getItem("callBarDismissed");
  if (dismissed === "true") return;

  setTimeout(() => {
    callBar.classList.add("is-visible");
  }, 2000);

  const dismissBtn = callBar.querySelector(".call-bar__dismiss");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      callBar.classList.remove("is-visible");
      sessionStorage.setItem("callBarDismissed", "true");
    });
  }
}

// 8) initContactForm() — Netlify Forms: https://docs.netlify.com/manage/forms/setup/
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successEl = document.getElementById("formSuccess");
  const submitBtn = form.querySelector('button[type="submit"]');
  const action = form.getAttribute("action") || "/";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    if (submitBtn) submitBtn.disabled = true;
    if (successEl) successEl.hidden = true;

    fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Form submission failed");
        form.reset();
        if (successEl) {
          successEl.hidden = false;
          successEl.textContent =
            "Thanks — we'll be in touch soon! For urgent enquiries you can email info@emberstopper.com.";
        }
      })
      .catch(() => {
        if (successEl) {
          successEl.hidden = false;
          successEl.textContent =
            "Something went wrong. Please try again or email info@emberstopper.com directly.";
        }
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

// 9) initFaq()
function initFaq() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  items.forEach((item) => {
    const summary = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");
    if (!summary || !answer) return;

    if (item.open) {
      answer.style.height = `${answer.scrollHeight}px`;
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = item.open;

      if (isOpen) {
        answer.style.height = `${answer.scrollHeight}px`;
        requestAnimationFrame(() => {
          answer.style.height = "0px";
          setTimeout(() => {
            item.open = false;
          }, 250);
        });
      } else {
        item.open = true;
        answer.style.height = "0px";
        requestAnimationFrame(() => {
          answer.style.height = `${answer.scrollHeight}px`;
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadIncludes();
  initSmoothScroll();
  initScrollAnimations();
  initCounters();
  initCallBar();
  initContactForm();
  initFaq();
});
