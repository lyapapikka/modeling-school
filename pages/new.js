import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function New() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const [text, setText] = useState("");
  const router = useRouter();

  const changeText = ({ target: { value } }) => setText(value);

  const add = async () => {
    await supabaseClient
      .from("posts")
      .insert([{ text, user_id: session.user.id }]);
    router.push("/home");
  };

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
        <textarea
          onChange={changeText}
          value={text}
          placeholder="Текст записи..."
          className="resize-none bg-neutral-800 w-full rounded-2xl h-40 px-4 py-3"
        />
        <button
          onClick={add}
          className="ml-auto block bg-white text-sm font-medium text-black px-4 py-2 rounded-2xl mt-2"
        >
          Добавить
        </button>
      </Content>
    </>
  );
}
