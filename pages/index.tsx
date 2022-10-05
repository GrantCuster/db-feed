import { GetStaticProps } from "next";
import React from "react";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  let feed = await prisma.post.findMany({
    orderBy: {
      date: "desc",
    },
    take: 10,
  });
  // To serialize date object, could do better
  feed = JSON.parse(JSON.stringify(feed));
  return {
    props: { feed },
  };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <div className="max-w-[640px] mx-auto pt-4">
      <div>Grant Custer</div>
      <div className="flex gap-3 pl-4">
        <div>Feed</div>
        <div>Index</div>
        <div>Twitter</div>
      </div>
      <div className="pt-4">Feed</div>
      <div className="flex gap-3 pl-4">Work and inspiration in progress</div>

      <main className="flex flex-col gap-16 pt-16">
        {props.feed.map((post) => (
          <div key={post.id} className="post">
            <Post post={post} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default Blog;
