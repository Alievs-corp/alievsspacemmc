import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("careers");
  const breadcrumb = document.getElementById("careersBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.careers","Careers")}`;
  const title = document.getElementById("careersTitle");
  if (title) title.textContent = t("nav.careers","Careers");
  const intro = document.getElementById("careersIntro");
  if (intro) intro.textContent = t("public.careersIntro","We build premium systems. Join a team that cares about design, structure, and reliability.");
  const list = content.careers || [];
  const wrap = document.getElementById("careers");
  wrap.innerHTML = list.map(j=>`
    <div class="card hover reveal">
      <div class="split">
        <div class="h3">${escapeHtml(j.title||"")}</div>
        <span class="chip">${escapeHtml(j.status||"")}</span>
      </div>
      <div class="muted">${escapeHtml(j.desc||"")}</div>
      <div class="spacer"></div>
      <div class="chips">
        <span class="chip">${escapeHtml(j.type||"")}</span>
        <span class="chip">${escapeHtml(j.location||"")}</span>
      </div>
      <div class="hr"></div>
      <div class="muted"><b style="color:rgba(230,231,235,.92)">${t("public.requirements","Requirements:")}</b> ${(j.requirements||[]).map(r=>`<span class="chip">${escapeHtml(r)}</span>`).join("")}</div>
      <div class="spacer"></div>
      <a class="btn primary" href="/pages/contact.html?topic=${encodeURIComponent(j.title||t("nav.careers","Career"))}">${t("public.apply","Apply")}</a>
    </div>
  `).join("");

  const teamWrap = document.getElementById("team");
  if (teamWrap){
    const team = content.employees || [];
    const teamTitle = document.getElementById("teamTitle");
    if (teamTitle) teamTitle.textContent = t("public.teamTitle","Our team");
    teamWrap.innerHTML = team.map(m=>`
      <div class="card hover reveal">
        <div class="row" style="align-items:center; gap:14px">
          <div style="width:68px;height:68px;border-radius:18px;overflow:hidden;background:rgba(230,231,235,.06)">
            ${m.photo ? `<img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name||"")}" style="width:100%;height:100%;object-fit:cover"/>` : ""}
          </div>
          <div>
            <div class="h3">${escapeHtml(m.name||"")}</div>
            <div class="small">${escapeHtml(m.role||"")}</div>
          </div>
        </div>
        <div class="spacer"></div>
        <div class="muted">${escapeHtml(m.bio||"")}</div>
        <div class="spacer"></div>
        <div class="chip">${escapeHtml(m.experience||"")}</div>
      </div>
    `).join("");
  }
})();
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}
