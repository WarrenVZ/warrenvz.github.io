from pathlib import Path
import shutil

# --- Config ---
COMPONENTS_DIR = Path("reusable-html-components")
NAV_FILE = COMPONENTS_DIR / "nav.html"
FOOTER_FILE = COMPONENTS_DIR / "footer.html"
SITE_DIR = Path(".")  # Root directory where your site lives
BUILD_DIR = Path("build")
IGNORE_DIRS = ["reusable-html-components", "build"]  # Skip these folders
REMOVE_SCRIPT_SRC = '/scripts/reusable-html-loader.js'  # Script to remove

# --- Read nav and footer ---
with open(NAV_FILE, "r", encoding="utf-8") as f:
    nav_html = f.read()

with open(FOOTER_FILE, "r", encoding="utf-8") as f:
    footer_html = f.read()

# --- Clean/create build directory ---
if BUILD_DIR.exists():
    shutil.rmtree(BUILD_DIR)
BUILD_DIR.mkdir(parents=True)

# --- Process all files ---
all_paths = [p for p in SITE_DIR.rglob("*") if all(ign not in p.parts for ign in IGNORE_DIRS)]

for path in all_paths:
    if path.is_file():  # Only process files
        relative_path = path.relative_to(SITE_DIR)
        output_file = BUILD_DIR / relative_path
        output_file.parent.mkdir(parents=True, exist_ok=True)

        if path.suffix.lower() == ".html":
            # Read HTML
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            # Inject header/footer
            new_content = content.replace("<header></header>", f"<header>\n{nav_html}\n</header>")
            new_content = new_content.replace("<footer></footer>", f"<footer>\n{footer_html}\n</footer>")

            # Remove script tag
            new_content = new_content.replace(f'<script src="{REMOVE_SCRIPT_SRC}"></script>', '')

            # Write modified HTML
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(new_content)

            print(f"Processed HTML: {path} → {output_file}")
        else:
            # Copy non-HTML files as-is
            shutil.copy2(path, output_file)
            print(f"Copied file: {path} → {output_file}")

print(f"Build complete! All files are in '{BUILD_DIR}' folder.")

