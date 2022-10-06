import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Post from "../components/Post";

const scrollAtom = atom(0);

const Blog = (props) => {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [scroll, setScroll] = useAtom(scrollAtom);
  const lastMonthRef = useRef<string>("");

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

  // Restores scroll on return to feed
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setScroll(window.scrollY);
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, scroll);
  }, []);

  if (isError) return <div>Error! {JSON.stringify(error)}</div>;

  return (
    <>
      <div className="max-w-[620px] mx-auto pt-4 md:pt-4">
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

        <div className={`flex justify-between px-4 md:px-0 py-4`}>
          <div className="">Feed</div>
          <div className="text-zinc-500">work and inspiration in progress</div>
        </div>

        {isLoading ? (
          <div className="px-4 py-4 text-center border-2 md:px-7 border-zinc-200">
            Loading...
          </div>
        ) : (
          <main className="flex flex-col border-t-2 border-zinc-200">
            {data.pages.map((page, i) => (
              <div key={i} className="flex flex-col">
                {page.posts.map((post) => {
                  return (
                    <div key={post.id} className="">
                      <Post post={post} />
                    </div>
                  );
                })}
              </div>
            ))}
          </main>
        )}
        <span style={{ visibility: "hidden" }} ref={ref}>
          intersection observer marker
        </span>
      </div>
    </>
  );
};

export default Blog;
