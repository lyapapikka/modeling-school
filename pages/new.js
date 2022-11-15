import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useState } from "react";

export default function New() {
  const supabaseClient = useSupabaseClient();
  const [text, changeText] = useState("");

  const add = async () => {
    // supabaseClient.from("posts").insert([{}]);
  };

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
          className="resize-none bg-neutral-700 w-full rounded-2xl h-40 px-4 py-3"
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
