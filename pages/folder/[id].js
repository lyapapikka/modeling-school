import Head from "next/head";
import Content from "../../components/Content";
import Header from "../../components/Header";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  DocumentIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import api from "../../utils/api";

export default function Folder() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const { id, from } = router.query;
  const supabase = useSupabaseClient();
  const [files, setFiles] = useState([]);
  const [order, setOrder] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [folderChannel, setFolderChannel] = useState("");
  const [filesChannel, setFilesChannel] = useState("");

  const { data: folder } = useSWR(
    !isLoading && session && router.isReady
      ? api(`folders?id=eq.${id}`, session)
      : null,
    fetcher
  );

  const changeText = ({ target: { value } }) => setText(value);

  const addText = async () => {
    setLoading(true);

    filesChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await supabase.from("files").insert({
          user_id: session.user.id,
          type: "text",
          value: text,
          folder_id: id,
        });
      }
    });

    setText("");
    setLoading(false);
  };

  const uploadImage = async ({ target: { files } }) => {};

  const uploadFile = async ({ target: { files } }) => {};

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    if (folderChannel && filesChannel && router.isReady) {
      folderChannel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "folders",
          filter: `id=eq.${router.query.id}`,
        },
        (payload) => setOrder(payload)
      );

      filesChannel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "files",
          filter: `folder_id=eq.${router.query.id}`,
        },
        (payload) => {
          console.log(payload);
          setFiles(payload);
        }
      );
    }
  }, [folderChannel, filesChannel, router]);

  useEffect(() => {
    if (router.isReady) {
      setFolderChannel(supabase.channel(router.query.id));
      setFilesChannel(supabase.channel(`files-${router.query.id}`));
    }
  }, [router, supabase]);

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
        {folder && (
          <>
            <div className="bg-neutral-900 rounded-2xl py-2 px-4 mb-2 space-y-4">
              <div className="text-xl mr-auto line-clamp-1 mt-1 text-center">
                {folder[0].name}
              </div>
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
                <input
                  id="file-upload"
                  onChange={uploadFile}
                  type="file"
                  hidden
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
                >
                  <DocumentIcon className="w-6 sm:mr-2" />
                  <div className="sm:block hidden">Файл</div>
                </label>
              </div>
              <div className="px-2">
                <ReactTextareaAutosize
                  disabled={loading}
                  value={text}
                  onChange={changeText}
                  placeholder="Напишите что-нибудь..."
                  className="bg-neutral-700 block resize-none py-2 px-3 rounded-2xl w-full mt-1 mb-2"
                />
                {text.trim() && !loading && (
                  <button
                    onClick={addText}
                    className="w-full flex justify-center bg-white sm:hover:bg-neutral-200 text-black rounded-2xl px-3 py-2 my-2"
                  >
                    <CheckIcon className="w-6 mr-2" />
                    <div className="leading-6">Добавить</div>
                  </button>
                )}
                {loading && (
                  <div className="w-full flex justify-center bg-neutral-900 rounded-2xl px-3 py-2 my-2">
                    <EllipsisHorizontalIcon className="w-6 mr-2" />
                    <div className="leading-6">Добавляем</div>
                  </div>
                )}
              </div>
              {order &&
                (files.length === 0 ? (
                  <div className="text-center text-neutral-500 pt-8">
                    Папка пуста
                  </div>
                ) : (
                  files.map((f) =>
                    f.type === "text" ? (
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
                        Мы любим животных и стараемся поддерживать тех из них,
                        кому не посчастливилось иметь ласковых хозяев и тёплый
                        кров. Один из проверенных способов это сделать — помочь
                        приюту для животных Домашний. У этих ребят живёт более
                        1500 четвероногих, и благодаря их труду ежегодно сотни
                        питомцев находят свой новый дом.
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
                    ) : f.type === "image" ? (
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
                          <Image
                            objectFit="contain"
                            layout="fill"
                            src="/cat.jpg"
                            alt=""
                          />
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
                    ) : (
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
                    )
                  )
                ))}
            </div>
          </>
        )}
      </Content>
    </>
  );
}
