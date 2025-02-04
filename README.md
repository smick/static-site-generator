# Static Site Generator

## 🚀 Overview
This simple static site generator:
- Supports **reusable components** with `{{ include common/header.html }}`.
- Copies **all `.css` files** automatically.
- Handles **images** by copying any `img/` folder.
- **Deletes old files** before rebuilding.
- Provides **local development** with `npm run dev`.

## 📂 Folder Structure
```
project/
│── content/           # Source files
│   ├── index.html     # Main page
│   ├── styles.css     # CSS (copied automatically)
│   ├── img/           # Images (copied automatically)
│   ├── common/        # Shared templates (not copied)
│   │   ├── header.html
│   │   ├── footer.html
│   ├── subpage/
│   │   ├── index.html
│   │   ├── extra.css
│   │   ├── img/
│── public/            # Generated output
│── src/               # Generator script
│── package.json
│── README.md
```

## 🛠 Usage

### 1️⃣ **Generate the Site**
```sh
npm run build
```
- Clears `public/`
- Processes `index.html`
- Copies `.css` and `img/`
- Inserts `{{ include file.html }}`

### 2️⃣ **Use Reusable Components**
In any `index.html`:
```html
{{ include common/header.html }}
```
Files from `content/common/` will be **inserted dynamically**.

### 3️⃣ **Include Any CSS**
All `.css` files are **copied automatically**. Just link them:
```html
<link rel="stylesheet" href="styles.css">
```

### 4️⃣ **Serve the Site Locally**
```sh
npm run dev
```
View your site at `http://localhost:8080`.

## 🔄 Example Usage

### 📌 `content/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Site</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    {{ include common/header.html }}
    <main>
        <p>Welcome!</p>
    </main>
    {{ include common/footer.html }}
</body>
</html>
```

### 📌 `content/common/header.html`
```html
<header>
    <h1>My Static Site</h1>
</header>
```

### 📌 `content/styles.css`
```css
body {
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
}
```

### 🔄 **Generated `public/index.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Site</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>My Static Site</h1>
    </header>
    <main>
        <p>Welcome!</p>
    </main>
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>
```

## 🎯 Features Recap
✅ **Auto file copying** (CSS, images)  
✅ **Reusable includes** for headers & footers  
✅ **Automatic cleanup** before rebuilding  
✅ **Live preview** with `npm run dev`  

💡 **Build your site, run `npm run build`, and you're done!** 🚀
