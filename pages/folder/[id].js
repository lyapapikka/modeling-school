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
  LinkIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import api from "../../utils/api";
import { nanoid } from "nanoid";
import Modal from "../../components/Modal";
import toast from "../../utils/toast";

export default function Folder() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const { id, from } = router.query;
  const supabase = useSupabaseClient();
  const [files, setFiles] = useState([]);
  const [order, setOrder] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selection, setSelection] = useState("");
  const [cachedOrder, setCachedOrder] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`${origin}/folder/${id}`);
    toast("Ссылка скопирована");
  };

  const editTextTrue = () => {
    setIsEditing(true);
  };

  const editTextFalse = () => {
    setIsEditing(false);
  };

  const showDeleteDialog = (id) => {
    setSelection(id);
    setDeleteDialog(true);
  };

  const hideDeleteDialog = () => setDeleteDialog(false);

  const deleteFile = async () => {
    setDeleteDialog(false);
    setOrder(order.filter((f) => f !== selection));

    await supabase.from("files").delete().eq("id", selection);
    await supabase
      .from("folders")
      .upsert([
        { id, files: JSON.stringify(order.filter((f) => f !== selection)) },
      ]);
  };

  const { data: folder } = useSWR(
    !isLoading && session && router.isReady
      ? api(`folders?id=eq.${id}`, session)
      : null,
    fetcher
  );

  const changeText = ({ target: { value } }) => setText(value);

  const addText = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("files")
      .insert([
        {
          user_id: session.user.id,
          type: "text",
          value: text,
        },
      ])
      .select();

    await supabase
      .from("folders")
      .upsert([
        { id: router.query.id, files: JSON.stringify([data[0].id, ...order]) },
      ]);

    setText("");
    setOrder([data[0].id, ...order]);
    setLoading(false);
  };

  const uploadImage = async ({ target: { files } }) => {
    setImageLoading(true);

    const picture = `${nanoid(11)}.${files[0].name.split(".").pop()}`;
    await supabase.storage.from("folder").upload(picture, files[0]);

    const { data } = await supabase
      .from("files")
      .insert([
        {
          user_id: session.user.id,
          type: "image",
          value: picture,
        },
      ])
      .select();

    await supabase
      .from("folders")
      .upsert([
        { id: router.query.id, files: JSON.stringify([data[0].id, ...order]) },
      ]);

    setOrder([data[0].id, ...order]);
    setImageLoading(false);
  };

  const uploadFile = async ({ target: { files } }) => {
    setFileLoading(true);

    await supabase.storage.from("folder").upload(files[0].name, files[0]);

    const { data } = await supabase
      .from("files")
      .insert([
        {
          user_id: session.user.id,
          type: "file",
          value: files[0].name,
        },
      ])
      .select();

    await supabase
      .from("folders")
      .upsert([
        { id: router.query.id, files: JSON.stringify([data[0].id, ...order]) },
      ]);

    setOrder([data[0].id, ...order]);
    setFileLoading(false);
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    if (router.isReady) {
      const func = async () => {
        const { data: initialOrder } = await supabase
          .from("folders")
          .select()
          .eq("id", router.query.id);

        setOrder(JSON.parse(initialOrder[0].files));
        setCachedOrder(JSON.parse(initialOrder[0].files));

        const { data: initialFiles } = await supabase
          .from("files")
          .select("*,public_users(*)")
          .in("id", JSON.parse(initialOrder[0].files));

        setFiles(initialFiles);

        supabase
          .channel(router.query.id)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "folders",
              filter: `id=eq.${router.query.id}`,
            },
            (payload) => {
              setOrder(JSON.parse(payload.new.files));
            }
          )
          .subscribe();
      };

      func();
    }
  }, [router, supabase]);

  useEffect(() => {
    const func = async () => {
      const { data: f } = await supabase
        .from("files")
        .select("*,public_users(*)")
        .in("id", order);
      setFiles(f);
      setCachedOrder(order);
    };

    func();
  }, [order, supabase]);

  if (isLoading || !session) {
    return null;
  }
  const editorText = (event) => {
    setSelection(files.find((file) => file.id === event).value);
    setText(files.find((file) => file.id === event).value);
    editTextTrue();
    console.log(selection);
  };

  const saveChange = (selection) => {
    console.log(files.find((file) => file));
    // console.log(files.find((file) => file.value === selection));
    // changeText(files.find((file) => file.value === selection));
    editTextFalse();
  };

  // const onClickEditText = (event) => {
  //   console.log(event);
  //   editTextTrue;
  //   console.log(isEditing);
  // };

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
            <div className="bg-neutral-900 rounded-2xl py-2 px-4 mb-2 space-y-2 text-center">
              <div className="text-xl mr-auto line-clamp-1 mt-1">
                {folder[0].name}
              </div>
              <div className="text-neutral-500 pb-2">Кто-то печатает...</div>
            </div>
            <div className="space-y-2">
              <div className="flex space-x-2 mx-2">
                <input
                  disabled={imageLoading}
                  id="image-upload"
                  onChange={uploadImage}
                  type="file"
                  accept="image/*"
                  hidden
                />
                {imageLoading ? (
                  <div className="bg-neutral-900 w-full flex justify-center rounded-2xl py-4">
                    <EllipsisHorizontalIcon className="w-6 sm:mr-2" />
                    <div className="sm:block hidden">Загружаем</div>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
                  >
                    <PhotoIcon className="w-6 sm:mr-2" />
                    <div className="sm:block hidden">Картинка</div>
                  </label>
                )}
                <input
                  disabled={fileLoading}
                  id="file-upload"
                  onChange={uploadFile}
                  type="file"
                  hidden
                />
                {fileLoading ? (
                  <div className="bg-neutral-900 w-full flex justify-center rounded-2xl py-4">
                    <EllipsisHorizontalIcon className="w-6 sm:mr-2" />
                    <div className="sm:block hidden">Добавляем</div>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
                  >
                    <DocumentIcon className="w-6 sm:mr-2" />
                    <div className="sm:block hidden">Файл</div>
                  </label>
                )}
                <button
                  onClick={copyLink}
                  className="bg-neutral-800 sm:hover:bg-neutral-700 w-full flex justify-center rounded-2xl py-4"
                >
                  <LinkIcon className="w-6 sm:mr-2" />
                  <div className="sm:block hidden">Поделиться</div>
                </button>
              </div>
              <div className="px-2">
                <ReactTextareaAutosize
                  disabled={loading}
                  value={text}
                  onChange={changeText}
                  placeholder="Напишите что-нибудь..."
                  className="bg-neutral-700 block resize-none py-2 px-3 rounded-2xl w-full mt-1 mb-2"
                />

                {text.trim() &&
                  !loading &&
                  (isEditing === false ? (
                    <button
                      onClick={addText}
                      className="w-full flex justify-center bg-white sm:hover:bg-neutral-200 text-black rounded-2xl px-3 py-2 my-2"
                    >
                      <CheckIcon className="w-6 mr-2" />
                      <div className="leading-6">Добавить</div>
                    </button>
                  ) : (
                    <button
                      onClick={saveChange}
                      className="w-full flex justify-center bg-white sm:hover:bg-neutral-200 text-black rounded-2xl px-3 py-2 my-2"
                    >
                      <CheckIcon className="w-6 mr-2" />
                      <div className="leading-6">Изменить</div>
                    </button>
                  ))}
                {loading && (
                  <div className="w-full flex justify-center bg-neutral-900 rounded-2xl px-3 py-2 my-2">
                    <EllipsisHorizontalIcon className="w-6 mr-2" />
                    <div className="leading-6">Добавляем</div>
                  </div>
                )}
              </div>
              {cachedOrder.length === files.length &&
                (cachedOrder.length === 0 ? (
                  <div className="text-center text-neutral-500 pt-8">
                    Папка пуста
                  </div>
                ) : (
                  cachedOrder.map((f, i) =>
                    files.find((file) => file.id === f).type === "text" ? (
                      <div
                        className="bg-neutral-900 rounded-2xl py-3 px-4"
                        key={i}
                      >
                        <div className="flex items-center mb-4">
                          {files.find((file) => file.id === f).public_users
                            ?.raw_user_meta_data?.name ? (
                            ((
                              <Image
                                src={`${
                                  process.env.NEXT_PUBLIC_SUPABASE_BUCKET
                                }/profile/${
                                  files.find((file) => file.id === f)
                                    .public_users.raw_user_meta_data.picture
                                }`}
                                height={40}
                                width={40}
                                objectFit="cover"
                                className="rounded-full"
                                alt=""
                              />
                            ),
                            (
                              <div className="ml-2 line-clamp-1">
                                {
                                  files.find((file) => file.id === f)
                                    .public_users.raw_user_meta_data.name
                                }
                              </div>
                            ))
                          ) : (
                            <div className="flex justify-center space-x-3">
                              <div className="w-[40px] h-[40px] rounded-full shrink-0 flex justify-center bg-neutral-800">
                                <QuestionMarkCircleIcon className="w-6" />
                              </div>
                              <div className="mt-2 line-clamp-1">
                                Неизвестный пользователь
                              </div>
                            </div>
                          )}
                        </div>
                        {files.find((file) => file.id === f).value}
                        <div className="flex mt-2 -mx-2">
                          {session.user.id ===
                            files.find((file) => file.id === f).user_id && (
                            <button
                              onClick={() =>
                                showDeleteDialog(
                                  files.find((file) => file.id === f).id
                                )
                              }
                              title="Удалить"
                              className="sm:hover:bg-neutral-700 p-2 rounded-full block"
                            >
                              <TrashIcon className="w-6 stroke-red-500" />
                            </button>
                          )}

                          <button
                            title="Редактировать текст"
                            className="sm:hover:bg-neutral-700 p-2 rounded-full mr-auto"
                            onClick={() =>
                              editorText(files.find((file) => file.id === f).id)
                            }
                          >
                            <PencilSquareIcon className="w-6" />
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
                    ) : files.find((file) => file.id === f).type === "image" ? (
                      <div
                        className="bg-neutral-900 rounded-2xl py-3 px-4"
                        key={i}
                      >
                        <div className="flex items-center mb-4">
                          {files.find((file) => file.id === f).public_users
                            ?.raw_user_meta_data?.name ? (
                            ((
                              <Image
                                src={`${
                                  process.env.NEXT_PUBLIC_SUPABASE_BUCKET
                                }/profile/${
                                  files.find((file) => file.id === f)
                                    .public_users.raw_user_meta_data.picture
                                }`}
                                height={40}
                                width={40}
                                objectFit="cover"
                                className="rounded-full"
                                alt=""
                              />
                            ),
                            (
                              <div className="ml-2 line-clamp-1">
                                {
                                  files.find((file) => file.id === f)
                                    .public_users.raw_user_meta_data.name
                                }
                              </div>
                            ))
                          ) : (
                            <div className="flex justify-center space-x-3">
                              <div className="w-[40px] h-[40px] rounded-full shrink-0 flex justify-center bg-neutral-800">
                                <QuestionMarkCircleIcon className="w-6" />
                              </div>
                              <div className="mt-2 line-clamp-1">
                                Неизвестный пользователь
                              </div>
                            </div>
                          )}
                          <div className="ml-2 line-clamp-1">
                            {
                              files.find((file) => file.id === f).public_users
                                .raw_user_meta_data.name
                            }
                          </div>
                        </div>
                        <div className="relative aspect-square mb-2">
                          <Image
                            objectFit="contain"
                            layout="fill"
                            src={`${
                              process.env.NEXT_PUBLIC_SUPABASE_BUCKET
                            }/folder/${
                              files.find((file) => file.id === f).value
                            }`}
                            alt=""
                          />
                        </div>
                        <div className="flex -mx-2">
                          {session.user.id ===
                            files.find((file) => file.id === f).user_id && (
                            <button
                              onClick={() =>
                                showDeleteDialog(
                                  files.find((file) => file.id === f).id
                                )
                              }
                              title="Удалить"
                              className="sm:hover:bg-neutral-700 p-2 rounded-full block"
                            >
                              <TrashIcon className="w-6 stroke-red-500" />
                            </button>
                          )}

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
                      <div
                        className="bg-neutral-900 rounded-2xl py-3 px-4"
                        key={i}
                      >
                        <div className="flex items-center mb-4">
                          {files.find((file) => file.id === f).public_users
                            ?.raw_user_meta_data?.name ? (
                            ((
                              <Image
                                src={`${
                                  process.env.NEXT_PUBLIC_SUPABASE_BUCKET
                                }/profile/${
                                  files.find((file) => file.id === f)
                                    .public_users.raw_user_meta_data.picture
                                }`}
                                height={40}
                                width={40}
                                objectFit="cover"
                                className="rounded-full"
                                alt=""
                              />
                            ),
                            (
                              <div className="ml-2 line-clamp-1">
                                {
                                  files.find((file) => file.id === f)
                                    .public_users.raw_user_meta_data.name
                                }
                              </div>
                            ))
                          ) : (
                            <div className="flex justify-center space-x-3">
                              <div className="w-[40px] h-[40px] rounded-full shrink-0 flex justify-center bg-neutral-800">
                                <QuestionMarkCircleIcon className="w-6" />
                              </div>
                              <div className="mt-2 line-clamp-1">
                                Неизвестный пользователь
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <div className="rounded-full p-2 bg-neutral-700">
                            <DocumentIcon className="w-6" />
                          </div>
                          <div className="ml-4 line-clamp-1">
                            {files.find((file) => file.id === f).value}
                          </div>
                          <a
                            href={`${
                              process.env.NEXT_PUBLIC_SUPABASE_BUCKET
                            }/folder/${
                              files.find((file) => file.id === f).value
                            }`}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto flex justify-center bg-neutral-800 sm:hover:bg-neutral-700 rounded-2xl px-3 py-2 my-2"
                          >
                            <ArrowDownTrayIcon className="w-6 sm:mr-2" />
                            <div className="hidden sm:block">Скачать</div>
                          </a>
                        </div>
                        <div className="flex mt-2 -mx-2">
                          {session.user.id ===
                            files.find((file) => file.id === f).user_id && (
                            <button
                              onClick={() =>
                                showDeleteDialog(
                                  files.find((file) => file.id === f).id
                                )
                              }
                              title="Удалить"
                              className="sm:hover:bg-neutral-700 p-2 rounded-full"
                            >
                              <TrashIcon className="w-6 stroke-red-500" />
                            </button>
                          )}

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
      {deleteDialog && (
        <Modal onClose={hideDeleteDialog}>
          <div className="text-lg mb-4">
            Файл нельзя будет восстановить после удаления. Вы уверены?
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={deleteFile}
              className="bg-neutral-800 sm:hover:bg-neutral-700 rounded-2xl px-3 py-2 w-full"
            >
              Да
            </button>
            <button
              onClick={hideDeleteDialog}
              className="bg-white sm:hover:bg-neutral-200 text-black rounded-2xl px-3 py-2 w-full"
            >
              Нет
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
