import { promises as fs } from "fs";
import path from "path";

// --- Config ---
const SITE_TITLE = "Warren Van Zuydam";
const SITE_URL = "https://warrenvz.github.io";
const POSTS_DIR = "blog-posts";
const OUTPUT_RSS = "feed.xml";

// --- Helpers ---
async function getPosts() {
  const posts = [];
  const dateFolders = await fs.readdir(POSTS_DIR);

  // Sort descending
  dateFolders.sort((a, b) => b.localeCompare(a));

  for (const folder of dateFolders) {
    const folderPath = path.join(POSTS_DIR, folder);
    const stat = await fs.stat(folderPath);
    if (!stat.isDirectory()) continue;

    const files = await fs.readdir(folderPath);
    for (const file of files.filter(f => f.endsWith(".html"))) {
      const filePath = path.join(folderPath, file);
      const content = await fs.readFile(filePath, "utf8");

      // Simple regex to get <title>
      const match = content.match(/<title>(.*?)<\/title>/i);
      const title = match ? match[1].trim() : path.parse(file).name;

      // Date from folder or fallback to file mtime
      let postDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(folder)) {
        postDate = new Date(folder);
      } else {
        const fstat = await fs.stat(filePath);
        postDate = fstat.mtime;
      }

      const url = `${SITE_URL}/blog-posts/${folder}/${file}`;
      posts.push({ title, url, date: postDate });
    }
  }

  // Sort posts descending by date
  posts.sort((a, b) => b.date - a.date);
  return posts;
}

function generateRSS(posts) {
  const rssItems = posts.map(p => `
    <item>
      <title>${p.title}</title>
      <link>${p.url}</link>
      <pubDate>${p.date.toUTCString()}</pubDate>
    </item>
  `).join("\n");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_TITLE} RSS Feed</description>
    <image>
      <url>${SITE_URL}/images/rss-icon.png</url>
      <title>${SITE_TITLE}</title>
      <link>${SITE_URL}/</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;
}

// --- Run ---
(async function main() {
  try {
    const posts = await getPosts();
    await fs.writeFile(OUTPUT_RSS, generateRSS(posts), "utf8");
    console.log(`Generated ${OUTPUT_RSS} with ${posts.length} posts.`);
  } catch (err) {
    console.error("Failed to generate RSS feed:", err);
    process.exit(1);
  }
})();

