import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("home");
  const h = content.home || {};
  const s = content.settings || {};
  const kicker = document.getElementById("heroKicker");
  if (kicker) kicker.textContent = t("public.heroTagline","Premium • Platinum • Blue");
  const buildTitle = document.getElementById("buildTitle");
  if (buildTitle) buildTitle.textContent = t("public.buildWhat","What we build");
  const buildSub = document.getElementById("buildSub");
  if (buildSub) buildSub.textContent = t("public.buildDesc","A structured ecosystem across software, commerce, and banking-focused dashboards — designed premium and built to last.");
  document.getElementById("heroTitle").textContent = h.heroTitle || "Premium digital products.";
  document.getElementById("heroSub").textContent = h.heroSubtitle || "";
  const cta = document.getElementById("ctaPrimary");
  if (cta){
    cta.textContent = s.cta?.primaryText || "Request a Proposal";
    cta.href = s.cta?.primaryHref || "/pages/contact.html";
  }
  const hl = document.getElementById("highlights");
  hl.innerHTML = (h.highlights||[]).map(x=>`
    <div class="pill reveal">
      <b>${escapeHtml(x.title||"")}</b>
      <p>${escapeHtml(x.desc||"")}</p>
    </div>
  `).join("");
  const k = document.getElementById("kpis");
  k.innerHTML = (h.proof||[]).map(p=>`
    <div class="kpi reveal">
      <b>${escapeHtml(p.kpi||"")}</b>
      <span>${escapeHtml(p.label||"")}</span>
    </div>
  `).join("");
  const premiumTitle = document.getElementById("processTitle");
  if (premiumTitle) premiumTitle.textContent = t("public.premiumProcess","Premium process");
  const premiumDesc = document.getElementById("processDesc");
  if (premiumDesc) premiumDesc.textContent = t("public.processDesc","We keep delivery structured: architecture first, premium UI, quality control, then launch & support.");
  const focusTitle = document.getElementById("focusTitle");
  if (focusTitle) focusTitle.textContent = t("public.focusIndustries","Focus industries");
  const focusDesc = document.getElementById("focusDesc");
  if (focusDesc) focusDesc.textContent = t("public.focusDesc","E-commerce & marketplaces, banking/fintech dashboards, and operational systems where control and reporting matter.");
  const adminBadge = document.getElementById("adminBadge");
  if (adminBadge) adminBadge.innerHTML = `<i></i> ${t("public.adminIncluded","Admin Panel Included")}`;
  const adminDesc = document.getElementById("adminDesc");
  if (adminDesc) adminDesc.textContent = t("public.adminDesc","Manage services, projects, blog, careers, and incoming leads in a dedicated admin dashboard. Changes reflect instantly across the site.");
})();

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}
