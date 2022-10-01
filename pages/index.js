import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";

export default function Home() {
  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="divide-y divide-neutral-500">
          <Card title="Нахождение угла" />
          <Card title="Нахождение производной" />
          <Card title="Перевод из одной системы счисления в другую" />
        </div>
      </Content>
    </>
  );
}
