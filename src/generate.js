const fs = require("fs");
const path = require("path");

// Paths
const CONTENT_DIR = path.join(__dirname, "../content");
const PUBLIC_DIR = path.join(__dirname, "../public");

// Function to delete the public directory before regenerating
const cleanPublicDir = () => {
    if (fs.existsSync(PUBLIC_DIR)) {
        fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
        console.log(`Deleted old public directory: ${PUBLIC_DIR}`);
    }
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
};

// Function to copy a file
const copyFile = (src, dest) => {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} → ${dest}`);
};

// Function to copy a directory while excluding `.html` files
const copyDirectory = (srcDir, destDir, excludeHTML = false) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath, excludeHTML);
        } else {
            if (excludeHTML && file.endsWith(".html")) {
                console.log(`Skipping HTML file: ${srcPath}`);
                return;
            }
            copyFile(srcPath, destPath);
        }
    });
};

// Function to find and process `_include.html` files in any directory
const processHTML = (filePath, baseDir) => {
    let content = fs.readFileSync(filePath, "utf8");

    // Handle {{ include _filename.html }} shortcodes
    content = content.replace(/\{\{\s*include\s+([\w./-]+)\s*\}\}/g, (match, includeFile) => {
        let includePath;

        // If it's a common include (e.g., common/header.html)
        if (includeFile.startsWith("common/")) {
            includePath = path.join(CONTENT_DIR, includeFile);
        }
        // If it's a local include (e.g., _include-me.html)
        else if (includeFile.startsWith("_")) {
            includePath = path.join(baseDir, includeFile);
        }
        // If no match, assume it's in the root of content/
        else {
            includePath = path.join(CONTENT_DIR, includeFile);
        }

        if (fs.existsSync(includePath)) {
            return fs.readFileSync(includePath, "utf8");
        } else {
            console.warn(`Include file not found: ${includePath}`);
            return ""; // Remove the shortcode if file is missing
        }
    });

    return content;
};

// Recursive function to process content directory
const processDirectory = (srcDir, destDir) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (fs.statSync(srcPath).isDirectory()) {
            if (file === "common") return;
            processDirectory(srcPath, destPath);
        } else if (file.startsWith("_")) {
            console.log(`Skipping hidden include file: ${srcPath}`);
            return; // Don't copy _*.html files
        } else if (file === "index.html") {
            const processedHTML = processHTML(srcPath, srcDir);
            fs.writeFileSync(destPath, processedHTML, "utf8");
            console.log(`Generated: ${destPath}`);
        } else {
            copyFile(srcPath, destPath);
        }
    });
};

// Ensure common/ is copied entirely, but exclude .html files
const copyCommonFolder = () => {
    const COMMON_SRC = path.join(CONTENT_DIR, "common");
    const COMMON_DEST = path.join(PUBLIC_DIR, "common");
    if (fs.existsSync(COMMON_SRC)) {
        console.log(`Copying common folder to public directory (excluding .html files).`);
        copyDirectory(COMMON_SRC, COMMON_DEST, true); // Exclude HTML files
    }
};

// Start processing
cleanPublicDir();
processDirectory(CONTENT_DIR, PUBLIC_DIR);
copyCommonFolder();
console.log("Static site generation complete.");
