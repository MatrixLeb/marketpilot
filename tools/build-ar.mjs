// Build the static Arabic mirror from shared header/footer + Arabic <main> fragments.
// Usage: node tools/build-ar.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const arRoot = join(root, "ar");

const pages = [
  {
    out: "index.html",
    main: "index.main.html",
    title: "Masar — الطيار الآلي للتسويق لويندوز",
    description:
      "Masar تطبيق سطح مكتب لويندوز يكتب منشورات التواصل، ويرسم التصاميم، ويدير قائمة النشر، ويتولى التواصل المشروع عبر واجهات رسمية. التشغيل التجريبي مفعّل افتراضيًا.",
    current: "features",
    site: "../",
    ar: "",
    dataRoot: "",
    enPath: "index.html"
  },
  {
    out: "pricing.html",
    main: "pricing.main.html",
    title: "الأسعار والترخيص — Masar",
    description:
      "أسعار Masar: تجربة مجانية 72 ساعة، ثم 15 دولارًا لشهر أو 39 دولارًا لثلاثة أشهر أو 129 دولارًا لسنة. اطلب عبر واتساب وفعّل المفتاح دون اتصال.",
    current: "pricing",
    site: "../",
    ar: "",
    dataRoot: "",
    enPath: "pricing.html"
  },
  {
    out: "downloads.html",
    main: "downloads.main.html",
    title: "تنزيل Masar 1.2.0 لويندوز",
    description:
      "نزّل مثبّت Masar 1.2.0 لويندوز 10 و11 بصيغة EXE أو MSI أو حزمة ZIP محمولة، مع بصمات SHA-256 وتعليمات التثبيت.",
    current: "downloads",
    site: "../",
    ar: "",
    dataRoot: "",
    enPath: "downloads.html"
  },
  {
    out: "docs/index.html",
    main: "docs-index.main.html",
    title: "التوثيق — Masar",
    description:
      "كل ما تحتاجه لإعداد Masar: دليل من الألف إلى الياء، بيانات اعتماد القنوات، الأتمتة وسطر الأوامر، الأمان والامتثال، والأسئلة الشائعة.",
    current: "docs",
    site: "../../",
    ar: "../",
    dataRoot: "../",
    enPath: "docs/index.html"
  },
  {
    out: "docs/guide.html",
    main: "docs-guide.main.html",
    title: "دليل الإعداد من الألف إلى الياء — Masar",
    description:
      "دليل كامل لإعداد Masar: العلامة التجارية، مفاتيح الذكاء الاصطناعي، القنوات، الإنشاء، النشر التجريبي، ثم الانتقال إلى الوضع المباشر.",
    current: "docs",
    site: "../../",
    ar: "../",
    dataRoot: "../",
    enPath: "docs/guide.html"
  },
  {
    out: "docs/channels.html",
    main: "docs-channels.main.html",
    title: "القنوات وبيانات الاعتماد — Masar",
    description:
      "كل حقل بيانات اعتماد تحتاجه Masar لقنوات فيسبوك وإنستغرام وتيك توك ولينكدإن وX وGoogle Business والبريد وواتساب، مع حدود كل قناة.",
    current: "docs",
    site: "../../",
    ar: "../",
    dataRoot: "../",
    enPath: "docs/channels.html"
  },
  {
    out: "docs/automation.html",
    main: "docs-automation.main.html",
    title: "الأتمتة وسطر الأوامر — Masar",
    description:
      "الإيقاعات، والتشغيل الآلي، وأعلام سطر الأوامر، ومُجدول المهام، ومواقع البيانات والنسخ الاحتياطي في Masar.",
    current: "docs",
    site: "../../",
    ar: "../",
    dataRoot: "../",
    enPath: "docs/automation.html"
  },
  {
    out: "docs/safety.html",
    main: "docs-safety.main.html",
    title: "الأمان والامتثال — Masar",
    description:
      "الإعدادات الآمنة افتراضيًا، وضوابط الإرسال، وقائمة الحظر، وإخلاء المسؤولية، والامتثال في Masar.",
    current: "docs",
    site: "../../",
    ar: "../",
    dataRoot: "../",
    enPath: "docs/safety.html"
  },
  {
    out: "docs/faq.html",
    main: "docs-faq.main.html",
    title: "الأسئلة الشائعة واستكشاف الأخطاء — Masar",
    description:
      "إجابات عن الأسئلة الشائعة، واستكشاف الأخطاء، والقيود المعروفة، والعمل مع عدة علامات تجارية في Masar.",
    current: "docs",
    site: "../../",
    ar: "../",
    dataRoot: "../",
    enPath: "docs/faq.html"
  }
];

const headerTemplate = readFileSync(join(root, "i18n", "ar", "header.html"), "utf8");
const footerTemplate = readFileSync(join(root, "i18n", "ar", "footer.html"), "utf8");

function fill(template, page) {
  return template
    .replaceAll("{{site}}", page.site)
    .replaceAll("{{ar}}", page.ar)
    .replaceAll("{{enPath}}", page.enPath)
    .replaceAll("{{current_features}}", page.current === "features" ? ' aria-current="page"' : "")
    .replaceAll("{{current_docs}}", page.current === "docs" ? ' aria-current="page"' : "")
    .replaceAll("{{current_pricing}}", page.current === "pricing" ? ' aria-current="page"' : "")
    .replaceAll("{{current_downloads}}", page.current === "downloads" ? ' aria-current="page"' : "");
}

for (const page of pages) {
  const main = readFileSync(join(root, "i18n", "ar", "pages", page.main), "utf8").trim();
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${page.site}assets/dashboard.png">
  <link rel="icon" href="${page.site}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${page.site}assets/site.css">
</head>
<body data-root="${page.dataRoot}">
${fill(headerTemplate, page)}
<main id="main">
${fill(main, page)}
</main>

${fill(footerTemplate, page)}

  <script src="${page.site}assets/site.js"></script>
</body>
</html>
`;
  const target = join(arRoot, page.out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  console.log(`built ar/${page.out}`);
}
