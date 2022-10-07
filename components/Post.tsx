import Link from "next/link";
import { Post } from "prisma";

const Post = ({ post }: { post: Post }) => {
  return (
    <div
      className={`flex flex-col gap-4 px-4 md:px-7 py-5 md:py-6 border-b-2 md:border-l-2 md:border-r-2 border-zinc-200 dark:border-zinc-700 border-t-0`}
    >
      <div>
        <span className="capitalize">{post.feed_type}</span> ↓{" "}
        <Link href={`/post/${post.slug}`}>
          <a className="underline">
            {new Date(post.date).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </a>
        </Link>
      </div>
      <div className="">
        <Link href={`/post/${post.slug}`}>
          <a className="block">
            <img
              style={{
                boxShadow: "0 0 0 1px rgba(0,0,0,0.125)",
              }}
              src={post.image}
            />
          </a>
        </Link>
      </div>
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
            {post.via && (
              <>
                via{" "}
                <Link href={post.via}>
                  <a className="underline">{post.via}</a>
                </Link>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Post;
