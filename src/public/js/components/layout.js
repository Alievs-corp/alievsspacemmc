import { SUPPORTED_LOCALES, getLocale, setLocale, t } from "../i18n.js";

/* Premium components: header/footer injection + mobile drawer */
export function mountHeader({ active } = {}) {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const currentLocale = getLocale();

  header.innerHTML = `
    <div class="container headerInner">
      <a class="brand" href="/public/index.html" aria-label="Home">
        <div class="brandMark" aria-hidden="true"></div>
        <div class="brandText">
          <b id="brandName">Alievs Space MMC</b>
          <span id="brandTagline">Premium Digital & Commerce Ecosystem</span>
        </div>
      </a>

      <nav class="nav" aria-label="Primary navigation">
        ${navLink(t("nav.home", "Home"), "/public/index.html", "home", active)}
        ${navLink(
          t("nav.about", "About"),
          "/public/pages/about.html",
          "about",
          active
        )}
        ${navLink(
          t("nav.services", "Services"),
          "/public/pages/services.html",
          "services",
          active
        )}
        ${navLink(
          t("nav.industries", "Industries"),
          "/public/pages/industries.html",
          "industries",
          active
        )}
        ${navLink(
          t("nav.projects", "Case Studies"),
          "/public/pages/projects.html",
          "projects",
          active
        )}
        ${navLink(
          t("nav.careers", "Careers"),
          "/public/pages/careers.html",
          "careers",
          active
        )}
        ${navLink(t("nav.blog", "Blog"), "/public/pages/blog.html", "blog", active)}
        ${navLink(
          t("nav.contact", "Contact"),
          "/public/pages/contact.html",
          "contact",
          active
        )}
        <a class="ctaBtn" href="/public/pages/contact.html">${t(
          "nav.cta",
          "Request a Proposal"
        )}</a>
        <div class="langSelectWrap">
           <label class="small" for="langSelect_header">${t(
             "ui.language",
             "Language"
           )}</label>
          <select class="select" id="langSelect_header">
            ${SUPPORTED_LOCALES.map(
              (l) =>
                `<option value="${l.code}" ${
                  l.code === currentLocale ? "selected" : ""
                }>${l.label}</option>`
            ).join("")}
          </select>
        </div>
      </nav>

      <button class="menuBtn iconBtn" id="openDrawer" aria-label="${t(
        "ui.menu",
        "Menu"
      )}">${t("ui.menu", "Menu")}</button>
    </div>

    <div class="drawer" id="drawer" aria-hidden="true">
      <div class="drawerPanel" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawerTop">
          <div class="badge"><i></i> ${t("ui.menu", "Menu")}</div>
          <button class="iconBtn" id="closeDrawer" aria-label="${t(
            "ui.close",
            "Close"
          )}">${t("ui.close", "Close")}</button>
        </div>
        <div class="hr"></div>
        ${drawerLink(t("nav.home", "Home"), "/public/index.html")}
        ${drawerLink(t("nav.about", "About"), "/public/pages/about.html")}
        ${drawerLink(t("nav.services", "Services"), "/public/pages/services.html")}
        ${drawerLink(
          t("nav.industries", "Industries"),
          "/public/pages/industries.html"
        )}
        ${drawerLink(
          t("nav.projects", "Case Studies"),
          "/public/pages/projects.html"
        )}
        ${drawerLink(t("nav.careers", "Careers"), "/public/pages/careers.html")}
        ${drawerLink(t("nav.blog", "Blog"), "/public/pages/blog.html")}
        ${drawerLink(t("nav.contact", "Contact"), "/public/pages/contact.html")}
        <div class="hr"></div>
        <a class="ctaBtn" style="display:block;text-align:center" href="/public/pages/contact.html">${t(
          "nav.cta",
          "Request a Proposal"
        )}</a>
        <div class="spacer"></div>
        <div class="langSelectWrap">
          <label class="small" for="langSelect_drawer">${t(
            "ui.language",
            "Language"
          )}</label>
          <select class="select" id="langSelect_drawer">
            ${SUPPORTED_LOCALES.map(
              (l) =>
                `<option value="${l.code}" ${
                  l.code === currentLocale ? "selected" : ""
                }>${l.label}</option>`
            ).join("")}
          </select>
        </div>
      </div>
    </div>
  `;

  const drawer = document.getElementById("drawer");
  const open = document.getElementById("openDrawer");
  const close = document.getElementById("closeDrawer");
  const panel = drawer?.querySelector(".drawerPanel");

  const openDrawer = () => {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeDrawer = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  open?.addEventListener("click", openDrawer);
  close?.addEventListener("click", closeDrawer);
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
  panel
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeDrawer));

  const langHeader = document.getElementById("langSelect_header");
  const langDrawer = document.getElementById("langSelect_drawer");
  const onLangChange = (e) => {
    const next = e.target.value;
    setLocale(next);
    location.reload();
  };
  langHeader?.addEventListener("change", onLangChange);
  langDrawer?.addEventListener("change", onLangChange);

  function navLink(label, href, key, activeKey) {
    const cls = key === activeKey ? "active" : "";
    return `<a class="${cls}" href="${href}">${label}</a>`;
  }
  function drawerLink(label, href) {
    return `<a href="${href}">${label}</a>`;
  }
}

export function mountFooter() {
  const footer = document.getElementById("siteFooter");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footerGrid">
        <div>
          <div class="row" style="gap:12px">
            <div class="brandMark" aria-hidden="true" style="width:32px;height:32px;border-radius:12px"></div>
            <div>
              <div style="font-weight:700" id="fBrand">Alievs Space MMC</div>
              <div class="small" id="fTag">Premium Digital & Commerce Ecosystem</div>
            </div>
          </div>
          <div class="sep"></div>
          <div class="muted" id="fDesc">
            ${t(
              "public.footerDesc",
              "Premium web & mobile development, e-commerce/marketplace systems, and banking-ready dashboards."
            )}
          </div>
        </div>
        <div>
          <div class="h3">${t("nav.about", "About")}</div>
          <div class="muted">
            <div><a href="/public/pages/about.html">${t(
              "nav.about",
              "About"
            )}</a></div>
            <div><a href="/public/pages/services.html">${t(
              "nav.services",
              "Services"
            )}</a></div>
            <div><a href="/public/pages/projects.html">${t(
              "nav.projects",
              "Case Studies"
            )}</a></div>
            <div><a href="/public/pages/careers.html">${t(
              "nav.careers",
              "Careers"
            )}</a></div>
          </div>
        </div>
        <div>
          <div class="h3">${t("nav.contact", "Contact")}</div>
          <div class="muted">
            <div><span class="small">Email:</span> <a id="fEmail" href="mailto:hello@alievsspace.com">hello@alievsspace.com</a></div>
            <div><span class="small">Phone:</span> <a id="fPhone" href="#">+994 (00) 000 00 00</a></div>
            <div class="hr"></div>
            <div class="chips">
              <a class="chip" id="sInsta" href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a class="chip" id="sLinked" href="#" target="_blank" rel="noreferrer">LinkedIn</a>
              <a class="chip" id="sYT" href="#" target="_blank" rel="noreferrer">YouTube</a>
              <a class="chip" href="/admin/login.html">${t(
                "nav.admin",
                "Admin"
              )}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="sep"></div>
      <div class="small">© <span id="year"></span> Alievs Space MMC. All rights reserved.</div>
    </div>
  `;
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}
