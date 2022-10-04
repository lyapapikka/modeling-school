import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import data from "../data";
import slugify from "slugify";

export default function Home() {
  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="divide-y divide-neutral-500">
          {data.content.map(({ title, theme }, i) => (
            <Card
              title={title}
              href={`${slugify(theme).toLowerCase()}/${slugify(
                title
              ).toLowerCase()}`}
              key={i}
            />
          ))}
        </div>
      </Content>
    </>
  );
}
