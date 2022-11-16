import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search() {
  const { isLoading, session } = useSessionContext();
  const [text, setText] = useState("");
  const router = useRouter();

  const changeText = ({ target: { value } }) => setText(value);

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
        <title>Новая запись - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-6" />
          <input
            className="bg-neutral-800 w-full rounded-2xl pl-14 pr-4 py-3"
            placeholder="Поиск..."
          />
        </div>
      </Content>
    </>
  );
}
