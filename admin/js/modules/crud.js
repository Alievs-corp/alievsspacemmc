import { uid } from "../store.js";

export function renderTable({ mountId, columns, rows, onEdit, onDelete }){
  const mount = document.getElementById(mountId);
  mount.innerHTML = `
    <table class="table">
      <thead><tr>${columns.map(c=>`<th>${c.label}</th>`).join("")}<th>Actions</th></tr></thead>
      <tbody>
        ${rows.map(r=>`
          <tr>
            ${columns.map(c=>`<td>${escapeHtml(String(r[c.key] ?? ""))}</td>`).join("")}
            <td>
              <button class="btn" data-act="edit" data-id="${r.id}">Edit</button>
              <button class="btn" data-act="del" data-id="${r.id}">Delete</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  mount.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = b.dataset.id;
      const act = b.dataset.act;
      if (act==="edit") onEdit(id);
      if (act==="del") onDelete(id);
    });
  });
}

export function bindForm({ formId, fields, getCurrent, onSubmit, onCancel }){
  const form = document.getElementById(formId);
  const area = document.getElementById(formId + "_fields");
  const current = getCurrent();

  area.innerHTML = fields.map(f=>{
    const val = current?.[f.key] ?? f.default ?? "";
    if (f.type === "textarea"){
      return `<div class="grid"><label class="small">${f.label}</label><textarea class="input" name="${f.key}">${escapeHtml(val)}</textarea></div>`;
    }
    return `<div class="grid"><label class="small">${f.label}</label><input class="input" name="${f.key}" value="${escapeHtml(val)}" placeholder="${escapeHtml(f.placeholder||"")}"/></div>`;
  }).join("");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const out = { ...(current||{}), id: current?.id || uid("item") };
    fields.forEach(f=> out[f.key] = String(fd.get(f.key)||"").trim());
    onSubmit(out);
    form.reset();
  });

  document.getElementById(formId + "_cancel")?.addEventListener("click", ()=>{
    onCancel();
  });
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}
