import Head from "next/head";
import Content from "../../components/Content";
import Header from "../../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Link from "next/link";
import Image from "next/image";
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Post from "../../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";

export default function Profile() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const [_origin, setOrigin] = useState("");
  const [cachedFolders, setCachedFolders] = useState([]);

  const { data: user } = useSWR(
    !isLoading && session ? api(`user`, session, { user: true }) : null,
    fetcher
  );

  const {
    data: archive,
    size,
    setSize,
    mutate: mutateArchive,
  } = useSWRInfinite(
    !isLoading && session
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.length) {
            return null;
          }

          return api(
            `archive?select=*,posts(text,created_at,id,groups(name,id))&offset=${
              pageIndex * 6
            }&limit=6`,
            session
          );
        }
      : null,
    fetcher
  );

  const { data: folders } = useSWR(
    !isLoading && session && archive
      ? api(
          `folders?post_id=in.(${archive
            .reduce((r, c) => r.concat(c))
            .map((p) => p.post_id)
            .join()})`,
          session
        )
      : null,
    fetcher
  );

  useEffect(() => {
    setCachedFolders((cache) => folders || cache);
  }, [folders]);

  const fetchData = () => setSize(size + 1);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    setOrigin(origin);
  }, []);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Профиль - Школа моделирования</title>
      </Head>
      <Content>
        <Header home archivePage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          Профиль
        </div>
        <div className="bg-neutral-900 rounded-2xl relative mb-2">
          <div className="flex justify-center pt-4">
            {user ? (
              user?.user_metadata?.picture ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/profile/${user.user_metadata.picture}`}
                  width={100}
                  height={100}
                  objectFit="cover"
                  className="rounded-full"
                  alt=""
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-neutral-800 rounded-full flex justify-center">
                  <QuestionMarkCircleIcon className="w-14" />
                </div>
              )
            ) : (
              <div className="bg-neutral-800 w-[100px] h-[100px] rounded-full"></div>
            )}
          </div>
          <div className="flex mt-2 items-center justify-center">
            <div className="text-lg line-clamp-1 text-center">
              {user ? (
                user?.user_metadata?.name || "Неизвестный пользователь"
              ) : (
                <div className="bg-neutral-800 text-lg w-40 rounded-2xl">
                  &nbsp;
                </div>
              )}
            </div>
          </div>
          <div className="flex pb-4 mt-2 items-center justify-center">
            <div className="text-sm line-clamp-1 text-center">
              {user ? (
                user?.user_metadata?.nickname || "Псевдоним не задан"
              ) : (
                <div className="bg-neutral-800 w-40 rounded-2xl text-base">
                  &nbsp;
                </div>
              )}
            </div>
          </div>

          <Link href="/profile/settings">
            <a className="absolute top-2 right-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <Cog6ToothIcon className="w-6" />
            </a>
          </Link>
        </div>
        <div className="space-y-2 mb-8">
          {archive && cachedFolders ? (
            archive[0].length === 0 ? (
              <div className="text-center text-neutral-500 mt-8">
                Нет сохраненных записей
              </div>
            ) : (
              <InfiniteScroll
                className="space-y-2"
                dataLength={[...archive].length}
                next={fetchData}
                hasMore={!(archive.at(-1).length < 6)}
                loader={
                  <div className="space-y-2">
                    <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
                    <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
                  </div>
                }
              >
                {archive.map((post) =>
                  post.map((p) => (
                    <Post
                      key={p.id}
                      groupId={p.posts.groups.id}
                      groupData={[p.posts.groups]}
                      postData={p.posts}
                      session={session}
                      archive={archive}
                      from={"profile"}
                      mutateArchive={mutateArchive}
                      paginated
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
              <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
            </div>
          )}
        </div>
      </Content>
    </>
  );
}
