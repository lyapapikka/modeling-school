import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();
  const { isLoading, session } = useSessionContext();
  const [tab, setTab] = useState("posts");

  const postsTab = () => setTab("posts");
  const widgetsTab = () => setTab("widgets");

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
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        <div className="flex space-x-2 mb-4 mt-2">
          <button
            onClick={postsTab}
            className={`flex sm:hover:bg-neutral-700 px-3 py-1 rounded-full ${
              tab === "posts" ? "bg-neutral-600" : "bg-neutral-800"
            }`}
          >
            Записи
          </button>
          <button
            onClick={widgetsTab}
            className={`flex sm:hover:bg-neutral-700 px-3 py-1 rounded-full ${
              tab === "widgets" ? "bg-neutral-600" : "bg-neutral-800"
            }`}
          >
            Виджеты
          </button>
        </div>
        {tab === "widgets" && (
          <div className="space-y-4">
            <div className="flex items-start bg-neutral-800 rounded-2xl py-1 px-4 relative">
              <div className="py-2 rounded-2xl pr-6">Калькулятор</div>
              <button className="absolute right-3 top-3 p-2 -m-2 sm:hover:bg-neutral-700 rounded-full">
                <EllipsisVerticalIcon className="w-6" />
              </button>
            </div>
          </div>
        )}
        {tab === "posts" && (
          <div className="space-y-4">
            <div className="flex items-start bg-neutral-800 rounded-2xl py-1 px-4 relative">
              <div className="py-2 rounded-2xl pr-6">
                Длинный текст записи, приведенный здесь лишь для демонстрации
                того, каквыглядят много строк текста в реальном интерфейсе
              </div>
              <button className="absolute right-3 top-3 p-2 -m-2 sm:hover:bg-neutral-700 rounded-full">
                <EllipsisVerticalIcon className="w-6" />
              </button>
            </div>
            <div className="flex items-start bg-neutral-800 rounded-2xl py-1 px-4 relative">
              <div className="py-2 rounded-2xl pr-6">
                Длинный текст записи, приведенный здесь лишь для демонстрации
                того, как выглядят много строк текста в реальном интерфейсе
              </div>
              <button className="absolute right-3 top-3 p-2 -m-2 sm:hover:bg-neutral-700 rounded-full">
                <EllipsisVerticalIcon className="w-6" />
              </button>
            </div>
          </div>
        )}
      </Content>
    </>
  );
}
