import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // @ts-ignore
  const id = context.params.id as string;

  let post = await prisma.post.findFirst({
    where: {
      // @ts-ignore
      slug: id,
    },
  });

  const prev = await prisma.post.findMany({
    skip: 1,
    cursor: { id: post.id },
    take: -1,
    orderBy: { id: "desc" },
  });
  const next = await prisma.post.findMany({
    skip: 1,
    cursor: { id: post.id },
    take: 1,
    orderBy: { id: "desc" },
  });
  const post_count = await prisma.post.count();
  const random = await prisma.post.findMany({
    skip: Math.floor(Math.random() * post_count),
    take: 1,
  });

  // To serialize date object, could do better
  post = JSON.parse(JSON.stringify(post));

  return {
    props: {
      post,
      prevSlug: prev[0] ? prev[0].slug : null,
      nextSlug: next[0] ? next[0].slug : null,
      randomSlug: random[0] ? random[0].slug : null,
    },
  };
};

const Post = (props) => {
  const { post, prevSlug, nextSlug, randomSlug } = props;
  const [imageFullSize, setImageFullSize] = useState(false);
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <>
      <div className="pt-4">
        <div className="flex max-w-[620px] mx-auto justify-between px-4 md:px-0">
          <div>Grant Custer</div>
          <div className="flex gap-3">
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
        </div>
      </div>

      <div className="px-4 py-4 border-b-2 border-zinc-200 dark:border-zinc-700 md:px-0">
        <div className="flex max-w-[620px] mx-auto justify-between">
          <Link href="/">
            <a className="underline">Feed</a>
          </Link>
          <div className="flex gap-3">
            {randomSlug && (
              <Link href={`/post/${randomSlug}`}>
                <a className="underline">Random</a>
              </Link>
            )}
            {prevSlug && (
              <Link href={`/post/${prevSlug}`}>
                <a className="underline">Previous</a>
              </Link>
            )}
            {nextSlug && (
              <Link href={`/post/${nextSlug}`}>
                <a className="underline">Next</a>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div key={id}>
        <div className="max-w-[620px] mx-auto py-4 pt-6 px-4 md:px-0">
          <span className="capitalize">{post.feed_type}</span> ↓{" "}
          {new Date(post.date).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="w-full overflow-x-auto">
          <img
            className="mx-auto"
            style={{
              cursor: imageFullSize ? "zoom-out" : "zoom-in",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.125)",
              maxWidth: imageFullSize ? "none" : "100%",
            }}
            src={post.image}
            onClick={() => setImageFullSize(!imageFullSize)}
          />
        </div>
        <div className="max-w-[640px] mx-auto py-4 px-4 md:px-0 pb-6">
          <div className="flex flex-col gap-1">
            <div>{post.text}</div>
            {post.from || post.via ? (
              <div>
                {post.from && (
                  <>
                    from{" "}
                    <Link href={post.from}>
                      <a target="_blank" className="underline">
                        {post.from}
                      </a>
                    </Link>{" "}
                  </>
                )}
                {post.via && <>via {post.via}</>}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mb-8 border-b-2 border-zinc-200 dark:border-zinc-700"></div>
      </div>
    </>
  );
};

export default Post;
