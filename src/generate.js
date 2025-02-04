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

// Function to copy entire directories
const copyDirectory = (srcDir, destDir) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    });
};

// Function to read and process HTML files with includes
const processHTML = (filePath, baseDir) => {
    let content = fs.readFileSync(filePath, "utf8");

    // Handle {{ include filename }} shortcodes
    content = content.replace(/\{\{\s*include\s+([\w./-]+)\s*\}\}/g, (match, includeFile) => {
        const includePath = path.join(CONTENT_DIR, includeFile); // Always resolve from content/
        if (fs.existsSync(includePath)) {
            return fs.readFileSync(includePath, "utf8");
        } else {
            console.warn(`Include file not found: ${includePath}`);
            return ""; // Remove the shortcode if file is missing
        }
    });

    return content;
};

// Recursive function to process content directory (excluding common/)
const processDirectory = (srcDir, destDir) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (fs.statSync(srcPath).isDirectory()) {
            if (file === "common") {
                console.log(`Skipping common folder: ${srcPath}`);
                return;
            }
            processDirectory(srcPath, destPath);
        } else if (file === "index.html") {
            const processedHTML = processHTML(srcPath, srcDir);
            fs.writeFileSync(destPath, processedHTML, "utf8");
            console.log(`Generated: ${destPath}`);
        } else {
            // Copy all other files (CSS, images, etc.)
            copyFile(srcPath, destPath);
        }
    });
};

// Start processing
cleanPublicDir();
processDirectory(CONTENT_DIR, PUBLIC_DIR);
console.log("Static site generation complete.");
