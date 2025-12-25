import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("projects");
  const breadcrumb = document.getElementById("prjBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.projects","Case Studies")}`;
  const title = document.getElementById("prjTitle");
  if (title) title.textContent = t("nav.projects","Case Studies");
  const intro = document.getElementById("prjIntro");
  if (intro) intro.textContent = t("public.projectsIntro","Selected examples across marketplaces, banking dashboards, and operational systems.");
  const list = content.projects || [];
  const wrap = document.getElementById("projects");
  wrap.innerHTML = list.map(p=>`
    <a class="card hover reveal" href="/alievsspacemmc/public/pages/project.html?id=${encodeURIComponent(p.id)}">
      <div class="badge"><i></i> ${escapeHtml(p.industry||"")}</div>
      <div class="spacer"></div>
      <div class="h3">${escapeHtml(p.title||"")}</div>
      <div class="muted">${escapeHtml(p.summary||"")}</div>
      <div class="spacer"></div>
      <div class="chips">${(p.tags||[]).slice(0,4).map(t=>`<span class="chip">${escapeHtml(t)}</span>`).join("")}</div>
    </a>
  `).join("");
})();
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}
