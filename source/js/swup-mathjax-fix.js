(function () {
  function whenMathJaxReady(fn) {
    if (!window.MathJax) {
      var el = document.getElementById('mathjax-script');
      if (el) {
        el.addEventListener('load', function () {
          whenMathJaxReady(fn);
        }, { once: true });
      } else {
        setTimeout(function () {
          whenMathJaxReady(fn);
        }, 50);
      }
      return;
    }

    if (window.MathJax.startup && window.MathJax.startup.promise) {
      window.MathJax.startup.promise.then(fn).catch(fn);
      return;
    }

    if (window.MathJax.typesetPromise) {
      fn();
      return;
    }

    setTimeout(function () {
      whenMathJaxReady(fn);
    }, 50);
  }

  function fixImages(root) {
    root.querySelectorAll('img[data-src]').forEach(function (img) {
      var src = img.getAttribute('data-src');
      if (src) img.src = src;
      img.removeAttribute('lazyload');
      img.removeAttribute('data-src');
    });
  }

  function typesetMath(root) {
    whenMathJaxReady(function () {
      if (!window.MathJax.typesetPromise) return;
      try {
        window.MathJax.typesetClear([root]);
      } catch (e) {}
      window.MathJax.typesetPromise([root]).catch(function () {});
    });
  }

  function refreshPostContent() {
    var root = document.getElementById('swup');
    if (!root) return;

    fixImages(root);

    var mathRoot = root.querySelector('.article-content') || root;
    typesetMath(mathRoot);
  }

  function scheduleRefresh() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        refreshPostContent();
        setTimeout(refreshPostContent, 120);
        setTimeout(refreshPostContent, 400);
      });
    });
  }

  function bindSwupHooks() {
    var swup = window.swup;
    if (!swup || !swup.hooks || window.__fringcatSwupBound) return;
    window.__fringcatSwupBound = true;
    swup.hooks.on('page:view', scheduleRefresh);
    swup.hooks.on('visit:end', scheduleRefresh);
    swup.hooks.on('content:replace', scheduleRefresh);
  }

  window.addEventListener('redefine:swup:ready', bindSwupHooks);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindSwupHooks();
      scheduleRefresh();
    });
  } else {
    bindSwupHooks();
    scheduleRefresh();
  }
})();
