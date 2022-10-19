import Head from "next/head";
import Header from "../../../components/Header";
import Content from "../../../components/Content";
import Menu from "../../../components/Menu";

export default function Members() {
  return (
    <>
      <Head>
        <title>Участники - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">Список участников</div>
        </div>
      </Content>
    </>
  );
}
