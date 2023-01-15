import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetcher";
import api from "../utils/api";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../components/Post";
import useSWR from "swr";

export default function Home() {
  const router = useRouter();
  const [_origin, setOrigin] = useState("");
  const { isLoading, session } = useSessionContext();
  const [cachedArchive, setCachedArchive] = useState([]);
  const [cachedFolders, setCachedFolders] = useState([]);

  const {
    data: posts,
    size,
    setSize,
  } = useSWRInfinite(
    !isLoading && session
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.length) {
            return null;
          }

          return api(
            `feed?select=*,groups(*)&offset=${pageIndex * 6}&limit=6`,
            session
          );
        }
      : null,
    fetcher
  );

  const { data: folders, mutate: mutateFolders } = useSWR(
    !isLoading && session && posts
      ? api(
          `folders?post_id=in.(${posts
            .map((p) => p.map(({ id }) => id))
            .join()})`,
          session
        )
      : null,
    fetcher
  );

  const { data: archive, mutate: mutateArchive } = useSWR(
    !isLoading && session && posts
      ? api(
          `archive?post_id=in.(${posts
            .map((p) => p.map(({ id }) => id))
            .join()}),posts(text,created_at,id,groups(name,id))`,
          session
        )
      : null,
    fetcher
  );

  const fetchData = () => setSize(size + 1);

  useEffect(() => {
    setCachedArchive((cache) => archive || cache);
  }, [archive]);

  useEffect(() => {
    setCachedFolders((cache) => folders || cache);
  }, [folders]);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [session, router, isLoading]);

  useEffect(() => {
    setOrigin(origin);
  }, []);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header home homePage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl">
          Главная
        </div>
        {posts && cachedArchive && cachedFolders ? (
          posts[0].length === 0 ? (
            <div className="text-center text-neutral-500 mt-10">
              Новостей нет
            </div>
          ) : (
            <InfiniteScroll
              className="space-y-2 mt-2"
              dataLength={[...posts].length}
              next={fetchData}
              hasMore={!(posts.at(-1).length < 6)}
              loader={
                <div className="space-y-2 mt-2">
                  <div className="bg-neutral-900 h-36 rounded-2xl"></div>
                  <div className="bg-neutral-900 h-36 rounded-2xl"></div>
                </div>
              }
            >
              {posts.map((post) =>
                post.map((p) => (
                  <Post
                    key={p.id}
                    session={session}
                    from={"home"}
                    groupId={p.groups.id}
                    groupData={[p.groups]}
                    postData={p}
                    mutateArchive={mutateArchive}
                    archive={cachedArchive}
                    mutateFolders={mutateFolders}
                    folders={cachedFolders}
                  />
                ))
              )}
            </InfiniteScroll>
          )
        ) : (
          <div className="space-y-2 mt-2">
            <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
            <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
            <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
            <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
          </div>
        )}
      </Content>
    </>
  );
}
