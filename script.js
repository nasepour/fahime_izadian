/* =====================================
SIDE MENU (برای صفحه تماس)
===================================== */

const sideMenuToggle = document.getElementById("sideMenuToggle");
const sideMenu = document.getElementById("sideMenu");
const sideMenuBackdrop = document.getElementById("sideMenuBackdrop");
const sideMenuLinks = document.querySelectorAll(".side-menu a");

if (sideMenuToggle && sideMenu) {
  sideMenuToggle.addEventListener("click", () => {
    const isOpen = sideMenu.classList.toggle("active");
    sideMenuToggle.setAttribute("aria-expanded", isOpen);
  });
}

if (sideMenuBackdrop) {
  sideMenuBackdrop.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    if (sideMenuToggle) sideMenuToggle.setAttribute("aria-expanded", "false");
  });
}

sideMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    if (sideMenuToggle) sideMenuToggle.setAttribute("aria-expanded", "false");
  });
});

/* =====================================
MOBILE MENU (برای صفحات دیگر)
===================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    const isOpen = mobileNav.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* =====================================
HEADER SCROLL EFFECT
===================================== */

const header = document.querySelector(".header");

if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* =====================================
SCROLL REVEAL ANIMATION
===================================== */

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =====================================
NEWSLETTER FORM (برای صفحات دیگر)
===================================== */

const newsletterForm = document.querySelector(".newsletter-form");
const formMessage = document.querySelector(".form-message");

if (newsletterForm && formMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterForm.querySelector("input").value;
    if (!email) {
      formMessage.textContent = "Please enter your email address.";
      return;
    }
    formMessage.textContent = "Thank you! Your subscription was successful.";
    newsletterForm.reset();
  });
}

/* =====================================
SMOOTH ACTIVE NAVIGATION (برای صفحه اصلی)
===================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".desktop-nav a");

if (sections.length && navLinks.length) {
  window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.style.opacity = "1";
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.style.opacity = "0.5";
      }
    });
  });
}

/* =====================================
HOMEPAGE VIDEO PLAYER
===================================== */

const homepageVideosSection = document.querySelector('section#videos.feature-section');

if (homepageVideosSection) {
  const videoFeature = homepageVideosSection.querySelector(".video-feature");
  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const modalVideoSource = document.getElementById("modalVideoSource");
  const videoModalClose = document.getElementById("videoModalClose");
  const videoModalBackdrop = document.querySelector(".video-modal-backdrop");

  if (videoFeature && videoModal && modalVideo && modalVideoSource) {
    videoFeature.addEventListener("click", function () {
      const videoPath = videoFeature.getAttribute("data-video");
      if (!videoPath) return;
      modalVideoSource.src = videoPath;
      modalVideo.load();
      videoModal.classList.add("active");
      document.body.classList.add("video-open");
      modalVideo.play().catch(() => {});
    });

    function closeHomepageVideo() {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideoSource.src = "";
      videoModal.classList.remove("active");
      document.body.classList.remove("video-open");
    }

    if (videoModalClose) videoModalClose.addEventListener("click", closeHomepageVideo);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener("click", closeHomepageVideo);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && videoModal.classList.contains("active")) {
        closeHomepageVideo();
      }
    });
  }
}

/* =========================
   CLASSES FILTER
========================== */

const filterBtns = document.querySelectorAll('.filter-btn');
const classCards = document.querySelectorAll('.class-card');

if (filterBtns.length && classCards.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      classCards.forEach((card) => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* =========================
   COUNTDOWN TIMER
========================== */

const countdownEl = document.getElementById('countdown');

if (countdownEl) {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  targetDate.setHours(16, 0, 0, 0);

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(minutes).padStart(2, '0');
    cdSecs.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
/* =====================================
PROTECTION: DISABLE RIGHT CLICK & DRAG
===================================== */

// غیرفعال کردن کلیک راست (برای همه چیز)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// غیرفعال کردن کشیدن و رها کردن عکس‌ها
document.addEventListener('dragstart', function(e) {
    if (e.target.nodeName === 'IMG') {
        e.preventDefault();
    }
});

// غیرفعال کردن کلیدهای میانبر ذخیره (Ctrl+S / Cmd+S)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
    }
});

/* =====================================
PROTECTION: DISABLE VIDEO DOWNLOAD BUTTON
===================================== */

// حذف دکمه دانلود از تمام ویدیوها (حتی ویدیوهایی که بعداً اضافه می‌شوند)
function disableVideoDownload() {
    const videos = document.querySelectorAll('video');
    videos.forEach(function(video) {
        video.setAttribute('controlsList', 'nodownload');
        // اگر ویدیو در حال پخش است، دکمه دانلود مخفی می‌شود
    });
}

// اجرا در بارگذاری اولیه
disableVideoDownload();

// اجرا مجدد وقتی ویدیو جدیدی به صفحه اضافه می‌شود (مثل مودال)
const videoObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            disableVideoDownload();
        }
    });
});

// نظارت بر تغییرات DOM
videoObserver.observe(document.body, { childList: true, subtree: true });
