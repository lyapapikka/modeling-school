import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";

export default function New() {
  return (
    <>
      <Head>
        <title>Новая запись - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <textarea className="resize-none bg-neutral-700 w-full rounded-2xl h-40 px-4 py-3" />
        <button className="ml-auto block bg-white text-sm font-medium text-black px-4 py-2 rounded-2xl mt-2">
          Добавить
        </button>
      </Content>
    </>
  );
}
