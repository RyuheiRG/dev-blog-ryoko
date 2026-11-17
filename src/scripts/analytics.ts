type MetricsConfig = {
  url?: string;
  key?: string;
  debug?: boolean;
};

declare global {
  interface Window {
    __RYOKO_METRICS__?: MetricsConfig;
  }
}

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const config = window.__RYOKO_METRICS__;

if (config?.url && config?.key) {
  const nav = navigator as NavigatorWithConnection;
  const disabled = navigator.doNotTrack === "1" || nav.connection?.saveData === true;

  if (!disabled) {
    const track = (input: Record<string, unknown>) => {
      const payload = {
        query: `mutation Track($input: TrackEventInput!) {
          trackEvent(input: $input) { ok event_id duplicate }
        }`,
        variables: { input },
      };

      fetch(config.url as string, {
        method: "POST",
        keepalive: true,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Site-Key": config.key as string,
        },
        body: JSON.stringify(payload),
      }).catch((error: unknown) => {
        if (config.debug) console.warn("[ryoko:metrics]", error);
      });
    };

    const sessionKey = "ryoko_sid";
    let sessionId = "";
    try {
      sessionId = sessionStorage.getItem(sessionKey) ?? "";
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionKey, sessionId);
      }
    } catch {
      sessionId = crypto.randomUUID();
    }

    const eventId = () => crypto.randomUUID();
    const now = () => new Date().toISOString();

    const projectSlug = (path: string) => {
      const match = /^\/proyectos\/([^/]+)/.exec(path);
      return match?.[1];
    };

    const postSlug = (path: string) => {
      const match = /^\/blog\/([^/]+)/.exec(path);
      return match?.[1];
    };

    const path = window.location.pathname;
    const base = {
      path,
      referrer: document.referrer || undefined,
      session_id: sessionId,
      occurred_at: now(),
    };

    if (path === "/") {
      track({ event_id: eventId(), type: "PAGE_VIEW", ...base });
    } else if (postSlug(path)) {
      track({ event_id: eventId(), type: "POST_VIEW", post_slug: postSlug(path), ...base });
    } else if (projectSlug(path)) {
      track({
        event_id: eventId(),
        type: "PROJECT_VIEW",
        project_slug: projectSlug(path),
        ...base,
      });
    } else {
      track({ event_id: eventId(), type: "PAGE_VIEW", ...base });
    }

    document.addEventListener("click", (event) => {
      const target = (event.target as Element | null)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href") ?? "";
      if (!/^https?:\/\//.test(href)) return;

      track({
        event_id: eventId(),
        type: "OUTBOUND_CLICK",
        ...base,
        occurred_at: now(),
        project_slug: projectSlug(window.location.pathname),
        properties: { url: href },
      });
    });
  }
}

export {};
