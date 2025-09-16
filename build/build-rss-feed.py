import datetime
from pathlib import Path
from bs4 import BeautifulSoup  # pip install beautifulsoup4

# --- Config ---
SITE_TITLE = "Warren Van Zuydam"
SITE_URL = "https://warrenvz.github.io"
POSTS_DIR = Path("blog-posts")
OUTPUT_RSS = Path("feed.xml")

# --- Helpers ---
def get_posts():
    posts = []
    for date_folder in sorted(POSTS_DIR.iterdir(), reverse=True):
        if date_folder.is_dir():
            for html_file in date_folder.glob("*.html"):
                url = f"{SITE_URL}/blog-posts/{date_folder.name}/{html_file.name}"
                # Extract <title> if possible, otherwise fallback to filename
                with open(html_file, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")
                    title_tag = soup.find("title")
                    title = title_tag.text.strip() if title_tag else html_file.stem
                # Use folder name as date (YYYY-MM-DD)
                try:
                    post_date = datetime.datetime.strptime(date_folder.name, "%Y-%m-%d")
                except ValueError:
                    post_date = datetime.datetime.fromtimestamp(html_file.stat().st_mtime)
                posts.append({"title": title, "url": url, "date": post_date})
    return sorted(posts, key=lambda p: p["date"], reverse=True)

def generate_rss(posts):
    rss_items = []
    for p in posts:
        rss_items.append(f"""
        <item>
          <title>{p["title"]}</title>
          <link>{p["url"]}</link>
          <pubDate>{p["date"].strftime("%a, %d %b %Y %H:%M:%S +0000")}</pubDate>
        </item>
        """)
    rss = f"""<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>{SITE_TITLE}</title>
        <link>{SITE_URL}</link>
        <description>{SITE_TITLE} RSS Feed</description>
        <image>
          <url>{SITE_URL}/images/rss-icon.png</url>
          <title>{SITE_TITLE}</title>
          <link>{SITE_URL}/</link>
          <width>32</width>
          <height>32</height>
        </image>
        {''.join(rss_items)}
      </channel>
    </rss>
    """
    return rss

# --- Run ---
posts = get_posts()
OUTPUT_RSS.write_text(generate_rss(posts), encoding="utf-8")

print(f"Generated {OUTPUT_RSS} with {len(posts)} posts.")

