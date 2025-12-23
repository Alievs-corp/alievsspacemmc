import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("about");
  const a = content.about || {};
  const breadcrumb = document.getElementById("aboutBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.about","About")}`;
  document.getElementById("aboutHead").textContent = a.headline || "About us";
  const intro = document.getElementById("aboutIntro");
  if (intro) intro.textContent = (a.paragraphs||[])[0] || t("public.buildDesc","A structured ecosystem across software, commerce, and banking-focused dashboards — designed premium and built to last.");
  const whoTitle = document.getElementById("aboutWhoTitle");
  if (whoTitle) whoTitle.textContent = t("public.aboutWho","Who we are");
  const valuesTitle = document.getElementById("valuesTitle");
  if (valuesTitle) valuesTitle.textContent = t("public.aboutValues","Values");
  const howTitle = document.getElementById("aboutHowTitle");
  if (howTitle) howTitle.textContent = t("public.aboutHow","How we deliver");
  const delivery = document.getElementById("aboutDelivery");
  if (delivery) delivery.textContent = t("public.aboutDelivery","A structured delivery pipeline designed to stay stable and maintainable as you scale.");
  const p = document.getElementById("aboutParas");
  p.innerHTML = (a.paragraphs||[]).map(x=>`<p class="muted">${x}</p>`).join("");
  const v = document.getElementById("values");
  v.innerHTML = (a.values||[]).map(x=>`<span class="chip">${x}</span>`).join("");
  const proc = document.getElementById("process");
  proc.innerHTML = (a.process||[]).map((x,i)=>`
    <div class="card reveal">
      <div class="badge"><i></i> ${t("public.stepLabel","Step")} ${i+1}</div>
      <div class="spacer"></div>
      <div class="h3">${x}</div>
      <div class="muted">${t("public.aboutDelivery","A structured delivery pipeline designed to stay stable and maintainable as you scale.")}</div>
    </div>
  `).join("");
})();
