import Head from "next/head";
import Header from "../../../components/Header";
import Content from "../../../components/Content";
import {
  CheckIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import useSWR from "swr";
import api from "../../../utils/api";
import fetcher, { countFetcher } from "../../../utils/fetcher";
import TextareaAutosize from "react-textarea-autosize";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../../../components/Post";
import toast from "../../../utils/toast";

export default function Group() {
  const [_origin, setOrigin] = useState("");
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const { id, from } = router.query;
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cachedArchive, setCachedArchive] = useState([]);

  const changePostText = ({ target: { value } }) => setPostText(value);

  const join = async () => {
    mutateUserIsMember([true], false);
    mutateMembersCount((c) => Number(c) + 1, false);

    await supabaseClient
      .from("members")
      .insert([{ user_id: session.user.id, group_id: id }]);
  };

  const leave = async () => {
    mutateUserIsMember([], false);
    mutateMembersCount((c) => Number(c) - 1, false);

    await supabaseClient
      .from("members")
      .delete()
      .eq("user_id", session.user.id)
      .eq("group_id", id);
  };

  const createPost = async () => {
    setLoading(true);

    await supabaseClient
      .from("posts")
      .insert([{ text: postText, group_id: id }]);

    mutate();

    setLoading(false);
    setPostText("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${origin}/group/${id}`);
    toast("Ссылка скопирована");
  };

  const { data } = useSWR(
    !isLoading && session && router.isReady
      ? api(`groups?id=eq.${id}`, session)
      : null,
    fetcher
  );

  const {
    data: posts,
    size,
    setSize,
    mutate,
  } = useSWRInfinite(
    !isLoading && session && router.isReady
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.length) {
            return null;
          }

          return api(
            `posts?group_id=eq.${id}&order=created_at.desc&offset=${
              pageIndex * 6
            }&limit=6`,
            session
          );
        }
      : null,
    fetcher
  );

  const { data: userIsMember, mutate: mutateUserIsMember } = useSWR(
    !isLoading && session && router.isReady
      ? api(`members?group_id=eq.${id}&user_id=eq.${session.user.id}`, session)
      : null,
    fetcher
  );

  const { data: membersCount, mutate: mutateMembersCount } = useSWR(
    !isLoading && session && router.isReady
      ? api(`members?group_id=eq.${id}`, session, { count: true })
      : null,
    countFetcher
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

  useEffect(() => {
    setCachedArchive((cache) => archive || cache);
  }, [archive]);

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
      <Content>
        <Header home groupsPage />
        {data && posts && cachedArchive && membersCount && userIsMember ? (
          <>
            <Head>
              <title>{data[0].name} - Школа моделирования</title>
            </Head>
            <div className="flex items-center text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
              <Link href={`/${from || "groups"}`}>
                <a className="inline-block -my-1 mr-2 -ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                  <ChevronLeftIcon className="w-6" />
                </a>
              </Link>
              <div className="text-xl font-bold bg-neutral-900 rounded-b-2xl mb-1">
                Группа
              </div>
            </div>
            <div className="bg-neutral-900 rounded-2xl relative my-2">
              <div className="flex justify-center pt-4">
                <Image
                  src={`https://avatars.dicebear.com/api/identicon/${id}.svg`}
                  width={100}
                  height={100}
                  objectFit="cover"
                  className="rounded-full"
                  alt=""
                />
              </div>
              <div className="flex mt-2 mb-2 items-center justify-center">
                <div className="text-lg line-clamp-1 text-center">
                  {data[0].name}
                </div>
              </div>
              <div className="text-neutral-500 text-center pb-4">
                Участников: {membersCount}
              </div>
              {session.user.id === data[0].owner_id && (
                <Link href={`/group/${id}/settings`}>
                  <a className="absolute top-2 right-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                    <Cog6ToothIcon className="w-6" />
                  </a>
                </Link>
              )}
            </div>
            <div className="px-2 flex gap-2">
              {session.user.id !== data[0].owner_id &&
                (userIsMember.length !== 0 ? (
                  <button
                    onClick={leave}
                    className="w-full flex justify-center bg-neutral-800 rounded-2xl px-3 py-2 mb-2"
                  >
                    <UserMinusIcon className="w-6 mr-2" />
                    <div className="leading-6">Покинуть</div>
                  </button>
                ) : (
                  <button
                    onClick={join}
                    className="w-full flex justify-center bg-white text-black rounded-2xl px-3 py-2 mb-2"
                  >
                    <UserPlusIcon className="w-6 mr-2" />
                    <div className="leading-6">Присоединиться</div>
                  </button>
                ))}
              <button
                onClick={copyLink}
                className={`flex ${
                  session.user.id !== data[0].owner_id
                    ? "w-fit sm:w-full"
                    : "w-full"
                } justify-center bg-neutral-800 rounded-2xl px-3 py-2 mb-2`}
              >
                <LinkIcon
                  className={`w-6 ${
                    session.user.id !== data[0].owner_id ? "sm:mr-2" : "mr-2"
                  }`}
                />
                <div
                  className={`leading-6 ${
                    session.user.id !== data[0].owner_id
                      ? "hidden sm:block"
                      : ""
                  }`}
                >
                  Скопировать ссылку
                </div>
              </button>
            </div>
            {session.user.id === data[0].owner_id && (
              <div className="px-2 mb-2">
                <TextareaAutosize
                  disabled={loading}
                  placeholder="Напишите что-нибудь..."
                  className="block w-full px-3 py-2 rounded-2xl resize-none bg-neutral-700"
                  value={postText}
                  onChange={changePostText}
                />
                {postText.trim() && !loading && (
                  <button
                    onClick={createPost}
                    className="w-full flex justify-center bg-white text-black rounded-2xl px-3 py-2 my-2"
                  >
                    <CheckIcon className="w-6 mr-2" />
                    <div className="leading-6">Опубликовать</div>
                  </button>
                )}
                {loading && (
                  <div className="w-full flex justify-center bg-neutral-900 rounded-2xl px-3 py-2 my-2">
                    <EllipsisHorizontalIcon className="w-6 mr-2" />
                    <div className="leading-6">Публикуем запись</div>
                  </div>
                )}
              </div>
            )}
            {posts[0].length === 0 ? (
              <div className="text-center text-neutral-500 mt-10">
                Нет записей
              </div>
            ) : (
              <InfiniteScroll
                className="space-y-2"
                dataLength={[...posts].length}
                next={fetchData}
                hasMore={!(posts.at(-1).length < 6)}
                loader={
                  <div className="space-y-2">
                    <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
                    <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
                  </div>
                }
              >
                {posts.map((post) =>
                  post.map((p) => (
                    <Post
                      groupId={id}
                      groupData={data}
                      postData={p}
                      key={p.id}
                      session={session}
                      archive={cachedArchive}
                      from={from}
                      mutateArchive={mutateArchive}
                    />
                  ))
                )}
              </InfiniteScroll>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl">
              <div className="inline-block -my-1 mr-2 -ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                <ChevronLeftIcon className="w-6" />
              </div>
              <div className="text-xl font-bold bg-neutral-900 rounded-b-2xl mb-1">
                Группа
              </div>
            </div>
            <div className="w-full bg-neutral-900 rounded-2xl mt-2 h-[200px] pt-4">
              <div className="bg-neutral-800 w-[100px] h-[100px] rounded-full mx-auto"></div>
              <div className="bg-neutral-800 text-lg w-40 rounded-2xl mx-auto mt-2">
                &nbsp;
              </div>
              <div className="bg-neutral-800 text-lg w-40 rounded-2xl mx-auto mt-2">
                &nbsp;
              </div>
            </div>
            <div className="px-2 h-10 w-full flex justify-center bg-neutral-900 font-medium rounded-2xl text-sm py-2 my-2"></div>
            <div className="space-y-2">
              <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
              <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
              <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
              <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
            </div>
          </>
        )}
      </Content>
    </>
  );
}
