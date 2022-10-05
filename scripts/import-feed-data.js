const fs = require("fs");
const frontmatter = require("@github-docs/frontmatter");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

fs.readdir("../old-feed/content/posts", async (err, files) => {
  files.forEach(async (file) => {
    const { data } = frontmatter(
      fs.readFileSync(`../old-feed/content/posts/${file}`, "utf8")
    );
    let migratePost = {
      date: data.date,
      feed_type: data.feed_type,
      image: data.image.includes("http")
        ? data.image
        : "https://feed.grantcuster.com" + data.image,
    };
    if (data.text) migratePost.text = data.text;
    if (data.from) migratePost.from = data.from;
    if (data.via) migratePost.via = data.via;

    if (!migratePost.feed_type) migratePost.feed_type = "work";

    if (data.date && migratePost.date && data.image) {
      await prisma.post.create({ data: migratePost });
    }
  });
});
