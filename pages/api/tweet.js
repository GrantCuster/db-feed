import formidable from "formidable";
import fs from "fs";
import Twitter from "twitter";

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

export default async (req, res) => {
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const postId = fields.postId;
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
    statusText += `https://feed.grantcuster.com/p/${postId}`;
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

    // ↓
    // ${newPost.text}${newPost.from || newPost.via ? `
    // ${newPost.from ? `from ${newPost.from}}` : ""}`;
    console.log(statusText);
    return;
    const data = fs.readFileSync(files.file.filepath);
    client.post(
      "media/upload",
      { command: "INIT", total_bytes: file.size, media_type: file.mimetype },
      function (error, media, response) {
        client.post(
          "media/upload",
          {
            command: "APPEND",
            media_id: media.media_id_string,
            media: data,
            segment_index: 0,
          },
          function (error, _, response) {
            client.post(
              "media/upload",
              {
                command: "FINALIZE",
                media_id: media.media_id_string,
              },
              function (error, _, response) {
                client.post(
                  "statuses/update",
                  {
                    status: statusText,
                    media_ids: media.media_id_string,
                  },
                  function (error, tweet, response) {
                    return res.status(201).send("");
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};
