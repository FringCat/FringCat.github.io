/* global hexo */

hexo.extend.filter.register('after_render:html', function (data) {
  if (!data || typeof data !== 'string' || !data.includes('</body>')) {
    return data;
  }

  const snippet = [
    '<script>',
    'window.MathJax = {',
    '  tex: {',
    "    inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],",
    "    displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],",
    '    processEscapes: true',
    '  },',
    "  options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }",
    '};',
    '</script>',
    '<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" id="mathjax-script"></script>',
    '<script defer src="/js/swup-mathjax-fix.js"></script>',
  ].join('\n');

  return data.replace('</body>', function () {
    return snippet + '\n</body>';
  });
});
