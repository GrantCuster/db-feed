import formidable from "formidable";
import fs from "fs";
import { login } from "masto";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const masto = await login({
    url: "https://vis.social",
    accessToken: process.env.MASTODON_TOKEN,
  });

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const file = files.file;
    const newPost = JSON.parse(fields.newPost);

    let charLimit = 280;
    // type and arrrow
    charLimit -= newPost.feed_type.length + 3;
    // post url
    charLimit -= 23;
    // newline
    charLimit -= 1;
    // via
    if (newPost.from || newPost.via) charLimit -= 1;
    if (newPost.from) charLimit -= 5 + 23;
    if (newPost.via) charLimit -= 4 + 23;
    // buffer
    charLimit -= 3;

    let statusText = capitalize(newPost.feed_type);
    statusText += ` ↓ `;
    statusText += `https://feed.grantcuster.com/post/${fields.slug}`;
    if (newPost.text) {
      statusText += "\n";
      statusText += `${newPost.text.substring(0, charLimit)}`;
    }
    if (newPost.from || newPost.via) {
      statusText += "\n";
      if (newPost.from) {
        statusText += `from ${newPost.from}`;
        if (newPost.via) {
          statusText += ` `;
        }
      }
      if (newPost.via) {
        statusText += `via ${newPost.via}`;
      }
    }

    const attachment = await masto.v2.mediaAttachments.create({
      file: fs.readFileSync(files.file.filepath),
    });

    await masto.v1.statuses.create({
      status: statusText,
      visibility: "public",
      mediaIds: [attachment.id],
    });

    console.log("tooted");
    res.status(200).json({ status: "tooted" });
    console.log(statusText);
  });
};
