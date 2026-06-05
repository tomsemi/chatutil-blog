---
title: "我想要的写作流程"
description: "先用 Markdown 和 Git 保持简单，等内容多了再考虑 CMS。"
date: 2026-06-05
tags: ["writing", "markdown", "workflow"]
---

第一版博客不需要后台，也不需要 CMS。

最简单的流程就是在本地写 Markdown：

```text
src/content/notes/my-note.md
```

然后提交代码，部署到 Cloudflare Pages。

## 为什么先不接 CMS

CMS 会让发布文章更像使用后台，但也会引入新的维护成本：

- 内容模型要设计
- 登录和权限要处理
- 图片上传要处理
- 部署和预览要重新串起来

现在真正重要的是先开始写。

## 后面可以升级什么

等文章多了之后，可以再考虑：

- 全文搜索
- 按年份归档
- 更细的标签页
- 自动生成 Open Graph 图片
- 接入评论或留言

这些都不是第一天必须做的事情。
