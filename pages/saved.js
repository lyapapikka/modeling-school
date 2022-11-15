import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";

export default function Saved() {
  return (
    <>
      <Head>
        <title>Сохраненное - Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        Сохраненное
      </Content>
    </>
  );
}
