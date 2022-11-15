import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";

export default function Other() {
  return (
    <>
      <Head>
        <title>Другое - Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        Другое
      </Content>
    </>
  );
}
