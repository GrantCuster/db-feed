import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

type Post = {
  id: number;
  title: string;
  createdAt: Date;
};

interface Data {
  posts: Post[];
  nextId: number | undefined;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "GET") {
    const limit = 16;
    const cursor = req.query.cursor ?? "";
    const cursorObj =
      cursor === "" ? undefined : { id: parseInt(cursor as string, 10) };

    const posts = await prisma.post.findMany({
      skip: cursor !== "" ? 1 : 0,
      cursor: cursorObj,
      take: limit,
      orderBy: { id: "desc" },
    });
    return res.json({
      // @ts-ignore
      posts,
      nextId: posts.length === limit ? posts[limit - 1].id : undefined,
    });
  }
};
