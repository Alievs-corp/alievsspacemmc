import { initPage } from "../app.js";
import { getLocale, t } from "../i18n.js";

(async ()=>{
  await initPage("industries");
  const breadcrumb = document.getElementById("indBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.industries","Industries")}`;
  const title = document.getElementById("indTitle");
  if (title) title.textContent = t("nav.industries","Industries");
  const intro = document.getElementById("indIntro");
  if (intro) intro.textContent = t("public.industriesIntro","We build systems where reliability, reporting, and premium UX are business-critical.");
  const byLocale = {
    en: [
      {t:"Retail & E-commerce", d:"Conversion-focused storefronts, checkout UX, analytics, and operational clarity."},
      {t:"Marketplaces", d:"Multi-vendor architecture, store dashboards, commissions, payouts, moderation tools."},
      {t:"Banking / Finance", d:"Role-based access, reporting, audit-ready views, and controlled workflows."},
      {t:"Manufacturing & Inventory", d:"Stock tracking, cost control, income/expense, and operational dashboards."},
      {t:"Beauty / Salon Systems", d:"Bookings, inventory, reminders, staff tools, and client management."},
      {t:"Logistics & Delivery", d:"Order flows, statuses, store/admin coordination, and reporting layers."},
      {t:"Startups / MVP", d:"Lean MVP delivery with premium UI and scalable architecture."}
    ],
    ru: [
      {t:"Ритейл и e-commerce", d:"Магазины с высокой конверсией, checkout UX, аналитика и операционная ясность."},
      {t:"Маркетплейсы", d:"Архитектура под многих продавцов, кабинеты, комиссии, выплаты, модерация."},
      {t:"Банкинг / финансы", d:"Ролевой доступ, отчеты, аудит-дружественные представления и управляемые процессы."},
      {t:"Производство и склад", d:"Учет запасов, контроль затрат, доход/расход, операционные дашборды."},
      {t:"Beauty / салоны", d:"Бронирования, склад, напоминания, инструменты для персонала и клиентов."},
      {t:"Логистика и доставка", d:"Потоки заказов, статусы, координация магазинов/админов и отчетность."},
      {t:"Startups / MVP", d:"Быстрая доставка MVP с премиальным UI и масштабируемой архитектурой."}
    ],
    az: [
      {t:"Pərakəndə və e-ticarət", d:"Konversiyaya fokuslu vitrinlər, checkout UX, analitika və aydın əməliyyatlar."},
      {t:"Marketpleyslər", d:"Çoxsatıcılı memarlıq, kabinetlər, komissiyalar, ödənişlər, moderasiya alətləri."},
      {t:"Bank / maliyyə", d:"Rol əsaslı giriş, hesabatlar, auditə hazır görünüşlər və idarə olunan proseslər."},
      {t:"İstehsal və inventar", d:"Ehtiyatların uçotu, xərcə nəzarət, gəlir/xərc və əməliyyat panelləri."},
      {t:"Gözəllik / salon sistemləri", d:"Rezervasiyalar, inventar, xatırlatmalar, personal və müştəri idarəetməsi."},
      {t:"Logistika və çatdırılma", d:"Sifariş axınları, statuslar, mağaza/admin koordinasiyası və hesabat qatı."},
      {t:"Startaplar / MVP", d:"Premium UI və miqyaslana bilən memarlıqla sürətli MVP çatdırılması."}
    ]
  };
  const items = byLocale[getLocale()] || byLocale.en;
  document.getElementById("industries").innerHTML = items.map(x=>`
    <div class="card hover reveal">
      <div class="h3">${x.t}</div>
      <div class="muted">${x.d}</div>
      <div class="spacer"></div>
      <a class="btn ghost" href="/public/pages/contact.html">${t("public.industriesCta","Discuss this industry →")}</a>
    </div>
  `).join("");
})();
