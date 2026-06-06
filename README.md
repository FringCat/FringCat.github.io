# FringCat 的博客

个人博客，基于 [Hugo](https://gohugo.io/) + [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 主题，托管于 [GitHub Pages](https://fringcat.github.io)。

## 本地开发

先安装 [Hugo Extended](https://gohugo.io/installation/)（PaperMod 需要 Extended 版本）：

```bash
# Windows（winget）
winget install Hugo.Hugo.Extended

# macOS
brew install hugo
```

克隆仓库后需初始化主题子模块：

```bash
git submodule update --init --recursive
```

启动本地预览：

```bash
npm run dev
# 或：hugo server -D
```

浏览器访问 http://localhost:1313

## 写文章

在 `content/posts/` 下新建 Markdown 文件：

```markdown
---
title: "标题"
date: 2026-06-07
draft: false
summary: "摘要"
tags: ["标签"]
categories: ["分类"]
---

正文内容...
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 https://fringcat.github.io

## 技术栈

- Hugo + PaperMod 主题
- GitHub Pages + GitHub Actions
- 明暗主题、站内搜索、RSS 订阅
