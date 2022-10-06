import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import { useRouter } from "next/router";
import siteData from "../../siteData";
import slugify from "slugify";
import Menu from "../../components/Menu";

export default function Theme({ article }) {
  const router = useRouter();

  if (router.isFallback) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {`${
            siteData.content.find((c) => slugify(c.title).toLowerCase() === article)
              .title
          } - Школа моделирования`}
        </title>
      </Head>
      <Content>
        <Header article slug={article} />
        <div className="flex">
          <Menu />
          <div className="mt-4 prose prose-invert max-w-2xl w-full">
            <h1>
              {
                siteData.content.find(
                  (c) => slugify(c.title).toLowerCase() === article
                ).title
              }
            </h1>
            {
              siteData.content.find(
                (c) => slugify(c.title).toLowerCase() === article
              ).body
            }
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
  const { article } = params;

  return {
    props: {
      article,
    },
  };
}
