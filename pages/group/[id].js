import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import {
  ArchiveBoxArrowDownIcon,
  LinkIcon,
  PlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import ReactLinkify from "react-linkify";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import useSWR from "swr";
import api from "../../utils/api";
import fetcher from "../../utils/fetcher";
import TextareaAutosize from "react-textarea-autosize";
import { formatRelative } from "date-fns";
import russianLocale from "date-fns/locale/ru";
import { toast } from "react-toastify";

export default function Group({ id }) {
  const [_origin, setOrigin] = useState("");
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const [postText, setPostText] = useState("");

  const changePostText = ({ target: { value } }) => setPostText(value);

  const createPost = async () => {
    setPostText("");
    await supabaseClient
      .from("posts")
      .insert([{ text: postText, group_id: id }]);
    mutate();
  };

  const addToArchive = async (post_id) => {
    await supabaseClient
      .from("archive")
      .insert([{ user_id: session.user.id, post_id }]);
    toast.success("Запись сохранена в архиве", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      closeButton: false,
      className: "m-2",
    });
  };

  const { data } = useSWR(
    !isLoading && session ? api(`groups?id=eq.${id}`, session) : null,
    fetcher
  );

  const { data: posts, mutate } = useSWR(
    !isLoading && session
      ? api(`posts?group_id=eq.${id}&order=created_at.desc`, session)
      : null,
    fetcher
  );

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
        <Header home homePage />
        {data && (
          <>
            <Head>
              <title>{data[0].name} - Школа моделирования</title>
            </Head>
            <div className="flex items-center">
              <div className="p-4">
                <Image
                  alt=""
                  width={40}
                  height={40}
                  src={`https://avatars.dicebear.com/api/identicon/${id}.svg`}
                />
              </div>
              <div>
                <h1 className="text-xl">{data[0].name}</h1>
                <div className="text-neutral-500">40 участников</div>
              </div>
            </div>
            <div className="mx-4">{data[0].description}</div>
            <div className="flex gap-4 px-2">
              <button className="w-full flex justify-center bg-neutral-600 font-medium rounded-2xl text-sm px-3 py-2 my-4">
                <UserPlusIcon className="w-6" />
              </button>
              <button className="w-full flex justify-center bg-neutral-600 font-medium rounded-2xl text-sm px-3 py-2 my-4">
                <LinkIcon className="w-6" />
              </button>
            </div>
            <div className="px-2 mb-4">
              <TextareaAutosize
                placeholder="Напишите что-нибудь..."
                className="block w-full px-3 py-2 rounded-2xl resize-none bg-neutral-700"
                value={postText}
                onChange={changePostText}
              />
              {postText.trim() && (
                <button
                  onClick={createPost}
                  className="w-full flex justify-center bg-neutral-600 font-medium rounded-2xl text-sm px-3 py-2 my-4"
                >
                  <PlusIcon className="w-6" />
                </button>
              )}
            </div>
            <div className="space-y-4 mb-8">
              {posts &&
                posts.map((p) => (
                  <div
                    className="bg-neutral-800 rounded-2xl py-1 px-4"
                    key={p.id}
                  >
                    <div>
                      <div className="flex gap-4">
                        <Link href={`/group/${id}`}>
                          <a className="mt-4 ml-2">
                            <Image
                              alt=""
                              width={30}
                              height={30}
                              src={`https://avatars.dicebear.com/api/identicon/${id}.svg`}
                            />
                          </a>
                        </Link>
                        <div>
                          <Link href={`/group/${id}`}>
                            <a className="mt-2 inline-block">{data[0].name}</a>
                          </Link>
                          <div className="text-neutral-500">
                            {formatRelative(
                              new Date(p.created_at),
                              new Date(),
                              { locale: russianLocale }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                        <ReactLinkify
                          componentDecorator={(href, text, key) =>
                            href.startsWith(_origin) ? (
                              <Link href={href} key={key}>
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
                        onClick={() => addToArchive(p.id)}
                        className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
                      >
                        <ArchiveBoxArrowDownIcon className="w-6" />
                      </button>
                      <button className="p-2 -m-2 ml-2 sm:hover:bg-neutral-700 rounded-full">
                        <LinkIcon className="w-6" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </Content>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}
