import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import ReactLinkify from "react-linkify";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Group({ id }) {
  const [_origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(origin);
  }, []);

  return (
    <>
      <Head>
        <title>Группа</title>
      </Head>
      <Content>
        <Header home homePage />
        <h1 className="text-2xl text-center mt-10">Геометрия и топология</h1>
        <div className="text-center mt-2 mb-10 text-neutral-500">
          40 участников
        </div>
        <div className="space-y-4">
          <div className="flex items-start bg-neutral-800 rounded-2xl py-1 px-4 relative">
            <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
              <ReactLinkify
                componentDecorator={(href, text, key) =>
                  href.startsWith(_origin) ? (
                    <Link href={href} key={key}>
                      <a className="text-blue-500">{text}</a>
                    </Link>
                  ) : (
                    <a target="_blank" href={href} key={key} className="text-blue-500">
                      {text}
                    </a>
                  )
                }
              >
                Новая запись со ссылкой http://localhost:3000/home и google.com
              </ReactLinkify>
            </div>
            <button
              onClick={() => showMenu(p.id)}
              className="absolute right-3 top-3 p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
            >
              <EllipsisVerticalIcon className="w-6" />
            </button>
          </div>
          <div className="flex items-start bg-neutral-800 rounded-2xl py-1 px-4 relative">
            <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
              Еще одна запись
            </div>
            <button
              onClick={() => showMenu(p.id)}
              className="absolute right-3 top-3 p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
            >
              <EllipsisVerticalIcon className="w-6" />
            </button>
          </div>
        </div>
      </Content>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps() {
  return {
    props: {
      id: 0,
    },
  };
}
