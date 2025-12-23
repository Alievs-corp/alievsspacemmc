# How to Serve This Static Website

## The Problem

The website's navigation links were using relative paths (`../index.html`, `./pages/...`) which only worked correctly when viewing pages from within the `public/pages/` subdirectory. When viewing `index.html` from the root, these links would break.

## The Solution

I've updated all navigation links to use **absolute paths** (starting with `/`) so they work consistently regardless of which page you're viewing, as long as you serve the website from the `public/` directory as the document root.

## How to Serve the Website

### Option 1: Python HTTP Server (Recommended)

Navigate to the `public/` directory and run:

```bash
cd public
python -m http.server 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js HTTP Server

If you have Node.js installed:

```bash
cd public
npx http-server -p 8000
```

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `public/index.html`
3. Select "Open with Live Server"

### Option 4: Any Static File Server

Serve the `public/` directory as the document root. The website expects:
- `/` → `index.html`
- `/pages/*.html` → pages in the pages subdirectory
- `/admin/*.html` → admin panel pages
- `/css/*.css` → stylesheets
- `/js/*.js` → JavaScript files

## Important Notes

- **Always serve from the `public/` directory** - This is the document root
- The navigation links now use absolute paths (e.g., `/index.html`, `/pages/blog.html`)
- CSS and JavaScript imports remain relative (they work fine as-is)
- The admin panel is accessible at `/admin/login.html` (password: `admin123`)

## What Was Fixed

1. Navigation links in `public/js/components/layout.js` (header, footer, drawer)
2. Links in `public/index.html`
3. JavaScript-generated links in all page modules (`blog.js`, `projects.js`, `careers.js`, etc.)
4. Hardcoded links in HTML files (`post.html`, `project.html`, `contact.html`)

All navigation links now use absolute paths starting with `/`, ensuring they work correctly when served from the `public/` directory.


