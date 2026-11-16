/* MarketPilot site — navigation, docs search and copy helpers. */
(() => {
  "use strict";

  const root = document.body.dataset.root || "";
  const isArabic = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
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

  const searchIndexEn = [
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
      title: "Pricing and licence plans",
      desc: "72-hour free trial, $15 / month, $39 / 3 months, $129 / year. Order on WhatsApp.",
      url: "pricing.html",
      cat: "Start",
      keys: "pricing price plans licence license trial free 72 hours month quarter year buy whatsapp cost"
    },
    {
      title: "Licence questions",
      desc: "What happens at expiry, moving the key, renewals and refunds.",
      url: "pricing.html#faq",
      cat: "Start",
      keys: "licence license activation key expiry read only renew refund move pc tax subscription"
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

  // Arabic copy for the same destinations. Keys are the URLs above, so both
  // locales keep identical hrefs and data-root resolution.
  const searchIndexAr = {
    "downloads.html#install": {
      title: "تثبيت MarketPilot",
      desc: "مثبّت MSI، ونسخة محمولة ZIP، وSmartScreen، وأول تشغيل.",
      cat: "البداية",
      keys: "تحميل تثبيت msi zip محمول smartscreen ويندوز exe"
    },
    "downloads.html#requirements": {
      title: "متطلبات النظام",
      desc: "Windows 10/11 x64، بلا حاجة إلى JDK للبنية المعبأة.",
      cat: "البداية",
      keys: "ويندوز 10 11 64 بت ذاكرة مساحة قرص متطلبات"
    },
    "downloads.html#verify": {
      title: "تحقق من التنزيل",
      desc: "افحص تجزئات SHA-256 في PowerShell قبل التثبيت.",
      cat: "البداية",
      keys: "sha256 تجزئة hash powershell تحقق سلامة موقّع"
    },
    "pricing.html": {
      title: "الأسعار وخطط الترخيص",
      desc: "تجربة مجانية 72 ساعة، ثم 15 دولارًا للشهر، و39 لثلاثة أشهر، و129 للسنة. اطلب عبر واتساب.",
      cat: "البداية",
      keys: "أسعار سعر خطط ترخيص تجربة مجانية 72 ساعة شهر سنة شراء واتساب تكلفة"
    },
    "pricing.html#faq": {
      title: "أسئلة الترخيص",
      desc: "ماذا يحدث عند الانتهاء، ونقل المفتاح، والتجديد والاسترداد.",
      cat: "البداية",
      keys: "ترخيص تفعيل مفتاح انتهاء قراءة فقط تجديد استرداد نقل جهاز ضريبة اشتراك"
    },
    "docs/index.html": {
      title: "نظرة على التوثيق",
      desc: "كيف رُتّب هذا الدليل ومن أين تبدأ.",
      cat: "التوثيق",
      keys: "توثيق دليل مساعدة فهرس نظرة بداية"
    },
    "docs/guide.html#layout": {
      title: "أول تشغيل والتخطيط",
      desc: "الشريط الجانبي، والشريط العلوي، وشريحة التشغيل التجريبي، وقفل الموافقة، والإشعارات.",
      cat: "الدليل",
      keys: "نافذة شريط جانبي لوحة تحكم شريط علوي تشغيل تجريبي مباشر دورة اعتماد الكل"
    },
    "docs/guide.html#brand": {
      title: "املأ ملف العلامة",
      desc: "الهوية، والعروض، والصوت، والألوان، وهوية المرسل، وضوابط الحماية.",
      cat: "الدليل",
      keys: "علامة ملف نبرة كلمات محظورة عروض منطقة زمنية نافذة إرسال حد يومي"
    },
    "docs/guide.html#ai": {
      title: "اربط كاتب الذكاء الاصطناعي",
      desc: "Gemini أو OpenAI أو OpenCode Zen أو Go، مع القالب البديل.",
      cat: "الدليل",
      keys: "ذكاء اصطناعي gemini openai opencode zen go مفتاح api طراز قالب كاتب"
    },
    "docs/guide.html#first-post": {
      title: "اكتب منشورك الأول",
      desc: "القنوات، والمحاور، والنسخ، والموجز، والنص المولد، والتصميم.",
      cat: "الدليل",
      keys: "استوديو محتوى منشور محور نصيحة دليل عرض قصة سؤال من الخلف محلي خرافة نسخ"
    },
    "docs/guide.html#publish": {
      title: "راجع وانشر بأمان",
      desc: "فلاتر القائمة، والاعتماد، والنشر الآن، وSIMULATED، وإعادة المحاولة.",
      cat: "الدليل",
      keys: "قائمة اعتماد نشر محاكى فشل إعادة محاولة إلغاء مباشر"
    },
    "docs/guide.html#manual-bundles": {
      title: "حزم يدوية لتيك توك وReels",
      desc: "تعليق الصادر، والصورة، وpost.json، ومقطع reel اختياري مدته 8 ثوانٍ.",
      cat: "الدليل",
      keys: "يدوي تيك توك reels قصص صادر حزمة ffmpeg فيديو"
    },
    "docs/guide.html#import": {
      title: "استورد جهات الاتصال من CSV",
      desc: "العناوين المقبولة، وإزالة التكرار، وفحوص الحظر.",
      cat: "الدليل",
      keys: "جمهور عملاء محتملون csv استيراد شركة بريد هاتف مدينة فئة ملاحظات مصدر"
    },
    "docs/guide.html#outreach": {
      title: "شغّل حملة تواصل بارد",
      desc: "الأساس القانوني، والتفعيل، والصياغة، والمراجعة، والإرسال.",
      cat: "الدليل",
      keys: "تواصل حملة بريد واتساب عميل محتمل رسائل اعتماد أساس قانوني"
    },
    "docs/guide.html#newsletter": {
      title: "أرسل نشرة",
      desc: "جهات الاتصال المشتركة فقط، ومسودات لكل مشترك، وإرسال SMTP.",
      cat: "الدليل",
      keys: "نشرة مشتركون بريد smtp حملة"
    },
    "docs/guide.html#local": {
      title: "منشورات محلية وGoogle Business",
      desc: "تحديثات محلية قصيرة وعروض بمقاس 1200x900.",
      cat: "الدليل",
      keys: "google business profile محلي مدينة حي منشور"
    },
    "docs/channels.html#facebook": {
      title: "إعداد صفحة فيسبوك",
      desc: "تطبيق Meta، ومعرّف الصفحة، ونطاقات الرمز، والنشر.",
      cat: "القنوات",
      keys: "فيسبوك meta صفحة معرّف رمز وصول pages_manage_posts pages_show_list"
    },
    "docs/channels.html#instagram": {
      title: "إعداد إنستغرام",
      desc: "حساب أعمال، ورمز صفحة، ورابط صورة عام مطلوب.",
      cat: "القنوات",
      keys: "إنستغرام حساب أعمال رابط أساس صورة عام رمز graph api"
    },
    "docs/channels.html#linkedin": {
      title: "إعداد لينكدإن",
      desc: "Author URN، والرمز، وإصدار الواجهة الاختياري.",
      cat: "القنوات",
      keys: "لينكدإن urn شخص مؤسسة w_member_social رمز واجهة إصدار"
    },
    "docs/channels.html#x": {
      title: "إعداد X",
      desc: "رمز مستخدم OAuth 2.0 مع صلاحية الكتابة وحدود المعدل.",
      cat: "القنوات",
      keys: "x twitter oauth رمز تغريدة حد معدل"
    },
    "docs/channels.html#google": {
      title: "إعداد Google Business Profile",
      desc: "معرّفات الحساب والموقع، وبيانات OAuth، ورمز التحديث.",
      cat: "القنوات",
      keys: "google business profile حساب موقع oauth عميل رمز تحديث محلي"
    },
    "docs/channels.html#email": {
      title: "إعداد البريد وSMTP",
      desc: "المضيف، والمنفذ، وكلمة مرور التطبيق، وهوية المرسل، وصندوق إلغاء الاشتراك.",
      cat: "القنوات",
      keys: "smtp بريد مضيف منفذ 587 465 كلمة مرور تطبيق مرسل إلغاء اشتراك"
    },
    "docs/channels.html#whatsapp": {
      title: "إعداد WhatsApp Cloud API",
      desc: "معرّف رقم الهاتف، والرمز، والقالب المعتمد، ونافذة الـ24 ساعة.",
      cat: "القنوات",
      keys: "واتساب cloud api رقم هاتف قالب لغة 24 ساعة"
    },
    "docs/channels.html#manual": {
      title: "القناة اليدوية",
      desc: "البديل المتاح دائمًا الذي يكتب حزمة صادر.",
      cat: "القنوات",
      keys: "يدوي قناة تيك توك reels صادر بديل"
    },
    "docs/automation.html#cadences": {
      title: "الإيقاعات والمجدول",
      desc: "منشورات متكررة حسب القناة ويوم الأسبوع والوقت والمحور.",
      cat: "الأتمتة",
      keys: "إيقاع أتمتة جدولة يوم أسبوع وقت محور اعتماد تلقائي شغّل الآن"
    },
    "docs/automation.html#task-scheduler": {
      title: "شغّله بلا واجهة مع مُجدول المهام",
      desc: "MarketPilot.exe --once كل 15 دقيقة بلا نافذة.",
      cat: "الأتمتة",
      keys: "مُجدول مهام بلا واجهة once cli 24/7 ويندوز"
    },
    "docs/automation.html#cli": {
      title: "أعلام سطر الأوامر",
      desc: "--once و--force و--dry-run و--status و--help.",
      cat: "الأتمتة",
      keys: "cli أعلام once force dry-run status help runauto رمز خروج"
    },
    "docs/automation.html#data": {
      title: "البيانات والنسخ الاحتياطي ونقل التثبيت",
      desc: "مساحة العمل، وبيانات الاعتماد، والوسائط، ومواقع الصادر.",
      cat: "الأتمتة",
      keys: "نسخ احتياطي بيانات appdata workspace json settings.properties وسائط صادر"
    },
    "docs/safety.html#defaults": {
      title: "الإعدادات الآمنة الافتراضية",
      desc: "التشغيل التجريبي، وقفل الموافقة، وحالة المجدول، ونافذة الإرسال.",
      cat: "الأمان",
      keys: "أمان تشغيل تجريبي قفل موافقة مجدول نافذة إرسال افتراضيات"
    },
    "docs/safety.html#guardrails": {
      title: "ضوابط الحماية",
      desc: "الحدود اليومية، وأدنى فاصل، وتراجع إعادة المحاولة، وساعات الهدوء.",
      cat: "الأمان",
      keys: "حد يومي أدنى فاصل إعادة محاولة تراجع ساعات هدوء حد معدل"
    },
    "docs/safety.html#compliance": {
      title: "امتثال التواصل",
      desc: "الأساس القانوني، والحظر، ومسار إلغاء الاشتراك، وهوية المرسل.",
      cat: "الأمان",
      keys: "gdpr أساس قانوني موافقة مصلحة مشروعة حظر إلغاء اشتراك امتثال بريد مزعج"
    },
    "docs/faq.html#troubleshooting": {
      title: "استكشاف الأخطاء",
      desc: "نافذة فارغة، ومنشورات SIMULATED، وأخطاء مصادقة، وصادر فارغ.",
      cat: "المساعدة",
      keys: "استكشاف أخطاء نافذة فارغة محاكى فشل 401 403 إنستغرام واتساب صادر reel إيقاع"
    },
    "docs/faq.html#limits": {
      title: "القيود المعروفة",
      desc: "بلا كشط، وبلا سلاسل تنقيط، والوصول إلى الواجهات وانتهاء الرموز.",
      cat: "المساعدة",
      keys: "قيود كشط قوائم مشتراة سلسلة تنقيط api اعتماد رموز"
    },
    "docs/faq.html#questions": {
      title: "الأسئلة الشائعة",
      desc: "علامات متعددة، وعملاء متعددون، والتحديثات والتكاليف.",
      cat: "المساعدة",
      keys: "أسئلة شائعة علامات عملاء تحديثات أسعار تكاليف حسابات سحابية"
    }
  };

  const searchIndex = isArabic
    ? searchIndexEn.map((item) => {
        const ar = searchIndexAr[item.url];
        return ar ? { ...item, ...ar } : item;
      })
    : searchIndexEn;

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
      results.innerHTML = isArabic
        ? `<li class="search-empty">لا نتائج لـ«${escapeHtml(query)}». جرّب «إنستغرام» أو «تشغيل تجريبي» أو «نسخ احتياطي».</li>`
        : `<li class="search-empty">No matches for “${escapeHtml(query)}”. Try “instagram”, “dry run” or “backup”.</li>`;
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

  const copyUi = isArabic
    ? { copy: "نسخ", copied: "تم النسخ", failed: "فشل", label: "نسخ الرمز إلى الحافظة" }
    : { copy: "Copy", copied: "Copied", failed: "Failed", label: "Copy code to clipboard" };

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
    btn.textContent = copyUi.copy;
    btn.setAttribute("aria-label", copyUi.label);
    btn.addEventListener("click", async () => {
      const ok = await copyText(code.innerText);
      flash(btn, ok ? copyUi.copied : copyUi.failed);
    });
    pre.classList.add("has-copy");
    pre.appendChild(btn);
  });

  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      const ok = await copyText(value);
      flash(btn, ok ? copyUi.copied : copyUi.failed);
    });
  });

  /* ---------- Footer year ---------- */

  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
