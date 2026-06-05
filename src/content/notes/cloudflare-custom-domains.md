---
title: "Cloudflare Custom Domain 的一个小结"
description: "Worker 和 Pages 都能绑定自定义域名，但适合的场景不一样。"
date: 2026-06-05
tags: ["cloudflare", "domains", "worker"]
---

最近整理几个产品域名时，又重新看了一遍 Cloudflare 的 Custom Domain。

一个简单判断：

- 静态博客、官网、文档站，优先 Pages
- API、WebSocket、Durable Object，优先 Worker
- 如果一个站既要静态页面，又要复杂请求逻辑，可以用 Worker Static Assets

## 为什么博客用 Pages

博客本质上是静态内容：Markdown 写文章，构建成 HTML，部署后让搜索引擎直接抓取完整页面。

Pages 的工作流更接近这个需求：

```text
写 Markdown -> Git push -> build -> deploy
```

不需要让每个请求都进入 Worker 代码。

## 为什么 remote 继续用 Worker

Remote control 页面不只是静态页面。它还需要 WebSocket 和 Durable Object 来维护房间连接。

这种请求级别的控制适合 Worker，而不是普通 Pages。

所以现在比较清晰的划分是：

```text
blog.chatutil.top   -> Pages
remote.chatutil.top -> Worker
api.chatutil.top    -> Worker
```
