import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("services");
  const list = content.services || [];
  const breadcrumb = document.getElementById("svcBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.services","Services")}`;
  const pageTitle = document.getElementById("svcTitle");
  if (pageTitle) pageTitle.textContent = t("nav.services","Services");
  const intro = document.getElementById("svcIntro");
  if (intro) intro.textContent = t("public.servicesIntro","Premium engineering & design across software development, e-commerce/marketplaces, and banking-ready dashboards.");
  const deliveryTitle = document.getElementById("svcDeliveryTitle");
  if (deliveryTitle) deliveryTitle.textContent = t("public.deliveryTitle","Delivery model");
  const deliveryCopy = document.getElementById("svcDeliveryCopy");
  if (deliveryCopy) deliveryCopy.textContent = t("public.deliveryCopy","We start with the architecture and UI system. Then we build modules, integrate analytics, and ship in controlled milestones — with ongoing support.");
  const wrap = document.getElementById("services");
  wrap.innerHTML = list.map(s=>`
    <div class="card hover reveal">
      <div class="badge"><i></i> ${escapeHtml(s.category||t("public.serviceFallback","Service"))}</div>
      <div class="spacer"></div>
      <div class="h3">${escapeHtml(s.title||"")}</div>
      <div class="muted">${escapeHtml(s.desc||"")}</div>
      <div class="spacer"></div>
      <div class="chips">
        ${(s.bullets||[]).slice(0,4).map(b=>`<span class="chip">${escapeHtml(b)}</span>`).join("")}
      </div>
    </div>
  `).join("");
})();
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}
