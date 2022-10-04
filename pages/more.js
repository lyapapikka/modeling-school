import Header from "../components/Header";
import Content from "../components/Content";
import Head from "next/head";
import Card from "../components/Card";

export default function More() {
  return (
    <>
      <Head>
        <title>Ещё - Школа моделирования</title>
      </Head>
      <Content>
        <Header article />
        <div className="divide-y divide-neutral-500">
          <Card small title="Моё" />
          <Card small title="От преподавателя" />
          <Card small title="Все темы" />
          <Card small title="Алгебра" />
          <Card small title="Геометрия" />
          <Card small title="Начала анализа" />
        </div>
      </Content>
    </>
  );
}
