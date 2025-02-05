import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

// Ensure __dirname works in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const CONTENT_DIR = path.join(__dirname, "../content");
const PUBLIC_DIR = path.join(__dirname, "../public");

// Function to delete the public directory before regenerating
const cleanPublicDir = () => {
    if (fs.existsSync(PUBLIC_DIR)) {
        fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
        console.log(chalk.green("🗑️  Deleted old public directory"));
    }
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    console.log(chalk.green("📁 Created new public directory"));
};

// Function to copy a file
const copyFile = (src, dest) => {
    try {
        fs.copyFileSync(src, dest);
        console.log(chalk.green(`✅ Copied: ${src} → ${dest}`));
    } catch (error) {
        console.error(chalk.red(`❌ Failed to copy: ${src} → ${dest}\nError: ${error.message}`));
        process.exit(1); // Stop the build on failure
    }
};

// Function to recursively copy directories (skipping _* files)
const copyDirectory = (srcDir, destDir) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (file.startsWith("_")) {
            console.log(chalk.yellow(`⚠️  Skipping hidden file/folder: ${srcPath}`));
            return; // Skip _* files and folders
        }

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    });
};

// Function to process HTML files and replace `{{ include _file.html }}`
const processHTML = (filePath, baseDir) => {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace includes for `_*.html` files
    content = content.replace(/\{\{\s*include\s+([\w./-]+)\s*\}\}/g, (match, includeFile) => {
        let includePath;

        // ✅ If the path starts with '/', resolve from content/ (absolute path)
        if (includeFile.startsWith("/")) {
            includePath = path.join(CONTENT_DIR, includeFile.substring(1)); // Remove leading '/'
        }
        // ✅ Otherwise, resolve from the current directory (relative path)
        else {
            includePath = path.join(baseDir, includeFile);
        }

        if (fs.existsSync(includePath)) {
            console.log(chalk.green(`✅ Included: ${includeFile}`));
            return fs.readFileSync(includePath, "utf8");
        } else {
            console.error(chalk.red(`❌ Include file not found: ${includePath}`));
            process.exit(1); // Stop execution on missing include
        }
    });

    return content;
};

// Function to process content directory
const processDirectory = (srcDir, destDir) => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach(file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (file.startsWith("_")) {
            console.log(chalk.yellow(`⚠️  Skipping hidden file: ${srcPath}`));
            return; // Ignore _* files
        }

        if (fs.statSync(srcPath).isDirectory()) {
            processDirectory(srcPath, destPath);
        } else if (file.endsWith(".html")) {
            const processedHTML = processHTML(srcPath, srcDir);
            fs.writeFileSync(destPath, processedHTML, "utf8");
            console.log(chalk.green(`✅ Generated: ${destPath}`));
        } else {
            copyFile(srcPath, destPath);
        }
    });
};

// Start processing
console.log(chalk.blue("\n🚀 Starting site generation...\n"));
cleanPublicDir();
processDirectory(CONTENT_DIR, PUBLIC_DIR);
console.log(chalk.green("\n🎉 Site generation complete! Your files are ready in the public/ folder.\n"));
