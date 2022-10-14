import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import Card from "../components/Card";
import siteData from "../siteData";
import slugify from "slugify";
import Menu from "../components/Menu";
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
            <List>
              {siteData.content.map(({ title, theme }, i) => (
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
