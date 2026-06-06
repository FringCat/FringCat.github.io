---
title: 博客搭建完成
date: 2026-06-06 12:00:00
tags:
  - 博客
categories:
  - 随笔
description: 用 Hexo + Redefine 搭建个人博客，并部署到 GitHub Pages。
---

欢迎来到 FringCat 的博客。

这个站点使用 [Hexo](https://hexo.io/) 与 [Redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 主题构建，支持明暗主题切换、流畅动画与 RSS 订阅。你可以在 `source/_posts/` 目录下新建 Markdown 文件来发布文章。

## 如何写新文章

在 `source/_posts/` 下创建 `.md` 文件，并在开头加上 frontmatter：

```yaml
---
title: 文章标题
date: 2026-06-06 12:00:00
tags:
  - 标签
categories:
  - 分类
description: 一句话摘要
---
```

保存后推送到 GitHub，Actions 会自动构建并发布。

## 为什么选静态博客

静态站点加载快、维护成本低，也足够安全。对于以文字为主的个人博客，这是很舒服的选择。

> 安静书写，自然生长。
