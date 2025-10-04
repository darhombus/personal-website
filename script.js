// ====== DOM Elements ======
const nav = document.querySelector("nav");
const menuToggle = document.getElementById("menu-toggle");
const navLinksUL = document.getElementById("nav-links");
const navAnchors = document.querySelectorAll("#nav-links a");
const sections = document.querySelectorAll("section");

// ====== Mobile Menu Toggle ======
menuToggle.addEventListener("click", () => {
  navLinksUL.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// ====== Navbar Shrink on Scroll ======
function handleNavShrink() {
  nav.classList.toggle("shrink", window.scrollY > 50);
}

// ====== Smooth Scroll (custom easing) ======
function getNavHeight() {
  return nav.offsetHeight;
}

function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  function easeInOutQuad(t) {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  }

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(progress);

    window.scrollTo(0, startY + diff * eased);

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function scrollToSection(target) {
  const navHeight = getNavHeight();
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 2;
  smoothScrollTo(targetTop);
}

navAnchors.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    // Close mobile menu
    navLinksUL.classList.remove("active");
    menuToggle.classList.remove("active");

    const willShrink = !nav.classList.contains("shrink") && window.scrollY < 50;

    if (willShrink) {
      nav.addEventListener("transitionend", function scrollAfterShrink() {
        scrollToSection(target);
        nav.removeEventListener("transitionend", scrollAfterShrink);
      });
      nav.classList.add("shrink");
    } else {
      scrollToSection(target);
    }
  });
});

// ====== Active Section Highlight ======
function updateActiveNav() {
  const offset = getNavHeight();
  const scrollPos = window.scrollY + offset + 2;
  let currentId = "";

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      currentId = section.id;
    }
  });

  navAnchors.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

// ====== Event Listeners ======
window.addEventListener("scroll", () => {
  handleNavShrink();
  updateActiveNav();
}, { passive: true });

window.addEventListener("resize", updateActiveNav);
window.addEventListener("load", () => {
  handleNavShrink();
  updateActiveNav();
});

// ====== Lightbox ======
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightbox-content");
const caption = document.getElementById("caption");
const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const images = document.querySelectorAll(".lightbox-img");
let currentIndex = 0;

function showImage(index) {
  if (!images[index]) return;
  lightboxContent.src = images[index].src;
  caption.textContent = images[index].alt || "";
  currentIndex = index;
}

images.forEach((img, i) => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    showImage(i);
  });
});

closeBtn.addEventListener("click", () => (lightbox.style.display = "none"));
prevBtn.addEventListener("click", () => showImage((currentIndex - 1 + images.length) % images.length));
nextBtn.addEventListener("click", () => showImage((currentIndex + 1) % images.length));

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.style.display = "none";
});

document.addEventListener("keydown", e => {
  if (lightbox.style.display !== "flex") return;
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "Escape") closeBtn.click();
});
