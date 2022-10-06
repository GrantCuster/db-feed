import Link from "next/link";
import { Post } from "prisma";

const Post = ({ post }: { post: Post }) => {
  return (
    <div className={`flex flex-col gap-3`}>
      <div>
        <span className="capitalize">{post.feed_type}</span> ↓{" "}
        <Link href={`/post/${post.slug}`}>
          <a className="underline">
            {new Date(post.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </a>
        </Link>
      </div>
      <div>
        <img
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.125)",
          }}
          src={post.image}
        />
      </div>
      <div className="flex flex-col gap-1 pl-4">
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
  );
};

export default Post;
