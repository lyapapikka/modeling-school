import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import Card from "../../components/Card";

export default function Theme() {
  return (
    <>
      <Head>
        <title>Геометрия - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="divide-y divide-neutral-500">
          <Card title="Нахождение угла" />
        </div>
      </Content>
    </>
  );
}
