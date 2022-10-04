import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import Card from "../../components/Card";
import data from "../../data";
import slugify from "slugify";
import { useRouter } from "next/router";

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
            data.content.find((c) => slugify(c.theme).toLowerCase() === theme)
              .theme
          } - Школа моделирования`}
        </title>
      </Head>
      <Content>
        <Header />
        <div className="divide-y divide-neutral-500">
          {data.content
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
