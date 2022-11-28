import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import api from "../utils/api";

export default function Home() {
  const router = useRouter();
  const { isLoading, session, supabaseClient } = useSessionContext();
  const [newGroup, setNewGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const { data, mutate } = useSWR(
    !isLoading && session
      ? api(`groups?owner_id=eq.${session.user.id}`, session)
      : null,
    fetcher
  );

  const changeGroupName = ({ target: { value } }) => setGroupName(value);
  const changeGroupDescription = ({ target: { value } }) =>
    setGroupDescription(value);

  const showGroupDialog = () => setNewGroup(true);
  const hideGroupDialog = () => setNewGroup(false);

  const createGroup = async () => {
    setNewGroup(false);
    setGroupName("");
    setGroupDescription("");
    await supabaseClient.from("groups").insert([
      {
        owner_id: session.user.id,
        name: groupName,
        description: groupDescription,
      },
    ]);
    mutate();
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [session, router, isLoading]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <Content>
        <Header home homePage />
        <div className="text-xl font-bold ml-4 mb-2">Ваши группы</div>
        {data ? (
          <>
            {!newGroup ? (
              <button
                onClick={showGroupDialog}
                className="w-full bg-neutral-800 rounded-2xl py-6 px-4 flex my-4"
              >
                <PlusIcon className="w-6 ml-2 mr-4" />
                Новая группа
              </button>
            ) : (
              <div className="space-y-4 my-4 px-2">
                <input
                  className="block w-full px-3 py-2 rounded-2xl bg-neutral-700"
                  placeholder="Название"
                  value={groupName}
                  onChange={changeGroupName}
                />
                <TextareaAutosize
                  className="block w-full px-3 py-2 rounded-2xl resize-none bg-neutral-700"
                  placeholder="Описание"
                  value={groupDescription}
                  onChange={changeGroupDescription}
                />
                <div className="flex gap-4">
                  {groupName.trim() && groupDescription.trim() && (
                    <button
                      onClick={createGroup}
                      className="w-full flex justify-center bg-white text-black font-medium rounded-2xl text-sm px-3 py-2"
                    >
                      <CheckIcon className="w-6 mr-2" />
                      <div className="leading-6">Создать</div>
                    </button>
                  )}
                  <button
                    onClick={hideGroupDialog}
                    className="w-full flex justify-center bg-neutral-600 font-medium rounded-2xl text-sm px-3 py-2"
                  >
                    <XMarkIcon className="w-6 mr-2" />
                    <div className="leading-6">Отменить</div>
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {data.map((g) => (
                <Link href={`/group/${g.id}`} key={g.id}>
                  <a className="bg-neutral-800 rounded-2xl py-3 px-4 flex gap-4">
                    <div className="mt-2 ml-1">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>
                      {g.name}
                      <div className="text-neutral-500">40 участников</div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            <div className="text-xl ml-4 my-4 font-bold">Рекомендации</div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-neutral-800 h-20 rounded-2xl"></div>
            <div className="bg-neutral-800 h-20 rounded-2xl"></div>
            <div className="bg-neutral-800 h-20 rounded-2xl"></div>
            <div className="bg-neutral-800 h-20 rounded-2xl"></div>
            <div className="bg-neutral-800 h-20 rounded-2xl"></div>
          </div>
        )}
        {/* <div className="space-y-4">
          <Link href="/group/random">
            <a className="bg-neutral-800 rounded-2xl py-3 px-4 flex gap-4">
              <div className="mt-2 ml-1">
                <Image
                  alt=""
                  width={30}
                  height={30}
                  src="https://avatars.dicebear.com/api/identicon/Геометрия и топология.svg"
                />
              </div>
              <div>
                Геометрия и топология
                <div className="text-neutral-500">40 участников</div>
              </div>
            </a>
          </Link>
          <Link href="/group/random">
            <a className="bg-neutral-800 rounded-2xl py-3 px-4 flex gap-4">
              <div className="mt-2 ml-1">
                <Image
                  alt=""
                  width={30}
                  height={30}
                  src="https://avatars.dicebear.com/api/identicon/Математическое моделирование.svg"
                />
              </div>
              <div>
                Математическое моделирование
                <div className="text-neutral-500">255 участников</div>
              </div>
            </a>
          </Link>
          <Link href="/group/random">
            <a className="bg-neutral-800 rounded-2xl py-3 px-4 flex gap-4">
              <div className="mt-2 ml-1">
                <Image
                  alt=""
                  width={30}
                  height={30}
                  src="https://avatars.dicebear.com/api/identicon/Алгебра и теория чисел.svg"
                />
              </div>
              <div>
                Алгебра и теория чисел
                <div className="text-neutral-500">859 участников</div>
              </div>
            </a>
          </Link>
        </div> */}
      </Content>
    </>
  );
}
