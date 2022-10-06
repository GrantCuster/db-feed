import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // @ts-ignore
  const id = context.params.id as string;
  let post = await prisma.post.findFirst({
    where: {
      // @ts-ignore
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
  const router = useRouter();

  return (
    <>
      <div className="max-w-[620px] mx-auto pt-6 pb-4">
        {/* header */}
        <div className="flex justify-between px-4 md:px-0">
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

        <div className="flex justify-between pt-3 mb-4">
          <Link href="/">
            <a className="underline">Feed</a>
          </Link>
          <div className="flex">
            <div>prev</div>
            <div>next</div>
          </div>
        </div>
        <div>
          <span className="capitalize">{post.feed_type}</span> ↓{" "}
          {new Date(post.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
      <div>
        <img
          className="mx-auto"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.125)",
          }}
          src={post.image}
        />
      </div>
      <div className="max-w-[640px] mx-auto pt-4 pb-12">
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
    </>
  );
};

export default Post;
