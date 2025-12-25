import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("blog");
  const breadcrumb = document.getElementById("blogBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.blog","Blog")}`;
  const title = document.getElementById("blogTitle");
  if (title) title.textContent = t("nav.blog","Blog");
  const intro = document.getElementById("blogIntro");
  if (intro) intro.textContent = t("public.blogIntro","Insights on marketplaces, premium UX, admin systems, and banking-ready dashboards.");
  const list = (content.blog||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const wrap = document.getElementById("posts");
  wrap.innerHTML = list.map(p=>`
    <a class="card hover reveal" href="/public/pages/post.html?id=${encodeURIComponent(p.id)}">
      <div class="split">
        <div class="h3">${escapeHtml(p.title||"")}</div>
        <span class="chip">${escapeHtml(p.date||"")}</span>
      </div>
      <div class="muted">${escapeHtml(p.excerpt||"")}</div>
      <div class="spacer"></div>
      <div class="chips">${(p.tags||[]).map(t=>`<span class="chip">${escapeHtml(t)}</span>`).join("")}</div>
    </a>
  `).join("");
})();
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}
