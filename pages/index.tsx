import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Post from "../components/Post";

const Blog = (props) => {
  const { ref, inView } = useInView();

  const {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts"],
    async ({ pageParam = "" }) => {
      await new Promise((res) => setTimeout(res, 1000));
      const res = await axios.get("/api/getPosts?cursor=" + pageParam);
      return res.data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextId ?? false,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error! {JSON.stringify(error)}</div>;

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
        {data.pages.map((page, i) => (
          <div key={i} className="flex flex-col gap-16">
            {page.posts.map((post) => (
              <div key={post.id} className="">
                <Post post={post} />
              </div>
            ))}
          </div>
        ))}
      </main>
      <span style={{ visibility: "hidden" }} ref={ref}>
        intersection observer marker
      </span>
    </div>
  );
};

export default Blog;
