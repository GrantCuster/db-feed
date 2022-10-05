import formidable from "formidable";
import prisma from "../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const newPost = await prisma.post.create({
      data: JSON.parse(fields.newPost),
    });
    return res.status(200).json(newPost);
  });
};
