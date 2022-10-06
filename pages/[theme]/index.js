import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import Card from "../../components/Card";
import siteData from "../../siteData";
import slugify from "slugify";
import { useRouter } from "next/router";
import Menu from "../../components/Menu";
import Title from "../../components/Title";
import List from "../../components/List";

export default function Theme({ theme }) {
  const router = useRouter();

  if (router.isFallback) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {`${
            siteData.content.find(
              (c) => slugify(c.theme).toLowerCase() === theme
            ).theme
          } - Школа моделирования`}
        </title>
      </Head>
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">
            <Title>
              {
                siteData.content.find(
                  (c) => slugify(c.theme).toLowerCase() === theme
                ).theme
              }
            </Title>
            <List>
              {siteData.content
                .filter((c) => slugify(c.theme).toLowerCase() === theme)
                .map(({ title, theme }, i) => (
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

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export function getStaticProps({ params }) {
  const { theme } = params;

  return {
    props: {
      theme,
    },
  };
}
