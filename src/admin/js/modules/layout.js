import { getLocale, setLocale, listLocales } from "../store.js";

export function mountShell(active){
  const sb = document.getElementById("sidebar");
  if (!sb) return;
  const locales = listLocales();
  const current = getLocale();
  sb.innerHTML = `
    <div class="brand">
      <div class="mark"></div>
      <div>
        <div style="font-weight:700">Alievs Space</div>
        <div class="small">Admin Console</div>
      </div>
    </div>
    <div class="grid" style="margin:10px 0">
      <label class="small" for="adminLang">Locale</label>
      <select id="adminLang" class="input">
        ${locales.map(l=>`<option value="${l}" ${l===current?"selected":""}>${l}</option>`).join("")}
      </select>
    </div>
    <div class="hr"></div>
    <nav class="nav" aria-label="Admin navigation">
      ${link("./dashboard.html","Overview","dashboard",active)}
      ${link("./services.html","Services","services",active)}
      ${link("./projects.html","Projects","projects",active)}
      ${link("./blog.html","Blog","blog",active)}
      ${link("./careers.html","Careers","careers",active)}
      ${link("./leads.html","Leads","leads",active)}
      ${link("./settings.html","Settings","settings",active)}
    </nav>
    <div class="hr"></div>
    <div class="grid">
      <a class="btn" href="/public/index.html">Open Website</a>
      <button class="btn" id="logoutBtn">Logout</button>
    </div>
  `;
  const langSel = document.getElementById("adminLang");
  langSel?.addEventListener("change", (e)=>{
    setLocale(e.target.value);
    location.reload();
  });
  function link(href,label,key,activeKey){
    const cls = key===activeKey ? "active" : "";
    return `<a class="${cls}" href="${href}">${label}</a>`;
  }
}

export function toast(text){
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2400);
}
