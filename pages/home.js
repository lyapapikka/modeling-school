import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

export default function Home() {
  const router = useRouter();
  const user = useUser();

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
        <div className="text-lg">Моя страница</div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <div className="bg-neutral-800 rounded-2xl mt-2 px-4 py-3 w-full">
            <div className="flex justify-between mb-2">
              <div className="">Виджеты</div>
              <button className="sm:hover:bg-neutral-700 rounded-full p-2 -m-2">
                <PlusIcon className="w-6" />
              </button>
            </div>
            <div className="text-neutral-500">У вас пока нет виджетов</div>
          </div>
          <div className="bg-neutral-800 rounded-2xl mt-2 px-4 py-3 w-full">
            <div className="flex justify-between mb-2">
              <div className="">Записи</div>
              <button className="sm:hover:bg-neutral-700 rounded-full p-2 -m-2">
                <PlusIcon className="w-6" />
              </button>
            </div>
            <div className="text-neutral-500">У вас пока нет записей</div>
          </div>
        </div>
      </Content>
    </>
  );
}
