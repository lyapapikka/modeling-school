import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";

export default function Home() {
  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="mt-2 bg-neutral-800 rounded-2xl py-2 px-3">Личный</div>
      </Content>
    </>
  );
}
