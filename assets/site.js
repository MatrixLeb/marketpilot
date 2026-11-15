/* MarketPilot site — navigation, docs search and copy helpers. */
(() => {
  "use strict";

  const root = document.body.dataset.root || "";
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  /* ---------- Mobile navigation ---------- */

  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    mobileNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Search index ---------- */

  const searchIndex = [
    {
      title: "Install MarketPilot",
      desc: "MSI installer, portable ZIP, SmartScreen and first launch.",
      url: "downloads.html#install",
      cat: "Start",
      keys: "download setup install msi zip portable smartscreen windows"
    },
    {
      title: "System requirements",
      desc: "Windows 10/11 x64, no JDK needed for the packaged build.",
      url: "downloads.html#requirements",
      cat: "Start",
      keys: "windows 10 11 64 bit ram disk space requirements"
    },
    {
      title: "Verify the download",
      desc: "Check SHA-256 checksums in PowerShell before installing.",
      url: "downloads.html#verify",
      cat: "Start",
      keys: "sha256 checksum hash powershell integrity signed"
    },
    {
      title: "Documentation overview",
      desc: "How this manual is organised and where to start.",
      url: "docs/index.html",
      cat: "Docs",
      keys: "docs help manual index overview start"
    },
    {
      title: "First launch and layout",
      desc: "Sidebar, top bar, dry-run chip, approval lock and toasts.",
      url: "docs/guide.html#layout",
      cat: "Guide",
      keys: "window sidebar dashboard top bar dry run live tick approve all"
    },
    {
      title: "Fill the brand profile",
      desc: "Identity, offers, voice, colours, sender identity and guard rails.",
      url: "docs/guide.html#brand",
      cat: "Guide",
      keys: "brand profile tone banned words offers timezone sending window daily cap"
    },
    {
      title: "Connect the AI writer",
      desc: "Gemini, OpenAI, OpenCode Zen or Go, plus the template fallback.",
      url: "docs/guide.html#ai",
      cat: "Guide",
      keys: "ai gemini openai opencode zen go api key model template writer"
    },
    {
      title: "Write your first post",
      desc: "Channels, pillars, variants, brief, generated copy and artwork.",
      url: "docs/guide.html#first-post",
      cat: "Guide",
      keys: "content studio post pillar tip proof offer story faq behind local myth variants"
    },
    {
      title: "Review and publish safely",
      desc: "Queue filters, approve, publish now, SIMULATED and retries.",
      url: "docs/guide.html#publish",
      cat: "Guide",
      keys: "queue approve publish simulated failed retry cancel live"
    },
    {
      title: "Manual bundles for TikTok and Reels",
      desc: "Outbox caption, image, post.json and optional 8-second reel.",
      url: "docs/guide.html#manual-bundles",
      cat: "Guide",
      keys: "manual tiktok reels stories outbox bundle ffmpeg video"
    },
    {
      title: "Import contacts from CSV",
      desc: "Accepted headers, deduplication and suppression checks.",
      url: "docs/guide.html#import",
      cat: "Guide",
      keys: "audience leads csv import company email phone city category notes source"
    },
    {
      title: "Run a cold-outreach campaign",
      desc: "Lawful basis, activation, drafting, review and sending.",
      url: "docs/guide.html#outreach",
      cat: "Guide",
      keys: "outreach campaign email whatsapp lead messages approve lawful basis"
    },
    {
      title: "Send a newsletter",
      desc: "Subscribed contacts only, per-subscriber drafts, SMTP delivery.",
      url: "docs/guide.html#newsletter",
      cat: "Guide",
      keys: "newsletter subscribers email smtp campaign"
    },
    {
      title: "Local and Google Business posts",
      desc: "Short local updates and offers sized 1200x900.",
      url: "docs/guide.html#local",
      cat: "Guide",
      keys: "google business profile local city neighbourhood post"
    },
    {
      title: "Facebook Page setup",
      desc: "Meta app, Page ID, token scopes and posting.",
      url: "docs/channels.html#facebook",
      cat: "Channels",
      keys: "facebook meta page id access token pages_manage_posts pages_show_list"
    },
    {
      title: "Instagram setup",
      desc: "Business account, Page token and the required public image URL.",
      url: "docs/channels.html#instagram",
      cat: "Channels",
      keys: "instagram business account image base url public token graph api"
    },
    {
      title: "LinkedIn setup",
      desc: "Author URN, token and optional API version.",
      url: "docs/channels.html#linkedin",
      cat: "Channels",
      keys: "linkedin urn person organization w_member_social token api version"
    },
    {
      title: "X setup",
      desc: "OAuth 2.0 user token with write access and rate limits.",
      url: "docs/channels.html#x",
      cat: "Channels",
      keys: "x twitter oauth token tweet rate limit"
    },
    {
      title: "Google Business Profile setup",
      desc: "Account and location IDs, OAuth credentials and refresh token.",
      url: "docs/channels.html#google",
      cat: "Channels",
      keys: "google business profile account location oauth client refresh token local"
    },
    {
      title: "Email and SMTP setup",
      desc: "Host, port, app password, From identity and unsubscribe mailbox.",
      url: "docs/channels.html#email",
      cat: "Channels",
      keys: "smtp email host port 587 465 app password from unsubscribe list-unsubscribe"
    },
    {
      title: "WhatsApp Cloud API setup",
      desc: "Phone number ID, token, approved template and 24-hour window.",
      url: "docs/channels.html#whatsapp",
      cat: "Channels",
      keys: "whatsapp cloud api phone number template language 24 hour"
    },
    {
      title: "Manual channel",
      desc: "The always-available fallback that writes an outbox bundle.",
      url: "docs/channels.html#manual",
      cat: "Channels",
      keys: "manual channel tiktok reels outbox fallback"
    },
    {
      title: "Cadences and the scheduler",
      desc: "Recurring posts by channel, weekday, time and pillar.",
      url: "docs/automation.html#cadences",
      cat: "Automation",
      keys: "cadence automation schedule weekday time pillar auto approve run now"
    },
    {
      title: "Run headless with Task Scheduler",
      desc: "MarketPilot.exe --once, every 15 minutes, no window.",
      url: "docs/automation.html#task-scheduler",
      cat: "Automation",
      keys: "task scheduler headless once cli 24/7 windows"
    },
    {
      title: "Command-line flags",
      desc: "--once, --force, --dry-run, --status and --help.",
      url: "docs/automation.html#cli",
      cat: "Automation",
      keys: "cli flags once force dry-run status help runauto exit code"
    },
    {
      title: "Data, backup and moving installs",
      desc: "Workspace, credentials, media and outbox locations.",
      url: "docs/automation.html#data",
      cat: "Automation",
      keys: "backup data appdata workspace json settings.properties media outbox"
    },
    {
      title: "Safety defaults",
      desc: "Dry run, approval lock, scheduler state and sending window.",
      url: "docs/safety.html#defaults",
      cat: "Safety",
      keys: "safety dry run approval lock scheduler sending window defaults"
    },
    {
      title: "Guard rails",
      desc: "Daily caps, minimum gap, retry backoff and quiet hours.",
      url: "docs/safety.html#guardrails",
      cat: "Safety",
      keys: "daily cap minimum gap retries backoff quiet hours rate limit"
    },
    {
      title: "Outreach compliance",
      desc: "Lawful basis, suppression, unsubscribe path and sender identity.",
      url: "docs/safety.html#compliance",
      cat: "Safety",
      keys: "gdpr lawful basis consent legitimate interest suppression unsubscribe compliance spam"
    },
    {
      title: "Troubleshooting",
      desc: "Blank window, SIMULATED posts, auth errors and empty outbox.",
      url: "docs/faq.html#troubleshooting",
      cat: "Help",
      keys: "troubleshooting blank window simulated failed 401 403 instagram whatsapp outbox reel cadence"
    },
    {
      title: "Known limitations",
      desc: "No scraping, no drip sequences, API access and token expiry.",
      url: "docs/faq.html#limits",
      cat: "Help",
      keys: "limitations scraping purchased lists drip sequence api approval tokens"
    },
    {
      title: "Frequently asked questions",
      desc: "Multiple brands, multiple customers, updates and costs.",
      url: "docs/faq.html#questions",
      cat: "Help",
      keys: "faq brands customers updates pricing costs cloud accounts"
    }
  ];

  /* ---------- Search dialog ---------- */

  const dialog = $("#searchDialog");
  const input = $("#searchInput");
  const results = $("#searchResults");
  const searchTriggers = $$("[data-open-search]");
  let active = -1;
  let current = [];

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

  function score(item, q) {
    const title = item.title.toLowerCase();
    const desc = item.desc.toLowerCase();
    const keys = item.keys.toLowerCase();
    if (title.startsWith(q)) return 5;
    if (title.includes(q)) return 4;
    if (keys.includes(q)) return 3;
    if (desc.includes(q)) return 2;
    const words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.every((w) => (title + " " + desc + " " + keys).includes(w))) return 1;
    return 0;
  }

  function render(query) {
    const q = query.trim().toLowerCase();
    current = q
      ? searchIndex
          .map((item) => ({ item, s: score(item, q) }))
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 12)
          .map((x) => x.item)
      : searchIndex.slice(0, 10);

    active = current.length ? 0 : -1;
    if (!current.length) {
      results.innerHTML = `<li class="search-empty">No matches for “${escapeHtml(query)}”. Try “instagram”, “dry run” or “backup”.</li>`;
      return;
    }
    results.innerHTML = current
      .map(
        (item, i) => `
        <li>
          <a href="${root}${item.url}" data-index="${i}" class="${i === 0 ? "is-active" : ""}">
            <span class="r-cat">${escapeHtml(item.cat)}</span>
            <span class="r-title">${escapeHtml(item.title)}</span>
            <span class="r-desc">${escapeHtml(item.desc)}</span>
          </a>
        </li>`
      )
      .join("");
  }

  function setActive(index) {
    const links = $$("a[data-index]", results);
    if (!links.length) return;
    active = (index + links.length) % links.length;
    links.forEach((a, i) => a.classList.toggle("is-active", i === active));
    links[active].scrollIntoView({ block: "nearest" });
  }

  function openSearch() {
    if (!dialog || typeof dialog.showModal !== "function") return;
    dialog.showModal();
    input.value = "";
    render("");
    requestAnimationFrame(() => input.focus());
  }

  if (dialog && input && results) {
    searchTriggers.forEach((btn) => btn.addEventListener("click", openSearch));

    input.addEventListener("input", () => render(input.value));

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(active + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === "Enter") {
        const link = $("a[data-index].is-active", results);
        if (link) {
          e.preventDefault();
          window.location.href = link.getAttribute("href");
        }
      }
    });

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
      input.value = "";
    });

    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  /* ---------- Docs hub filter ---------- */

  const filterInput = $("[data-doc-filter]");
  if (filterInput) {
    const cards = $$("[data-doc-card]");
    const empty = $(".no-results");
    filterInput.addEventListener("input", () => {
      const q = filterInput.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const match = !q || text.includes(q);
        card.style.display = match ? "" : "none";
        if (match) shown += 1;
      });
      if (empty) empty.classList.toggle("show", shown === 0);
    });
  }

  /* ---------- Copy helpers ---------- */

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      area.remove();
      return ok;
    }
  }

  function flash(btn, label) {
    const original = btn.textContent;
    btn.textContent = label;
    window.setTimeout(() => { btn.textContent = original; }, 1500);
  }

  $$(".docs-article pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", async () => {
      const ok = await copyText(code.innerText);
      flash(btn, ok ? "Copied" : "Failed");
    });
    pre.classList.add("has-copy");
    pre.appendChild(btn);
  });

  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      const ok = await copyText(value);
      flash(btn, ok ? "Copied" : "Failed");
    });
  });

  /* ---------- Footer year ---------- */

  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
