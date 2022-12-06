import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/fetcher";
import api from "../utils/api";
import { formatRelative } from "date-fns";
import russianLocale from "date-fns/locale/ru";
import { toast } from "react-toastify";
import ReactLinkify from "react-linkify";
import { ArchiveBoxArrowDownIcon, LinkIcon } from "@heroicons/react/24/outline";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const router = useRouter();
  const [_origin, setOrigin] = useState("");
  const { isLoading, session, supabaseClient } = useSessionContext();

  const addToArchive = async (post_id) => {
    const { data } = await supabaseClient
      .from("archive")
      .select()
      .eq("user_id", session.user.id)
      .eq("post_id", post_id);

    if (data.length === 0) {
      await supabaseClient
        .from("archive")
        .insert([{ user_id: session.user.id, post_id }]);
    }

    toast.success("Запись сохранена в архиве", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      closeButton: false,
      className: "bottom-14 sm:bottom-auto m-2",
    });
  };

  const sharePost = (id) => {
    navigator.share({ url: `${origin}/post/${id}` });
  };

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

  const fetchData = () => setSize(size + 1);

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
        {posts ? (
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
                  <div
                    className="bg-neutral-900 rounded-2xl py-1 px-4"
                    key={p.id}
                  >
                    <div>
                      <div className="flex gap-4">
                        <Link href={`/group/${p.groups.id}?from=home`}>
                          <a className="mt-4 ml-2">
                            <Image
                              alt=""
                              width={30}
                              height={30}
                              src={`https://avatars.dicebear.com/api/identicon/${p.groups.id}.svg`}
                            />
                          </a>
                        </Link>
                        <div>
                          <Link href={`/group/${p.groups.id}?from=home`}>
                            <a className="mt-2 inline-block">{p.groups.name}</a>
                          </Link>
                          <div className="text-neutral-500">
                            {formatRelative(
                              new Date(p.created_at),
                              new Date(),
                              {
                                locale: russianLocale,
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                        <ReactLinkify
                          componentDecorator={(href, text, key) =>
                            href.startsWith(_origin) ? (
                              <Link href={`${href}?from=home`} key={key}>
                                <a className="text-blue-500">{text}</a>
                              </Link>
                            ) : (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={href}
                                key={key}
                                className="text-blue-500"
                              >
                                {text}
                              </a>
                            )
                          }
                        >
                          {p.text}
                        </ReactLinkify>
                      </div>
                    </div>
                    <div className="flex justify-between mb-2 mt-2">
                      <button
                        title="Добавить в архив"
                        onClick={() => addToArchive(p.id)}
                        className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
                      >
                        <ArchiveBoxArrowDownIcon className="w-6" />
                      </button>
                      <button
                        title="Поделиться записью"
                        onClick={() => sharePost(p.id)}
                        className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
                      >
                        <LinkIcon className="w-6" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </InfiniteScroll>
          )
        ) : (
          <div className="space-y-2 mt-2">
            <div className="bg-neutral-900 h-36 rounded-2xl"></div>
            <div className="bg-neutral-900 h-36 rounded-2xl"></div>
            <div className="bg-neutral-900 h-36 rounded-2xl"></div>
            <div className="bg-neutral-900 h-36 rounded-2xl"></div>
          </div>
        )}
      </Content>
    </>
  );
}
