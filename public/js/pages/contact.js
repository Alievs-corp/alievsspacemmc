import { initPage } from "../app.js";
import { getStoredContent, saveStoredContent } from "../contentStore.js";
import { t } from "../i18n.js";

(async ()=>{
  const content = await initPage("contact");
  const breadcrumb = document.getElementById("contactBreadcrumb");
  if (breadcrumb) breadcrumb.textContent = `${t("nav.home","Home")} / ${t("nav.contact","Contact")}`;
  const title = document.getElementById("contactTitle");
  if (title) title.textContent = t("nav.contact","Contact");
  const intro = document.getElementById("contactIntro");
  if (intro) intro.textContent = t("public.contactIntro","Tell us what you’re building. We’ll reply with a structured proposal.");
  const formTitle = document.getElementById("contactFormTitle");
  if (formTitle) formTitle.textContent = t("public.contactFormTitle","Send a request");
  const params = new URLSearchParams(location.search);
  const topic = params.get("topic");
  if (topic) document.getElementById("topic").value = topic;

  const labelMap = {
    nameInput: t("public.contactName","Your name *"),
    companyInput: t("public.contactCompany","Company"),
    emailInput: t("public.contactEmail","Email"),
    phoneInput: t("public.contactPhone","Phone"),
    interestSelect: t("public.contactInterest","Interest"),
    topic: t("public.contactTopic","Topic"),
    messageInput: t("public.contactMessage","Message")
  };
  Object.entries(labelMap).forEach(([id,text])=>{
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) label.textContent = text;
  });
  const placeholders = {
    nameInput: "Emin",
    companyInput: t("public.contactCompanyPlaceholder","Company name"),
    emailInput: "name@company.com",
    phoneInput: "+994 ...",
    topic: t("public.contactTopicPlaceholder","What do you want to build?"),
    messageInput: t("public.contactMessagePlaceholder","Describe your project, timeline, and goals...")
  };
  Object.entries(placeholders).forEach(([id, text])=>{
    const el = document.getElementById(id);
    if (el) el.placeholder = text;
  });
  const select = document.getElementById("interestSelect");
  if (select){
    const options = [
      { value: "soft", label: t("public.contactInterestSoftware","Software Development") },
      { value: "commerce", label: t("public.contactInterestCommerce","E-commerce / Marketplace") },
      { value: "banking", label: t("public.contactInterestBanking","Banking / Fintech Dashboard") },
      { value: "design", label: t("public.contactInterestDesign","UI/UX & Design System") },
      { value: "support", label: t("public.contactInterestSupport","Support & Scaling") }
    ];
    select.innerHTML = options.map(o=>`<option value="${o.value}">${o.label}</option>`).join("");
  }
  const helper = document.getElementById("contactHelper");
  if (helper) helper.textContent = t("public.contactHelper","Tip: mention industry (e-commerce/banking), required modules, and target markets.");
  const submitBtn = document.getElementById("contactSubmit");
  if (submitBtn) submitBtn.textContent = t("public.contactSubmit","Send request");
  const companyTitle = document.getElementById("companyDetailsTitle");
  if (companyTitle) companyTitle.textContent = t("public.companyDetails","Company details");
  const companyCopy = document.getElementById("companyDetailsCopy");
  if (companyCopy) companyCopy.textContent = t("public.companyDetailsCopy","We combine premium UI/UX with stable engineering and admin tooling — across commerce and banking-ready systems.");
  const noteBadge = document.getElementById("contactNoteBadge");
  if (noteBadge) noteBadge.innerHTML = `<i></i> ${t("public.noteBadge","Note")}`;
  const noteCopy = document.getElementById("contactNoteCopy");
  if (noteCopy) noteCopy.textContent = t("public.noteCopy","In this demo, requests are stored locally and visible in Admin → Leads.");

  // Ensure localStorage content exists so leads can be saved.
  if (!getStoredContent()){
    // If no stored content yet, bootstrap from default in this page context:
    const res = await fetch("../data/content.default.json", { cache:"no-cache" });
    const d = await res.json();
    saveStoredContent(d);
  }

  const form = document.getElementById("leadForm");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const lead = {
      id: "L" + Math.random().toString(16).slice(2),
      createdAt: new Date().toISOString(),
      name: String(fd.get("name")||"").trim(),
      company: String(fd.get("company")||"").trim(),
      email: String(fd.get("email")||"").trim(),
      phone: String(fd.get("phone")||"").trim(),
      interest: String(fd.get("interest")||"").trim(),
      topic: String(fd.get("topic")||"").trim(),
      message: String(fd.get("message")||"").trim(),
      status: t("public.contactStatusNew","New")
    };
    if (!lead.name || (!lead.email && !lead.phone)){
      toast(t("public.contactValidation","Please provide at least your name and email/phone."));
      return;
    }
    const c = getStoredContent();
    c.leads = c.leads || [];
    c.leads.unshift(lead);
    saveStoredContent(c);
    form.reset();
    toast(t("public.contactThanks","Thank you — we received your request. We'll reply soon."));
  });
})();

function toast(text){
  const t = document.createElement("div");
  t.textContent = text;
  t.style.position="fixed";
  t.style.left="50%";
  t.style.bottom="22px";
  t.style.transform="translateX(-50%)";
  t.style.padding="12px 14px";
  t.style.borderRadius="14px";
  t.style.border="1px solid rgba(230,231,235,.14)";
  t.style.background="rgba(16,24,39,.92)";
  t.style.boxShadow="0 10px 25px rgba(0,0,0,.35)";
  t.style.color="rgba(230,231,235,.92)";
  t.style.zIndex="999";
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2600);
}
