Alievs Space MMC — Premium Multi-page Website + Admin Panel (Static Demo)

Open:
- public/index.html
- admin/login.html (password: admin123)

How it works:
- Admin panel stores site content in localStorage.
- Public pages read content from localStorage; if empty, they use public/data/content.default.json
- Leads submitted from Contact are saved and visible in Admin -> Leads.

Tip:
For best results, run a local server:
- VSCode Live Server, or
- python -m http.server