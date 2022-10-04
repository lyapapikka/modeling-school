import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import { useRouter } from "next/router";
import data from "../../data";
import slugify from "slugify";

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
            data.content.find((c) => slugify(c.title).toLowerCase() === article)
              .title
          } - Школа моделирования`}
        </title>
      </Head>
      <Content>
        <Header article />
        <div className="mt-4 prose prose-invert max-w-none">
          <h1>
            {
              data.content.find(
                (c) => slugify(c.title).toLowerCase() === article
              ).title
            }
          </h1>
          {
            data.content.find((c) => slugify(c.title).toLowerCase() === article)
              .body
          }
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
