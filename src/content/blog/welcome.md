---
title: '博客搭建完成'
description: '用 Astro 搭建简约个人博客，并部署到 GitHub Pages。'
pubDate: 2026-06-06
---

欢迎来到 FringCat 的博客。

这个站点使用 [Astro](https://astro.build) 构建，风格偏向简约与自然：米白背景、衬线字体、足够的留白。你可以直接在 `src/content/blog/` 目录下新建 Markdown 文件来发布文章。

## 如何写新文章

在 `src/content/blog/` 下创建 `.md` 文件，并在开头加上 frontmatter：

```yaml
---
title: '文章标题'
description: '一句话摘要'
pubDate: 2026-06-06
---
```

保存后推送到 GitHub，Actions 会自动构建并发布。

## 为什么选静态博客

静态站点加载快、维护成本低，也足够安全。对于以文字为主的个人博客，这是很舒服的选择。

> 安静书写，自然生长。
