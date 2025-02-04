# Sx4 (Super Simple Static Site) + Generator

## 🚀 Overview
Sx4 is a lightweight **static site generator** that:
- Supports **reusable components** with `{{ include common/_header.html }}`.
- Copies **all `.css`, `.js`, and asset files** automatically.
- Handles **images** by copying any `img/` folder.
- **Deletes old files** before rebuilding.
- Provides **local development** with automatic hot reloading via `npm run dev`.

---

## 📂 Folder Structure
```
project/
│── content/           # Source files
│   ├── index.html     # Main page
│   ├── common/        # Shared components & assets (copied, but `_*.html` ignored)
│   │   ├── _header.html  # Included but NOT copied
│   │   ├── _footer.html  # Included but NOT copied
│   │   ├── main.css      # Copied to /public/common/main.css
│   │   ├── main.js       # Copied to /public/common/main.js
│   │   ├── logo.png      # Copied to /public/common/logo.png
│   ├── test-page/      # Example subpage
│   │   ├── index.html
│   │   ├── test-page.css
│── public/            # Generated output (auto-deleted & rebuilt)
│── src/               # Generator script
│   ├── generate.js    # Site builder
│   ├── server.js      # Dev server with live reload
│── package.json       # NPM scripts
│── README.md          # Documentation
```

---

## 🛠 Usage

### **1️⃣ Generate the Site**
```sh
npm run build
```
- Clears `public/`
- Processes `index.html`
- Copies `.css`, `.js`, and `img/`
- Inserts `{{ include _file.html }}` where needed

### **2️⃣ Use Reusable Components**
**In any HTML file**, include shared components like this:
```html
{{ include common/_header.html }}
```
- Files starting with `_` (e.g., `_header.html`) **are NOT copied** to `public/`, but can be **included dynamically**.

### **3️⃣ Include Any CSS or JS**
- All `.css` and `.js` files inside `common/` or subfolders **are copied automatically**.
- Just link them in your HTML like this:
```html
<link rel="stylesheet" href="/common/main.css">
<script src="/common/main.js" defer></script>
```
- **Works in all subpages**, since `/common/main.css` is copied to `public/common/main.css`.

### **4️⃣ Serve the Site Locally**
```sh
npm run dev
```
- Starts a local server at `http://localhost:8080`.
- Watches for changes in `content/` and **auto-rebuilds & refreshes** your site.

---

## 🎯 Features Recap
✅ **Auto file copying** (CSS, JS, images, and other assets)  
✅ **Reusable includes** for headers & footers (ignored in output, used in templates)  
✅ **Automatic cleanup** before rebuilding  
✅ **Live preview with hot reload (`npm run dev`)**  

💡 **Just run `npm run dev`, edit your files, and watch your site update live!** 🚀
