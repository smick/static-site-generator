# Sx4 (Super Simple Static Site) + Generator

## 🚀 Overview
Sx4 is a lightweight **static site generator** that:
- Supports **reusable components** with `{{ include /common/_header.html }}`.
- **Copies everything** to `public/`, **unless it starts with an underscore (`_`)**.
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
│   │   ├── img/           # Folder for test-page images
│   │   │   ├── example.jpg  # Copied to /public/test-page/img/example.jpg
│── public/            # Generated output (auto-deleted & rebuilt)
│── src/               # Generator script
│   ├── generate.js    # Site builder
│   ├── server.js      # Dev server with live reload
│── package.json       # NPM scripts
│── README.md          # Documentation
```

---

## 📌 **How File Paths Work in Sx4**
### ✅ **Absolute Paths (`/`)**
Use **absolute paths** (`/`) when referencing assets **from anywhere in the site**:
```html
<link rel="stylesheet" href="/common/main.css">
<script src="/common/main.js" defer></script>
```
- **Works in all subpages**, since `/common/main.css` is copied to `/public/common/main.css`.
- Use `/common/anything` to reference assets in `common/` **from any page**.

### ✅ **Relative Paths (No `/`)**
Use **relative paths** for **local assets within a folder**:
```html
<img src="img/example.jpg" alt="Example Image">
```
- If used in `/test-page/index.html`, it correctly loads from `/public/test-page/img/example.jpg`.
- **DO NOT** use a leading `/` unless the file exists in `public/` root.

---

## 🛠 Usage

### **1️⃣ Generate the Site**
```sh
npm run build
```
- Clears `public/`
- Processes `.html` files
- Copies **everything** unless it **starts with `_`**
- Inserts `{{ include _file.html }}` where needed

### **2️⃣ Use Reusable Components**
**In any HTML file**, include shared components like this:
```html
{{ include /common/_header.html }}
```
- Files starting with `_` (e.g., `_header.html`) **are NOT copied** to `public/`, but can be **included dynamically**.

### **3️⃣ Link Any CSS or JS**
```html
<link rel="stylesheet" href="/common/main.css">
<script src="/common/main.js" defer></script>
```
- **Works anywhere in the project.**
- Use `/common/` for assets in the `common/` folder.

### **4️⃣ Serve the Site Locally**
```sh
npm run dev
```
- Starts a local server at `http://localhost:8080`.
- Watches for changes in `content/` and **auto-rebuilds & refreshes** your site.

---

## 🚀 Deployment

### **How to Deploy**
1. **Run the build command** to generate the `public/` folder:
   ```sh
   npm run build
   ```
2. **Serve the `public/` folder** using any static hosting provider (e.g., Netlify, Vercel, GitHub Pages, Nginx, Apache).

---

## 🚀 Using Sx4 for Your Own Project

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/smick/static-site-generator.git my-project
cd my-project
```

### **2️⃣ Update `package.json`**
Edit `package.json` to update the project details:
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My custom static site",
  "author": "Your Name",
  "license": "MIT"
}
```

### **3️⃣ Set Up Your Own Git Repository**
1. Remove the existing Git history:
   ```sh
   rm -rf .git
   ```
2. Initialize a new Git repository:
   ```sh
   git init
   git add .
   git commit -m "Initial commit for my project"
   ```
3. Set your new GitHub repository:
   ```sh
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## 🎯 Features Recap
✅ **Copies everything** unless it starts with `_`  
✅ **Reusable includes** for headers & footers (ignored in output, used in templates)  
✅ **Automatic cleanup** before rebuilding  
✅ **Live preview with hot reload (`npm run dev`)**  
✅ **Easy deployment—just serve `public/`**  

💡 **Run `npm run dev`, edit your files, and watch your site update live!** 🚀
