import { GetServerSideProps } from "next";
import Link from "next/link";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // @ts-ignore
  const id = context.params.id as string;
  let post = await prisma.post.findFirst({
    where: {
      slug: id,
    },
  }); // To serialize date object, could do better
  post = JSON.parse(JSON.stringify(post));
  return {
    props: { post },
  };
};

const Post = (props) => {
  const { post } = props;

  return (
    <div className={`flex flex-col gap-3`}>
      <div>
        <Link href="/">
          <a className="underline">Feed</a>
        </Link>
      </div>
      <div>
        <span className="capitalize">{post.feed_type}</span> ↓{" "}
        {new Date(post.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
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
