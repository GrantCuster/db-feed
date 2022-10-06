const fs = require("fs");
const frontmatter = require("@github-docs/frontmatter");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const source = "../aws-ec2-recovery/files/tempvol/feed/content/posts";

fs.readdir(source, async (err, files) => {
  const queue = files.slice();
  const processQueue = async () => {
    if (queue.length > 0) {
      const file = queue.shift();
      const filename = file.split(".")[0];
      const { data } = frontmatter(
        fs.readFileSync(`${source}/${file}`, "utf8")
      );
      if (data.image) {
        let migratePost = {
          date: data.date,
          feed_type: data.feed_type,
          image: data.image.includes("http")
            ? data.image
            : "https://db-feed.s3.amazonaws.com/legacy" +
              data.image.replace("/images/posts", ""),
          slug: filename,
        };
        if (data.text) migratePost.text = data.text;
        if (data.from) migratePost.from = data.from;
        if (data.via) migratePost.via = data.via;

        if (!migratePost.feed_type) migratePost.feed_type = "work";

        if (data.date && migratePost.date && data.image) {
          await prisma.post.create({ data: migratePost });
        }
      }
      processQueue();
    }
  };
  processQueue();
});
