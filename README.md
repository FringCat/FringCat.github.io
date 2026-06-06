# FringCat 的博客

简约自然的个人博客，基于 [Astro](https://astro.build) 构建，托管于 [GitHub Pages](https://fringcat.github.io)。

## 本地开发

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:4321

## 写文章

在 `src/content/blog/` 下新建 Markdown 文件：

```markdown
---
title: '标题'
description: '摘要'
pubDate: 2026-06-06
---

正文内容...
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 https://fringcat.github.io

## 技术栈

- Astro + MDX
- GitHub Pages + GitHub Actions
- 简约自然风格 UI
