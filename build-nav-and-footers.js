// inject.js — run with: node inject.js
import fs from "fs/promises";
import path from "path";

// --- Config ---
const COMPONENTS_DIR = "reusable-html-components";
const NAV_FILE = path.join(COMPONENTS_DIR, "nav.html");
const FOOTER_FILE = path.join(COMPONENTS_DIR, "footer.html");
const SITE_DIR = ".";  // Root directory where your site lives
const BUILD_DIR = "build";
const IGNORE_DIRS = ["reusable-html-components", "build"]; // Skip these folders
const REMOVE_SCRIPT_SRC = '/scripts/reusable-html-loader.js'; // Script to remove

// --- Read nav and footer ---
const nav_html = await fs.readFile(NAV_FILE, "utf8");
const footer_html = await fs.readFile(FOOTER_FILE, "utf8");

// --- Clean/create build directory ---
async function cleanBuildDir() {
  try {
    await fs.rm(BUILD_DIR, { recursive: true, force: true });
  } catch (err) {
    // ignore if it doesn't exist
  }
  await fs.mkdir(BUILD_DIR, { recursive: true });
}

// --- Recursively get all files ---
async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

// --- Process HTML or copy other files ---
async function processFile(filePath) {
  const relativePath = path.relative(SITE_DIR, filePath);
  const outputFile = path.join(BUILD_DIR, relativePath);
  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  if (filePath.endsWith(".html")) {
    let content = await fs.readFile(filePath, "utf8");

    // Inject header/footer
    content = content.replace(
      "<header></header>",
      `<header>\n${nav_html}\n</header>`
    );
    content = content.replace(
      "<footer></footer>",
      `<footer>\n${footer_html}\n</footer>`
    );

    // Remove script tag
    content = content.replace(
      `<script src="${REMOVE_SCRIPT_SRC}"></script>`,
      ""
    );

    await fs.writeFile(outputFile, content, "utf8");
    console.log(`Processed HTML: ${filePath} → ${outputFile}`);
  } else {
    await fs.copyFile(filePath, outputFile);
    console.log(`Copied file: ${filePath} → ${outputFile}`);
  }
}

// --- Main build process ---
async function buildSite() {
  await cleanBuildDir();

  for await (const filePath of walk(SITE_DIR)) {
    await processFile(filePath);
  }

  console.log(`Build complete! All files are in '${BUILD_DIR}' folder.`);
}

// Run
buildSite().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});

