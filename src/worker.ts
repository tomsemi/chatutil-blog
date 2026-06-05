interface Env {
  ASSETS: Fetcher;
  PV_COUNTER: DurableObjectNamespace;
}

type PageViewPayload = {
  path?: string;
};

export class PageViewCounter {
  constructor(private state: DurableObjectState) {}

  async fetch(request: Request) {
    const url = new URL(request.url);
    const path = await getPathFromRequest(request, url);

    if (!path) {
      return json({ error: "Missing path" }, 400);
    }

    if (request.method === "POST") {
      const views = await this.increment(path);
      return json({ path, views });
    }

    if (request.method === "GET") {
      const views = await this.get(path);
      return json({ path, views });
    }

    return json({ error: "Method not allowed" }, 405);
  }

  private async increment(path: string) {
    const key = getCounterKey(path);

    return this.state.storage.transaction(async (txn) => {
      const current = (await txn.get<number>(key)) ?? 0;
      const next = current + 1;
      await txn.put(key, next);
      return next;
    });
  }

  private async get(path: string) {
    return (await this.state.storage.get<number>(getCounterKey(path))) ?? 0;
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/api/pv") {
      return getPageViews(request, env);
    }

    const response = await env.ASSETS.fetch(request);

    if (shouldTrackPageView(request, response, url)) {
      ctx.waitUntil(trackPageView(url.pathname, env));
    }

    return response;
  },
};

function shouldTrackPageView(request: Request, response: Response, url: URL) {
  if (request.method !== "GET") {
    return false;
  }

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_astro/")) {
    return false;
  }

  if (url.pathname === "/rss.xml" || url.pathname === "/robots.txt" || url.pathname.startsWith("/sitemap")) {
    return false;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  return response.ok && contentType.includes("text/html");
}

function getCounterStub(env: Env) {
  return env.PV_COUNTER.get(env.PV_COUNTER.idFromName("global"));
}

async function trackPageView(path: string, env: Env) {
  await getCounterStub(env).fetch("https://pv-counter.internal/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: normalizePath(path) }),
  });
}

function getPageViews(request: Request, env: Env) {
  const url = new URL(request.url);
  const path = normalizePath(url.searchParams.get("path") ?? "/");
  return getCounterStub(env).fetch(`https://pv-counter.internal/stats?path=${encodeURIComponent(path)}`);
}

async function getPathFromRequest(request: Request, url: URL) {
  if (request.method === "POST") {
    const payload = await request.json<PageViewPayload>().catch((): PageViewPayload => ({}));
    return normalizePath(payload.path);
  }

  return normalizePath(url.searchParams.get("path"));
}

function normalizePath(path?: string | null) {
  if (!path || !path.startsWith("/")) {
    return "/";
  }

  return path.replace(/\/{2,}/g, "/");
}

function getCounterKey(path: string) {
  return `pv:${path}`;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
