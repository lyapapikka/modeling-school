import Head from "next/head";
import Content from "../../../components/Content";
import Header from "../../../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CheckIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import ReactTextareaAutosize from "react-textarea-autosize";
import useSWR from "swr";
import api from "../../../utils/api";
import fetcher from "../../../utils/fetcher";

export default function Settings() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { data } = useSWR(
    !isLoading && session ? api(`groups?id=eq.${id}`, session) : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setName(data[0].name);
      setDescription(data[0].description);
    }
  }, [data]);

  const changeName = ({ target: { value } }) => setName(value);
  const changeDescription = ({ target: { value } }) => setDescription(value);

  const saveGroup = async () => {
    setLoading(true);
    await supabaseClient
      .from("groups")
      .update([
        {
          name: name,
          description: description,
        },
      ])
      .eq("id", id);
    router.push(`/group/${id}`);
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
        <title>Настройки группы - Школа моделирования</title>
      </Head>
      <Content>
        <Header href={`/group/${id}`} />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-4">
          Настройки группы
        </div>
        {data && (
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
            {loading ? (
              <div className="w-full rounded-2xl bg-neutral-900 justify-center flex py-2">
                <EllipsisHorizontalIcon className="w-6 mr-2" />
                Сохраняем изменения
              </div>
            ) : (
              name.trim() && (
                <button
                  onClick={saveGroup}
                  className="w-full rounded-2xl bg-white text-black justify-center flex py-2"
                >
                  <CheckIcon className="w-6 mr-2" />
                  Сохранить
                </button>
              )
            )}
          </div>
        )}
      </Content>
    </>
  );
}
