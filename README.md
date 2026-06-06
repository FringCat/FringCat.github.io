# FringCat 的博客

个人博客，基于 [Hexo](https://hexo.io/) + [Redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 主题，托管于 [GitHub Pages](https://fringcat.github.io)。

## 本地开发

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:4000

## 写文章

在 `source/_posts/` 下新建 Markdown 文件：

```markdown
---
title: 标题
date: 2026-06-07 12:00:00
tags:
  - 标签
categories:
  - 分类
description: 摘要
---

正文内容...
```

或使用 Hexo 命令创建：

```bash
npx hexo new "文章标题"
```

## 主题配置

站点配置在 `_config.yml`，Redefine 主题配置在 `_config.redefine.yml`（升级主题时不会被覆盖）。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 https://fringcat.github.io

## 技术栈

- Hexo + Redefine 主题
- GitHub Pages + GitHub Actions
- 明暗主题、流畅页面切换、RSS 订阅
