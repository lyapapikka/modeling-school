import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetcher";
import api from "../utils/api";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Groups() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  const {
    data: groups,
    size,
    setSize,
  } = useSWRInfinite(
    !isLoading && session
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.length) {
            return null;
          }

          return api(`all_groups?offset=${pageIndex * 8}&limit=8`, session);
        }
      : null,
    fetcher
  );

  const fetchData = () => setSize(size + 1);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Группы - Школа моделирования</title>
      </Head>
      <Content>
        <Header home groupsPage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          Группы
        </div>
        <Link href="/new">
          <a className="w-full bg-neutral-900 rounded-2xl py-5 px-4 flex my-2 sm:hover:bg-neutral-800">
            <PlusIcon className="w-6 ml-2 mr-4" />
            Новая группа
          </a>
        </Link>
        {groups ? (
          <InfiniteScroll
            className="space-y-2"
            dataLength={[...groups].length}
            next={fetchData}
            hasMore={!(groups.at(-1).length < 8)}
            loader={
              <div className="space-y-2 ">
                <div className="bg-neutral-900 h-16 rounded-2xl"></div>
                <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              </div>
            }
          >
            {groups.map((group) =>
              group.map((g) => (
                <Link href={`/group/${g.id}?from=groups`} key={g.id}>
                  <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4 items-center sm:hover:bg-neutral-800">
                    <div className="mt-2 ml-1 shrink-0">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>{g.name}</div>
                  </a>
                </Link>
              ))
            )}
          </InfiniteScroll>
        ) : (
          <div className="space-y-2">
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
          </div>
        )}
      </Content>
    </>
  );
}
