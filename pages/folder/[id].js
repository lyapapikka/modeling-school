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
  DocumentTextIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function Folder() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const { from } = router.query;

  const addText = async () => {};

  const uploadImage = async ({ target: { files } }) => {};

  const uploadFile = async ({ target: { files } }) => {};

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
          <Link href={from || "/home"}>
            <a className="inline-block -my-1 mr-2 -ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <ChevronLeftIcon className="w-6" />
            </a>
          </Link>
          <div className="text-xl font-bold bg-neutral-900 rounded-b-2xl mb-1">
            Папка
          </div>
        </div>
        <div className="bg-neutral-900 rounded-2xl py-2 px-4 mb-2 space-y-4">
          <div className="text-xl mr-auto line-clamp-1 mt-1 text-center">
            Название папки
          </div>
          {/* <input
            placeholder="Название группы"
            className="bg-neutral-700 py-2 px-3 rounded-2xl mr-4 w-full mt-2"
          /> */}
          <div className="space-x-2 flex mb-2 justify-center">
            <div className="shrink-0">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
            </div>
            <div className="shrink-0">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
            </div>
            <div className="shrink-0">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex space-x-2 mx-2">
            <button
              onClick={addText}
              className="bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
            >
              <DocumentTextIcon className="w-6 sm:mr-2" />
              <div className="sm:block hidden">Текст</div>
            </button>
            <input
              id="image-upload"
              onChange={uploadImage}
              type="file"
              accept="image/*"
              hidden
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
            >
              <PhotoIcon className="w-6 sm:mr-2" />
              <div className="sm:block hidden">Картинка</div>
            </label>
            <input id="file-upload" onChange={uploadFile} type="file" hidden />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
            >
              <DocumentIcon className="w-6 sm:mr-2" />
              <div className="sm:block hidden">Файл</div>
            </label>
          </div>
          <div className="bg-neutral-900 rounded-2xl py-3 px-4">
            <div className="flex items-center mb-4">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
              <div className="ml-2 line-clamp-1">Кот Матроскин</div>
            </div>
            Мы любим животных и стараемся поддерживать тех из них, кому не
            посчастливилось иметь ласковых хозяев и тёплый кров. Один из
            проверенных способов это сделать — помочь приюту для животных
            Домашний. У этих ребят живёт более 1500 четвероногих, и благодаря их
            труду ежегодно сотни питомцев находят свой новый дом.
            <div className="flex">
              <button
                title="Переместить вверх"
                className="sm:hover:bg-neutral-700 p-2 rounded-full ml-auto"
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
            <div className="flex items-center mb-4">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
              <div className="ml-2 line-clamp-1">Кот Матроскин</div>
            </div>
            <ReactTextareaAutosize
              minRows={3}
              placeholder="Напишите что-нибудь..."
              className="bg-neutral-700 block resize-none py-2 px-3 rounded-2xl w-full mt-1 mb-2"
            />
            <div className="flex">
              <button
                title="Удалить"
                className="sm:hover:bg-neutral-700 p-2 rounded-full mr-auto"
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
            <div className="flex items-center mb-4">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
              <div className="ml-2 line-clamp-1">Кот Матроскин</div>
            </div>
            <div className="relative aspect-video mb-2">
              <Image objectFit="contain" layout="fill" src="/cat.jpg" alt="" />
            </div>
            <div className="flex">
              <button
                title="Удалить"
                className="sm:hover:bg-neutral-700 p-2 rounded-full block"
              >
                <TrashIcon className="w-6 stroke-red-500" />
              </button>
              <button
                title="Переместить вверх"
                className="sm:hover:bg-neutral-700 p-2 rounded-full ml-auto"
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
            <div className="flex items-center mb-4">
              <Image
                src="/cat.jpg"
                height={40}
                width={40}
                objectFit="cover"
                className="rounded-full"
                alt=""
              />
              <div className="ml-2 line-clamp-1">Кот Матроскин</div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-neutral-700">
                <DocumentIcon className="w-6" />
              </div>
              <div className="ml-4">gta_sa.exe</div>
              <button className="ml-auto flex justify-center bg-neutral-800 sm:hover:bg-neutral-700 rounded-2xl px-3 py-2 my-2">
                <ArrowDownTrayIcon className="w-6 sm:mr-2" />
                <div className="hidden sm:block">Скачать</div>
              </button>
            </div>
            <div className="flex mt-2">
              <button
                title="Удалить"
                className="sm:hover:bg-neutral-700 p-2 rounded-full"
              >
                <TrashIcon className="w-6 stroke-red-500" />
              </button>
              <button
                title="Переместить вверх"
                className="sm:hover:bg-neutral-700 p-2 rounded-full ml-auto"
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
