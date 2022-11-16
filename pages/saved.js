import { useSessionContext } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import Content from "../components/Content";
import Header from "../components/Header";
import api from "../utils/api";
import fetcher from "../utils/fetcher";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function Saved() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const { data, mutate } = useSWR(
    !isLoading && session ? api(`saved?select=*,posts(text)`, session) : null,
    fetcher
  );

  const remove = async (id) => {
    await supabaseClient.from("saved").delete().eq("id", id);
    mutate();
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
      <Head>
        <title>Сохраненное - Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        <div className="space-y-4">
          {data &&
            (data.length === 0 ? (
              <div className="mt-40 text-lg text-center">
                <HeartIcon className="w-12 mb-4 mx-auto" />
                Нет сохраненных записей и виджетов
              </div>
            ) : (
              data.map((p) => (
                <div
                  key={p.id}
                  className="bg-neutral-800 rounded-2xl py-1 px-4 relative"
                >
                  <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                    {p.posts.text}
                  </div>
                  <button
                    onClick={() => remove(p.id)}
                    className="-ml-2 sm:hover:bg-neutral-700 p-2 rounded-full"
                  >
                    <HeartIconSolid className="w-6" />
                  </button>
                </div>
              ))
            ))}
        </div>
      </Content>
    </>
  );
}
