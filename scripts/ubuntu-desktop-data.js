/* global hexo */

'use strict';

hexo.extend.generator.register('ubuntu-desktop-data', function (locals) {
  const posts = locals.posts.sort('-date').toArray().filter((post) => !post.page);

  const categories = {};

  posts.forEach((post) => {
    const cats = post.categories.length ? post.categories.toArray() : [{ name: '未分类' }];
    cats.forEach((cat) => {
      if (!categories[cat.name]) {
        categories[cat.name] = { name: cat.name, posts: [] };
      }
      categories[cat.name].posts.push({
        title: post.title,
        path: post.path,
        date: post.date.format('YYYY-MM-DD'),
      });
    });
  });

  const payload = {
    site: hexo.config.title || 'Blog',
    posts: posts.map((post) => ({
      title: post.title,
      path: post.path,
      date: post.date.format('YYYY-MM-DD'),
      categories: post.categories.length
        ? post.categories.toArray().map((c) => c.name)
        : ['未分类'],
      tags: post.tags.toArray().map((t) => t.name),
    })),
    categories: Object.values(categories),
  };

  return {
    path: 'ubuntu-posts.json',
    data: JSON.stringify(payload),
  };
});
