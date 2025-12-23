import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("projects");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const p = (content.projects||[]).find(x=>x.id===id);
  if (!p){
    document.getElementById("title").textContent = t("public.notFoundProject","Project not found");
    return;
  }
  const breadcrumb = document.getElementById("projectBreadcrumb");
  if (breadcrumb) breadcrumb.innerHTML = `<a href="/pages/projects.html">${t("nav.projects","Case Studies")}</a> / ${t("public.projectDetails","Details")}`;
  const industryBadge = document.getElementById("projectIndustryBadge");
  if (industryBadge) industryBadge.innerHTML = `<i></i> ${t("public.industry","Industry")}`;
  document.getElementById("title").textContent = p.title;
  document.getElementById("industry").textContent = p.industry || "";
  document.getElementById("summary").textContent = p.summary || "";
  const tagsTitle = document.getElementById("projectTagsTitle");
  if (tagsTitle) tagsTitle.textContent = t("public.tags","Tags");
  document.getElementById("tags").innerHTML = (p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join("");
  const nextTitle = document.getElementById("projectNextTitle");
  if (nextTitle) nextTitle.textContent = t("public.nextStep","Next step");
  const nextCopy = document.getElementById("projectNextCopy");
  if (nextCopy) nextCopy.textContent = t("public.projectNextCopy","Want a similar system? We can estimate and propose a clean architecture with premium UI.");
  const cta = document.getElementById("projectCta");
  if (cta) cta.textContent = t("nav.cta","Request a Proposal");
  const openLink = document.getElementById("link");
  if (openLink) openLink.textContent = t("public.openLink","Open link");
  document.getElementById("link").href = p.link || "#";
})();
