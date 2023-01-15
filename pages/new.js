import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function New() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("");
  const [loading, setLoading] = useState(false);

  const changeName = ({ target: { value } }) => setName(value);
  const changeDescription = ({ target: { value } }) => setDescription(value);

  const setPublic = () => setVisibility("public");
  const setPrivate = () => setVisibility("private");

  const createGroup = async () => {
    setLoading(true);
    await supabaseClient.from("groups").insert([
      {
        owner_id: session.user.id,
        name: name,
        description: description,
        public: visibility === "public",
      },
    ]);
    router.push("/home");
  };

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
        <title>Новая группа - Школа моделирования</title>
      </Head>
      <Content>
        <Header href="/groups" />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-4">
          Новая группа
        </div>
        <div className="px-2 space-y-4">
          <input
            disabled={loading}
            value={name}
            onChange={changeName}
            className="bg-neutral-700 py-2 px-3 rounded-2xl block w-full"
            placeholder="Название"
          />
          <ReactTextareaAutosize
            disabled={loading}
            value={description}
            onChange={changeDescription}
            minRows={3}
            className="bg-neutral-700 block resize-none py-2 px-3 rounded-2xl w-full"
            placeholder="Описание"
          />
          <button
            disabled={loading}
            onClick={setPublic}
            className={`flex items-center ${
              visibility !== "public"
                ? "bg-neutral-900 sm:hover:bg-neutral-800"
                : "bg-white text-black sm:hover:bg-neutral-200"
            } rounded-2xl py-3 pr-3 w-full`}
          >
            <GlobeAltIcon className="w-6 shrink-0 mx-4" />
            <div className="text-start">
              <div className="font-medium">Публичная группа</div>
              <div className="text-neutral-600">
                Группа будет видна в разделе рекомендаций
              </div>
            </div>
          </button>
          <button
            disabled={loading}
            onClick={setPrivate}
            className={`flex items-center ${
              visibility !== "private"
                ? "bg-neutral-900 sm:hover:bg-neutral-800"
                : "bg-white text-black sm:hover:bg-neutral-200"
            } rounded-2xl py-3 pr-3 w-full`}
          >
            <LockClosedIcon className="w-6 shrink-0 mx-4" />
            <div className="text-start">
              <div className="font-medium">Частная группа</div>
              <div className="text-neutral-600">
                Группа будет доступна только по ссылке
              </div>
            </div>
          </button>
          {loading ? (
            <div className="w-full rounded-2xl bg-neutral-900 justify-center flex py-2">
              <EllipsisHorizontalIcon className="w-6 mr-2" />
              Создаем группу
            </div>
          ) : (
            name.trim() &&
            visibility && (
              <button
                onClick={createGroup}
                className="w-full rounded-2xl bg-white text-black justify-center flex py-2"
              >
                <CheckIcon className="w-6 mr-2" />
                Создать
              </button>
            )
          )}
        </div>
      </Content>
    </>
  );
}
