import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import data from "../data";
import slugify from "slugify";
import Menu from "../components/Menu";
import Title from "../components/Title";
import List from "../components/List";

export default function Home() {
  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">
            <Title>Главная</Title>
            <List>
              {data.content.map(({ title, theme }, i) => (
                <Card
                  title={title}
                  href={`${slugify(theme).toLowerCase()}/${slugify(
                    title
                  ).toLowerCase()}`}
                  key={i}
                />
              ))}
            </List>
          </div>
        </div>
      </Content>
    </>
  );
}
