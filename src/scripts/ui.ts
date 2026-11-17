const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Header: solid after leaving the very top. */
const header = document.querySelector<HTMLElement>("[data-site-header]");
if (header?.dataset.transparent === "true") {
  const updateHeader = () => {
    header.classList.toggle("is-solid", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* Mobile menu. */
const menu = document.querySelector<HTMLDialogElement>("[data-mobile-menu]");
const openButton = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const closeButtons = document.querySelectorAll<HTMLButtonElement>("[data-menu-close]");

openButton?.addEventListener("click", () => menu?.showModal());
closeButtons.forEach((button) => button.addEventListener("click", () => menu?.close()));
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.close()));

/* Copy code blocks. */
document.querySelectorAll<HTMLElement>(".prose pre").forEach((pre) => {
  pre.tabIndex = 0;
  const code = pre.querySelector("code");
  if (!code) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy";
  button.textContent = "Copiar";
  button.setAttribute("aria-label", "Copiar bloque de código");

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.innerText);
      button.textContent = "Copiado";
      window.setTimeout(() => {
        button.textContent = "Copiar";
      }, 1800);
    } catch {
      button.textContent = "Error";
    }
  });

  pre.appendChild(button);
});

/* Copy the current link. */
document.querySelectorAll<HTMLButtonElement>("[data-copy-link]").forEach((button) => {
  const original = button.querySelector("[data-copy-label]")?.textContent ?? "Copiar link";
  button.addEventListener("click", async () => {
    const label = button.querySelector("[data-copy-label]");
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (label) label.textContent = "Copiado";
      window.setTimeout(() => {
        if (label) label.textContent = original;
      }, 1800);
    } catch {
      if (label) label.textContent = "No se pudo copiar";
    }
  });
});

/* Reveal on scroll. */
const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
if (!reduceMotion && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          reveal.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  revealItems.forEach((element) => reveal.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add("is-in"));
}

/* TOC active heading. */
const toc = document.querySelector<HTMLElement>("[data-toc]");
if (toc) {
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const entries = links
    .map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const heading = document.getElementById(id);
      return heading ? { link, heading, id } : null;
    })
    .filter((entry): entry is { link: HTMLAnchorElement; heading: HTMLElement; id: string } =>
      Boolean(entry),
    );

  if (entries.length > 0) {
    let activeId = "";
    let raf = 0;

    const setActive = (id: string) => {
      if (id === activeId) return;
      activeId = id;
      links.forEach((link) => {
        const active = decodeURIComponent(link.hash.slice(1)) === id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    const update = () => {
      raf = 0;
      const offset = 160;
      let current = entries[0];
      for (const entry of entries) {
        if (entry.heading.getBoundingClientRect().top <= offset) current = entry;
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = entries[entries.length - 1];
      if (current) setActive(current.id);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
}

/* Hero sequence. */
const hero = document.querySelector<HTMLElement>("[data-hero]");
if (hero && !reduceMotion) {
  const stage1 = hero.querySelector<HTMLElement>("[data-hero-stage='1']");
  const stage2 = hero.querySelector<HTMLElement>("[data-hero-stage='2']");
  const stage3 = hero.querySelector<HTMLElement>("[data-hero-stage='3']");
  const portrait = hero.querySelector<HTMLElement>("[data-hero-portrait]");
  const title = hero.querySelector<HTMLElement>("[data-hero-title]");
  const mark = hero.querySelector<HTMLElement>("[data-hero-mark]");
  const crows = Array.from(hero.querySelectorAll<HTMLElement>("[data-crow]"));

  let raf = 0;
  let isVisible = true;

  const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (edge0: number, edge1: number, value: number) => {
    const t = clamp((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };
  const setOpacity = (element: HTMLElement | null, value: number) => {
    if (element) element.style.opacity = clamp(value).toFixed(3);
  };

  const update = () => {
    raf = 0;
    const rect = hero.getBoundingClientRect();
    const distance = hero.offsetHeight - window.innerHeight;
    const progress = clamp(-rect.top / Math.max(1, distance));

    /* Las etapas no se enciman: cada una termina antes de que empiece la siguiente. */
    setOpacity(stage1, 1 - smooth(0.16, 0.3, progress));
    setOpacity(stage2, smooth(0.3, 0.42, progress) * (1 - smooth(0.64, 0.76, progress)));
    setOpacity(stage3, smooth(0.76, 0.88, progress));

    if (portrait) {
      const x = 8 * (1 - smooth(0, 0.28, progress));
      const scale = 1 + 0.04 * smooth(0, 0.3, progress);
      portrait.style.transform = `translate3d(${x}%, 0, 0) scale(${scale})`;
    }
    if (title) {
      title.style.transform = `translate3d(0, ${-5 * smooth(0, 0.28, progress)}%, 0)`;
    }
    if (mark) {
      const scale = 0.9 + 0.1 * smooth(0.3, 0.62, progress);
      mark.style.transform = `scale(${scale})`;
    }
    crows.forEach((crow, index) => {
      const shift = (progress - 0.76) * (180 + index * 110);
      crow.style.transform = `translate3d(${shift}%, 0, 0)`;
    });
  };

  const onScroll = () => {
    if (raf || !isVisible) return;
    raf = window.requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        if (isVisible) onScroll();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(hero);
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}
