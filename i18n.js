// ==========================================
// i18n.js — سیستم دوزبانه (EN / FA)
// ==========================================

const DEFAULT_LANG = 'en';
const RTL_LANGS = ['fa', 'ar', 'he'];

let translationsCache = null;

/* -----------------------------------------
   لود کردن فایل ترجمه (فقط یک بار)
----------------------------------------- */
async function loadTranslations() {
  if (translationsCache) return translationsCache;

  const response = await fetch('translations.json');
  if (!response.ok) {
    throw new Error('translations.json not found');
  }

  translationsCache = await response.json();
  return translationsCache;
}

/* -----------------------------------------
   اعمال ترجمه روی یک عنصر
----------------------------------------- */
function applyTranslation(el, value) {
  // 1) اگر placeholder دارد → فقط placeholder را عوض کن
  if (el.hasAttribute('placeholder')) {
    el.setAttribute('placeholder', value);
    return;
  }

  // 2) اگر aria-label دارد و فرزند داخلی ندارد → فقط aria-label را عوض کن
  if (el.hasAttribute('aria-label') && el.children.length === 0) {
    el.setAttribute('aria-label', value);
    return;
  }

  // 3) اگر داخلش عنصری با data-lang-key هست → خودش جدا ترجمه می‌شود
  if (el.querySelector('[data-lang-key]')) {
    return;
  }

     // 4) اگر <a> یا <button> است → فقط متن‌های مستقیم را عوض کن،
  //    آیکون‌ها (مثل → و ▶) و عناصر data-lang-key داخلی دست‌نخورده بمانند
  if (el.tagName === 'A' || el.tagName === 'BUTTON') {

    // اگه داخلش عنصر data-lang-key داره، ترجمه‌ی خودش جدا انجام میشه
    if (el.querySelector('[data-lang-key]')) {
      return;
    }

    // فقط TextNodeهای مستقیم (نه داخل span) رو ترجمه کن
    const textNodes = Array.from(el.childNodes).filter(
      node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
    );

    if (textNodes.length > 0) {
      textNodes[0].textContent = value;
      return;
    }
  }

  // 5) حالت پیش‌فرض → کل متن عنصر را عوض کن
  el.textContent = value;
}

/* -----------------------------------------
   تغییر زبان
----------------------------------------- */
async function setLanguage(lang) {
  try {
    const translations = await loadTranslations();
    const texts = translations[lang];

    if (!texts) {
      console.warn('Language not found:', lang);
      return;
    }

    // ترجمه همه عناصر دارای data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      const value = texts[key];
      if (!value) return;
      applyTranslation(el, value);
    });

    // ذخیره در localStorage
    localStorage.setItem('siteLang', lang);

    // تنظیم lang و dir روی <html>
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute(
      'dir',
      RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
    );

    // آپدیت دکمه‌های زبان
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

  } catch (error) {
    console.error('Translation error:', error);
  }
}

/* -----------------------------------------
   فعال‌سازی انیمیشن reveal هنگام اسکرول
----------------------------------------- */
function setupRevealAnimation() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* -----------------------------------------
   راه‌اندازی اولیه
----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // زبان ذخیره‌شده یا زبان مرورگر
  const savedLang =
    localStorage.getItem('siteLang') ||
    (navigator.language.startsWith('fa') ? 'fa' : DEFAULT_LANG);

  setLanguage(savedLang);

  // کلیک روی دکمه‌های زبان
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      if (lang) setLanguage(lang);
    });
  });

  // انیمیشن reveal
  setupRevealAnimation();
});

/* =========================================
   SIDE MENU (سه‌خطی گوشه)
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('sideMenuToggle');
  const menu = document.getElementById('sideMenu');
  const backdrop = document.getElementById('sideMenuBackdrop');

  if (!toggle || !menu || !backdrop) return;

  function openMenu() {
    menu.classList.add('active');
    backdrop.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('active');
    backdrop.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});
