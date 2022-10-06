import { GetServerSideProps } from "next";
import Link from "next/link";
import Post from "../components/Post";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let feed = await prisma.post.findMany({
    orderBy: {
      date: "desc",
    },
    take: 24,
  });
  // To serialize date object, could do better
  feed = JSON.parse(JSON.stringify(feed));
  return {
    props: { feed },
  };
};

const Blog = (props) => {
  return (
    <div className="max-w-[640px] mx-auto pt-4 pb-12">
      <div className="px-2 py-3 mb-4 text-center text-black bg-yellow-200">
        Under (re)construction
      </div>
      <div>Grant Custer</div>
      <div className="flex gap-3 pl-4">
        <div>Feed</div>
        <div>
          <Link href="https://grantcuster.com">
            <a className="underline">Index</a>
          </Link>
        </div>
        <div>
          <Link href="https://twitter.com/grantcuster">
            <a className="underline">Twitter</a>
          </Link>
        </div>
      </div>
      <div className="pt-4">Feed</div>
      <div className="flex gap-3 pl-4">Work and inspiration in progress</div>

      <main className="flex flex-col gap-16 pt-12">
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
