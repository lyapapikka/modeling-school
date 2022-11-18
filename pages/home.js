import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  EllipsisVerticalIcon,
  ShareIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import api from "../utils/api";
import Menu from "../components/Menu";

export default function Home() {
  const router = useRouter();
  const { isLoading, session, supabaseClient } = useSessionContext();
  const { data: posts, mutate: mutatePosts } = useSWR(
    !isLoading && session
      ? api(`posts?user_id=eq.${session.user.id}&select=*`, session)
      : null,
    fetcher
  );
  const [menu, setMenu] = useState(false);
  const [selection, setSelection] = useState(-1);

  const showMenu = (id) => {
    setSelection(id);
    setMenu(true);
  };
  const hideMenu = () => setMenu(false);
  const share = () => {
    navigator.share({
      url: `https://modeling-school.vercel.app/sharePost?id=${selection}`,
    });
    setMenu(false);
  };
  const remove = async () => {
    await supabaseClient.from("posts").delete().eq("id", selection);
    mutatePosts();
    setMenu(false);
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [session, router, isLoading]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      {menu && (
        <Menu
          onClose={hideMenu}
          actions={[
            {
              title: "Поделиться",
              icon: <ShareIcon className="w-6" />,
              onClick: share,
            },
            {
              title: "Удалить",
              icon: <TrashIcon className="w-6" />,
              onClick: remove,
            },
          ]}
        />
      )}
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        <div className="space-y-4">
          {posts &&
            (posts.length === 0 ? (
              <div className="mt-40 text-lg text-center">
                <PencilSquareIcon className="w-12 mb-4 mx-auto" />
                Нет записей
              </div>
            ) : (
              posts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start bg-neutral-800 rounded-2xl py-1 px-4 relative"
                >
                  <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                    {p.text}
                  </div>
                  <button
                    onClick={() => showMenu(p.id)}
                    className="absolute right-3 top-3 p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
                  >
                    <EllipsisVerticalIcon className="w-6" />
                  </button>
                </div>
              ))
            ))}
        </div>
      </Content>
    </>
  );
}
