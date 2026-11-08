(function () {
  var STORAGE_KEY = 'site-lang';
  var DEFAULT_LANG = 'en';

  var UI = {
    en: {
      Research: 'Research',
      Portfolio: 'Portfolio',
      Posts: 'Posts',
      Biography: 'Biography',
      Home: 'Home',
      CV: 'CV',
      Menu: 'Menu',
      'Jump to:': 'Jump to:',
      'Navigation:': 'Navigation:',
      About: 'About',
      'Continue reading': 'Continue reading',
      'back to top': 'Back to top'
    },
    zh: {
      Research: '研究',
      Portfolio: '作品',
      Posts: '文章',
      Biography: '简介',
      Home: '首页',
      CV: '简历',
      Menu: '菜单',
      'Jump to:': '跳转到：',
      'Navigation:': '导航：',
      About: '关于',
      'Continue reading': '继续阅读',
      'back to top': '回到顶部'
    }
  };

  function preferredLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setPreferredLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function pageLang() {
    var btn = document.getElementById('langSwitcher');
    if (btn && btn.dataset.pageLang) return btn.dataset.pageLang;
    var htmlLang = document.documentElement.lang;
    return htmlLang ? htmlLang.slice(0, 2) : DEFAULT_LANG;
  }

  function translationUrl() {
    var btn = document.getElementById('langSwitcher');
    var url = btn && btn.dataset.translationUrl;
    return url && url.trim() ? url.trim() : '';
  }

  function hasInPagePairs() {
    return document.querySelector('[data-lang="en"]') && document.querySelector('[data-lang="zh"]');
  }

  function applyInPageLang(lang) {
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      var match = el.getAttribute('data-lang') === lang;
      el.hidden = !match;
      el.setAttribute('aria-hidden', match ? 'false' : 'true');
    });
  }

  function applyNavLabels(lang) {
    var dict = UI[lang] || UI.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
  }

  function updateSwitcherUI(lang) {
    var btn = document.getElementById('langSwitcher');
    if (!btn) return;
    btn.dataset.activeLang = lang;
    btn.querySelectorAll('.lang-switcher__label').forEach(function (label) {
      label.hidden = label.getAttribute('data-show-when') !== lang;
    });
    document.documentElement.lang = lang;
  }

  function applyLang(lang, options) {
    options = options || {};
    setPreferredLang(lang);
    applyNavLabels(lang);
    updateSwitcherUI(lang);

    if (hasInPagePairs()) {
      applyInPageLang(lang);
      return;
    }

    var alt = translationUrl();
    var current = pageLang();
    if (options.navigate && alt && lang !== current) {
      window.location.href = alt;
    }
  }

  function otherLang(lang) {
    return lang === 'zh' ? 'en' : 'zh';
  }

  function googleTranslateUrl(targetLang) {
    var pageUrl = window.location.href.split('#')[0];
    var tl = targetLang === 'zh' ? 'zh-CN' : 'en';
    return 'https://translate.google.com/translate?sl=auto&tl=' + tl + '&u=' + encodeURIComponent(pageUrl);
  }

  function onSwitchClick() {
    var currentPreferred = preferredLang();
    var next = otherLang(currentPreferred);

    if (hasInPagePairs()) {
      applyLang(next);
      return;
    }

    var alt = translationUrl();
    var current = pageLang();
    if (alt && next !== current) {
      setPreferredLang(next);
      window.location.href = alt;
      return;
    }

    // No static translation: open Google Translate of this page (crawlable alternate is still preferred via hreflang when available).
    setPreferredLang(next);
    window.open(googleTranslateUrl(next), '_blank', 'noopener');
  }

  function init() {
    var lang = preferredLang();
    var current = pageLang();

    // If user prefers the other language and this page has a static alternate, follow it once.
    var alt = translationUrl();
    if (alt && lang !== current && !sessionStorage.getItem('i18n-skip-redirect')) {
      sessionStorage.setItem('i18n-skip-redirect', '1');
      window.location.replace(alt);
      return;
    }
    sessionStorage.removeItem('i18n-skip-redirect');

    if (hasInPagePairs()) {
      applyLang(lang);
    } else {
      applyNavLabels(lang);
      updateSwitcherUI(current);
      // Keep button showing the language you can switch TO
      updateSwitcherUI(current);
    }

    var btn = document.getElementById('langSwitcher');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', onSwitchClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var pushRoot = document.getElementById('_yPushState');
  if (pushRoot) {
    pushRoot.addEventListener('y-push-state-load', init);
  }
})();
