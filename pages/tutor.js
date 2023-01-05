import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ArrowDownTrayIcon, DocumentIcon } from "@heroicons/react/24/outline";
import path from "path";
import { promises as fs } from "fs";

export default function Tutor({ filenames }) {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Учебник - Школа моделирования</title>
      </Head>
      <Content>
        <Header home bookPage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          Учебник
        </div>
        <div className="flex bg-neutral-900 rounded-2xl p-4 mb-2">
          <svg
            height="50"
            className="shrink-0 mr-4"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            viewBox="0 0 60 58.5"
          >
            <path
              d="M10.6 0h38.8C55.2 0 60 4.8 60 10.6v37.2c0 5.9-4.8 10.6-10.6 10.6H10.6C4.8 58.5 0 53.7 0 47.9V10.6C0 4.8 4.8 0 10.6 0z"
              fill="#b30b00"
            />
            <path
              d="M48.2 33.9C47 32.6 44.7 32 41.4 32c-1.8 0-3.7.2-5.5.5-1.2-1.1-2.2-2.4-3.2-3.7-.7-1-1.4-2-2-3.1 1-2.8 1.6-5.8 1.8-8.8 0-2.7-1.1-5.6-4.1-5.6-1 0-2 .6-2.5 1.5-1.3 2.2-.8 6.7 1.3 11.4-.7 2.1-1.5 4.2-2.4 6.5-.8 2-1.7 3.9-2.8 5.7-3.1 1.2-9.6 4.2-10.2 7.5-.2 1 .1 2 .9 2.6.7.6 1.7 1 2.7.9 3.9 0 7.8-5.4 10.5-10.1 1.5-.5 3-1 4.6-1.4 1.7-.4 3.3-.8 4.8-1.1 4.2 3.6 7.9 4.2 9.7 4.2 2.5 0 3.5-1.1 3.8-2 .4-1.1.2-2.3-.6-3.1zm-2.7 1.9c-.1.7-.9 1.2-1.9 1.2-.3 0-.6 0-.9-.1-2-.5-3.9-1.5-5.5-2.8 1.3-.2 2.7-.3 4-.3.9 0 1.8.1 2.7.2.9.2 1.9.6 1.6 1.8zM27.6 13.7c.2-.3.5-.5.9-.6 1 0 1.2 1.1 1.2 2.1-.1 2.3-.5 4.5-1.2 6.7-1.7-4.3-1.5-7.2-.9-8.2zm5.6 19.2c-1.1.2-2.2.5-3.3.8-.8.2-1.6.5-2.5.7.4-.9.8-1.8 1.2-2.6.5-1.1.9-2.2 1.3-3.3.4.6.7 1.1 1.1 1.6.7 1 1.5 1.9 2.2 2.8zm-12.1 5.8c-2.5 4-5 6.6-6.4 6.6-.2 0-.5-.1-.6-.2-.3-.2-.4-.6-.3-.9.2-1.5 3.1-3.6 7.3-5.5z"
              fill="#fff"
            />
          </svg>
          Учебник рекомендуется смотреть в бесплатной версии программы Adobe
          Acrobat Reader DC, которая доступна на всех платформах
        </div>
        <div className="space-y-2">
          {filenames.map((f, i) => (
            <div
              className="flex ml-auto block bg-neutral-900 px-4 py-2 rounded-2xl w-full items-center"
              key={i}
            >
              <div className="rounded-full p-2 bg-neutral-700">
                <DocumentIcon className="w-6" />
              </div>
              <div className="ml-4">{f}</div>
              <a
                target="_blank"
                rel="noreferrer"
                href={`/tutors/${f}`}
                className="ml-auto flex justify-center bg-neutral-800 rounded-2xl px-3 py-2 my-2"
              >
                <ArrowDownTrayIcon className="w-6 sm:mr-2" />
                <div className="hidden sm:block">Скачать</div>
              </a>
            </div>
          ))}
        </div>
      </Content>
    </>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "public/tutors");
  const filenames = await fs.readdir(postsDirectory);

  return { props: { filenames } };
}
