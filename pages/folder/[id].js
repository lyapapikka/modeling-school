import Head from "next/head";
import Content from "../../components/Content";
import Header from "../../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  DocumentIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Folder() {
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
        <title>Папка - Школа моделирования</title>
      </Head>
      <Content>
        <Header home groupsPage />
        <div className="flex items-center text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          <Link href="/home">
            <a className="inline-block -my-1 mr-2 -ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <ChevronLeftIcon className="w-6" />
            </a>
          </Link>
          <div className="text-xl font-bold bg-neutral-900 rounded-b-2xl">
            Папка
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex space-x-2 mx-2">
            <button className="bg-neutral-800 w-full flex justify-center rounded-2xl py-4">
              <DocumentTextIcon className="w-6 sm:mr-2" />
              <div className="sm:block hidden">Текст</div>
            </button>
            <button className="bg-neutral-800 w-full flex justify-center rounded-2xl py-4">
              <PhotoIcon className="w-6 sm:mr-2" />
              <div className="sm:block hidden">Картинка</div>
            </button>
            <button className="bg-neutral-800 w-full flex justify-center rounded-2xl py-4">
              <DocumentPlusIcon className="w-6 sm:mr-2" />
              <div className="sm:block hidden">Файл</div>
            </button>
          </div>
          <div className="bg-neutral-900 rounded-2xl py-3 px-4">
            Мы любим животных и стараемся поддерживать тех из них, кому не
            посчастливилось иметь ласковых хозяев и тёплый кров. Один из
            проверенных способов это сделать — помочь приюту для животных
            Домашний. У этих ребят живёт более 1500 четвероногих, и благодаря их
            труду ежегодно сотни питомцев находят свой новый дом.
            <div className="flex">
              <button
                title="Редактировать"
                className="sm:hover:bg-neutral-700 p-2 rounded-full block ml-auto"
              >
                <PencilSquareIcon className="w-6" />
              </button>
              <button
                title="Удалить"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <TrashIcon className="w-6 stroke-red-500" />
              </button>
              <button
                title="Переместить вверх"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <ChevronUpIcon className="w-6" />
              </button>
              <button
                title="Переместить вниз"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <ChevronDownIcon className="w-6" />
              </button>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-2xl py-3 px-4">
            <div className="relative aspect-video mb-2">
              <Image objectFit="contain" layout="fill" src="/cat.jpg" />
            </div>
            <div className="flex">
              <button
                title="Удалить"
                className="sm:hover:bg-neutral-700 p-2 rounded-full block ml-auto"
              >
                <TrashIcon className="w-6 stroke-red-500" />
              </button>
              <button
                title="Переместить вверх"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <ChevronUpIcon className="w-6" />
              </button>
              <button
                title="Переместить вниз"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <ChevronDownIcon className="w-6" />
              </button>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-2xl py-3 px-4">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-neutral-700">
                <DocumentIcon className="w-6" />
              </div>
              <div className="ml-4 mb-1">gta_sa.exe</div>
              <button
                title="Скачать"
                className="sm:hover:bg-neutral-700 p-2 rounded-full block ml-auto"
              >
                <ArrowDownTrayIcon className="w-6" />
              </button>
              <button
                title="Удалить"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <TrashIcon className="w-6 stroke-red-500" />
              </button>
              <button
                title="Переместить вверх"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <ChevronUpIcon className="w-6" />
              </button>
              <button
                title="Переместить вниз"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <ChevronDownIcon className="w-6" />
              </button>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}
