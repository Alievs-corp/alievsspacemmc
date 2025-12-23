import { initPage } from "../app.js";
import { getContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("blog");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const p = (content.blog||[]).find(x=>x.id===id);
  if (!p){
    document.getElementById("title").textContent = t("public.notFoundPost","Post not found");
    return;
  }
  const breadcrumb = document.getElementById("postBreadcrumb");
  if (breadcrumb) breadcrumb.innerHTML = `<a href="/pages/blog.html">${t("nav.blog","Blog")}</a> / ${t("public.postLabel","Post")}`;
  document.getElementById("title").textContent = p.title;
  document.getElementById("date").textContent = p.date || "";
  document.getElementById("tags").innerHTML = (p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join("");
  document.getElementById("content").innerHTML = p.content || "";
  const helpTitle = document.getElementById("postHelpTitle");
  if (helpTitle) helpTitle.textContent = t("public.postHelpTitle","Need help?");
  const helpCopy = document.getElementById("postHelpCopy");
  if (helpCopy) helpCopy.textContent = t("public.postHelpCopy","If you're building a marketplace, e-commerce platform, or a banking-ready dashboard — we can propose a premium architecture.");
  const helpCta = document.getElementById("postHelpCta");
  if (helpCta) helpCta.textContent = t("nav.cta","Request a Proposal");
})();
