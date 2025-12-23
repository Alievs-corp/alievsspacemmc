import { mountHeader, mountFooter } from "./components/layout.js";
import { getLocale } from "./i18n.js";
import { getContent } from "./contentStore.js";

export async function initPage(activeKey){
  document.documentElement.lang = getLocale();
  mountHeader({ active: activeKey });
  mountFooter();
  const content = await getContent();
  hydrateBrand(content);
  setupReveal();
  return content;
}

function hydrateBrand(content){
  const s = content.settings || {};
  const brandName = s.brandName || "Alievs Space MMC";
  const tagline = s.tagline || "";
  const brandEls = [
    document.getElementById("brandName"),
    document.getElementById("fBrand"),
  ].filter(Boolean);
  brandEls.forEach(el => el.textContent = brandName);

  const tagEls = [
    document.getElementById("brandTagline"),
    document.getElementById("fTag"),
  ].filter(Boolean);
  tagEls.forEach(el => el.textContent = tagline);

  const fEmail = document.getElementById("fEmail");
  if (fEmail && s.email){
    fEmail.textContent = s.email;
    fEmail.href = "mailto:" + s.email;
  }
  const fPhone = document.getElementById("fPhone");
  if (fPhone && s.phone){
    fPhone.textContent = s.phone;
    fPhone.href = "tel:" + s.phone.replace(/\s/g,"");
  }
  const si = document.getElementById("sInsta");
  const sl = document.getElementById("sLinked");
  const sy = document.getElementById("sYT");
  if (si && s.social?.instagram) si.href = s.social.instagram;
  if (sl && s.social?.linkedin) sl.href = s.social.linkedin;
  if (sy && s.social?.youtube) sy.href = s.social.youtube;
}

function setupReveal(){
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add("on");
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  els.forEach(el=>io.observe(el));
}
