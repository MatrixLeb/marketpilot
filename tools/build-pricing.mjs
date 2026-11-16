// Build the pricing cards from site.config.json so the app, the English pages
// and the Arabic mirror always quote the same prices and WhatsApp number.
//
//   node tools/build-pricing.mjs
//
// Cards are injected between <!-- plans:start --> and <!-- plans:end --> in:
//   index.html, pricing.html, i18n/ar/pages/index.main.html, i18n/ar/pages/pricing.main.html
// Run tools/build-ar.mjs afterwards to regenerate the Arabic HTML.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const config = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8"));

const PLAN_META = [
  {
    key: "trial",
    code: "TRIAL",
    days: 0,
    hours: config.trialHours,
    en: {
      name: "Free trial",
      term: "72 hours",
      badge: "Included",
      per: "No card, no account",
      blurb:
        "Everything unlocked for three days: copy, artwork, queue, cadences, outreach and local posts.",
      cta: "Starts on first launch"
    },
    ar: {
      name: "تجربة مجانية",
      term: "72 ساعة",
      badge: "مضمّنة",
      per: "بلا بطاقة ولا حساب",
      blurb:
        "كل المزايا لثلاثة أيام: الكتابة والتصاميم وقائمة النشر والإيقاعات والتواصل والمنشورات المحلية.",
      cta: "تبدأ عند أول تشغيل"
    }
  },
  {
    key: "month",
    code: "MONTH",
    days: 30,
    en: {
      name: "1 month",
      term: "/ 30 days",
      badge: "",
      per: "about $15.00 a month",
      blurb: "A launch, a project or a first month of steady posts.",
      cta: "Buy on WhatsApp"
    },
    ar: {
      name: "شهر واحد",
      term: "/ 30 يومًا",
      badge: "",
      per: "نحو 15.00 دولارًا شهريًا",
      blurb: "إطلاق أو مشروع أو شهرك الأول من المنشورات المنتظمة.",
      cta: "اشترِ عبر واتساب"
    }
  },
  {
    key: "quarter",
    code: "QUARTER",
    days: 90,
    en: {
      name: "3 months",
      term: "/ 90 days",
      badge: "",
      per: "about $13.00 a month",
      blurb: "One season of content, with room to test what lands.",
      cta: "Buy on WhatsApp"
    },
    ar: {
      name: "ثلاثة أشهر",
      term: "/ 90 يومًا",
      badge: "",
      per: "نحو 13.00 دولارًا شهريًا",
      blurb: "موسم كامل من المحتوى، مع مساحة لاختبار ما ينجح.",
      cta: "اشترِ عبر واتساب"
    }
  },
  {
    key: "year",
    code: "YEAR",
    days: 365,
    en: {
      name: "1 year",
      term: "/ year",
      badge: "Best value",
      per: "about $10.75 a month",
      blurb: "A full year of marketing, renewed once and forgotten.",
      cta: "Buy on WhatsApp"
    },
    ar: {
      name: "سنة كاملة",
      term: "/ سنة",
      badge: "الأفضل قيمة",
      per: "نحو 10.75 دولارًا شهريًا",
      blurb: "سنة تسويقية كاملة، تُجدَّد مرة واحدة وتُنسى.",
      cta: "اشترِ عبر واتساب"
    }
  }
];

const monthly = config.plans.month;

function savings(price, days) {
  const full = monthly * (days / 30);
  return Math.round((1 - price / full) * 100);
}

function waLink(message) {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

function money(value) {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
}

function card(meta, locale) {
  const copy = meta[locale];
  const isTrial = meta.key === "trial";
  const price = isTrial ? 0 : config.plans[meta.key];
  const save = isTrial ? 0 : savings(price, meta.days);
  const badge = copy.badge || (save > 0 ? `${locale === "ar" ? "وفّر" : "Save"} ${save}%` : "");
  const featured = meta.key === "year" ? " featured" : "";

  const message =
    locale === "ar"
      ? isTrial
        ? "مرحبًا، أريد تجربة Masar لمدة 72 ساعة."
        : `مرحبًا، أريد Masar لمدة ${copy.name} (${price} دولارًا). أرسلوا لي مفتاح الترخيص.`
      : isTrial
        ? "Hello, I want to try Masar for 72 hours."
        : `Hello, I want Masar for ${copy.name} (${money(price)}). Please send me a licence key.`;

  const cta = isTrial
    ? `<span class="plan-cta plan-static">${copy.cta}</span>`
    : `<a class="btn ${meta.key === "year" ? "btn-primary" : "btn-secondary"} plan-cta" href="${waLink(message)}" rel="noopener">${copy.cta}</a>`;

  return `          <article class="plan-card${featured}">
            <div class="plan-head">
              <h3>${copy.name}</h3>
              ${badge ? `<span class="plan-badge">${badge}</span>` : ""}
            </div>
            <p class="plan-price">${
              isTrial ? (locale === "ar" ? "مجانًا" : "Free") : `<span class="num" dir="ltr">${money(price)}</span>`
            } <span class="plan-term">${copy.term}</span></p>
            <p class="plan-per">${copy.per}</p>
            <p class="plan-blurb">${copy.blurb}</p>
            ${cta}
          </article>`;
}

function block(locale) {
  return PLAN_META.map((meta) => card(meta, locale)).join("\n");
}

const targets = [
  { file: join(root, "index.html"), locale: "en" },
  { file: join(root, "pricing.html"), locale: "en" },
  { file: join(root, "i18n", "ar", "pages", "index.main.html"), locale: "ar" },
  { file: join(root, "i18n", "ar", "pages", "pricing.main.html"), locale: "ar" }
];

const start = "<!-- plans:start -->";
const end = "<!-- plans:end -->";

for (const target of targets) {
  if (!existsSync(target.file)) {
    console.log(`skip (missing): ${target.file}`);
    continue;
  }
  const html = readFileSync(target.file, "utf8");
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(html)) {
    console.log(`skip (no markers): ${target.file}`);
    continue;
  }
  const replacement = `${start}\n${block(target.locale)}\n          ${end}`;
  writeFileSync(target.file, html.replace(pattern, replacement));
  console.log(`plans: ${target.file.replace(root + "\\", "")} (${target.locale})`);
}

console.log(`WhatsApp: ${config.whatsappDisplay} · $${config.plans.month} / $${config.plans.quarter} / $${config.plans.year}`);
