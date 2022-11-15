import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";

export default function Tutor() {
  return (
    <>
      <Head>
        <title>Учебник - Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        Учебник
      </Content>
    </>
  );
}
