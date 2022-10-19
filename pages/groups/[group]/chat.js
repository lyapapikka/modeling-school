import Head from "next/head";
import Header from "../../../components/Header";
import Content from "../../../components/Content";
import Menu from "../../../components/Menu";

export default function Chat() {
  return (
    <>
      <Head>
        <title>Чат - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">Чат группы</div>
        </div>
      </Content>
    </>
  );
}
