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

export default function Saved() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const { data } = useSWR(
    !isLoading && session ? api(`saved?select=*,posts(text)`, session) : null,
    fetcher
  );

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [session, router, isLoading]);

  useEffect(() => console.log(data), [data]);

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
          {data
            ? data.map((p) => (
                <div
                  key={p.id}
                  className="bg-neutral-800 rounded-2xl py-1 px-4 relative"
                >
                  <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                    {p.posts.text}
                  </div>
                  <button className="-ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                    <HeartIcon className="w-6" />
                  </button>
                </div>
              ))
            : "Загрузка..."}
        </div>
      </Content>
    </>
  );
}
