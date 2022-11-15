import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

export default function Home() {
  const router = useRouter();
  const user = true;
  const [tab, setTab] = useState("posts");

  const postsTab = () => setTab("posts");
  const widgetsTab = () => setTab("widgets");

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header />
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
        <div className="bg-neutral-800 rounded-2xl mt-2 px-4 py-3 w-full">
          {tab === "widgets" && (
            <div className="w-full">
              <div className="text-neutral-500 bg-neutral-800 rounded-2xl">
                У вас пока нет виджетов
              </div>
            </div>
          )}
          {tab === "posts" && (
            <div className="w-full">
              <div className="text-neutral-500 bg-neutral-800 rounded-2xl">
                У вас пока нет записей
              </div>
              {/* <div className="divide-y divide-neutral-500 bg-neutral-800 rounded-2xl px-4 py-3">
              <div className="py-2">
                Длинный текст записи, приведенный здесь лишь для демонстрации
                того, как выглядят много строк текста в реальном интерфейсе
              </div>
              <div className="py-2">
                Длинный текст записи, приведенный здесь лишь для демонстрации
                того, как выглядят много строк текста в реальном интерфейсе
              </div>
            </div> */}
            </div>
          )}
        </div>
      </Content>
    </>
  );
}
