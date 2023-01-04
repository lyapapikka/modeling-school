import Head from "next/head";
import Content from "../../components/Content";
import Header from "../../components/Header";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  PowerIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import useSWR from "swr";
import api from "../../utils/api";
import fetcher from "../../utils/fetcher";
import { nanoid } from "nanoid";

export default function Settings() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const supabase = useSupabaseClient();

  const { data: user, mutate } = useSWR(
    !isLoading && session ? api(`user`, session, { user: true }) : null,
    fetcher
  );

  const changeName = ({ target: { value } }) => setName(value);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const saveProfile = async () => {
    setLoading(true);
    await supabase.auth.updateUser({ data: { name } });
    router.push("/profile");
  };

  const uploadPhoto = async ({ target: { files } }) => {
    setImageLoading(true);
    const picture = `${nanoid(11)}.${files[0].name.split(".").pop()}`;
    await supabase.storage.from("profile").upload(picture, files[0]);
    await supabase.auth.updateUser({ data: { name, picture } });
    mutate();
    setImageLoading(false);
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    setName(user?.user_metadata?.name || "Неизвестный пользователь");
  }, [user]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Настройки профиля - Школа моделирования</title>
      </Head>
      <Content>
        <Header href="/profile" />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-4">
          Настройки профиля
        </div>
        {user && (
          <div className="px-2 space-y-4">
            <div className="flex items-center">
              <div className="shrink-0">
                {user?.user_metadata?.picture ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/profile/${user.user_metadata.picture}`}
                    width={100}
                    height={100}
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-neutral-800 rounded-full flex justify-center">
                    <QuestionMarkCircleIcon className="w-14" />
                  </div>
                )}
              </div>
              <div className="w-full ml-2">
                <div className="text-lg mb-2 line-clamp-1">
                  {user?.user_metadata?.name || "Неизвестный пользователь"}
                </div>
                <input
                  onChange={uploadPhoto}
                  type="file"
                  accept="image/*"
                  id="upload"
                  hidden
                />
                {imageLoading ? (
                  <div className="w-full rounded-2xl bg-neutral-900 justify-center flex py-2">
                    <EllipsisHorizontalIcon className="w-6 mr-2" />
                    Обновляем фото
                  </div>
                ) : (
                  <label
                    htmlFor="upload"
                    className="cursor-pointer w-full flex justify-center bg-neutral-900 rounded-2xl px-3 py-2"
                  >
                    <PhotoIcon className="w-6 mr-2" />
                    Изменить фото
                  </label>
                )}
              </div>
            </div>
            <input
              disabled={loading}
              value={name}
              onChange={changeName}
              className="bg-neutral-700 py-2 px-3 rounded-2xl block w-full"
              placeholder="Имя"
            />
            {loading ? (
              <div className="w-full rounded-2xl bg-neutral-900 justify-center flex py-2">
                <EllipsisHorizontalIcon className="w-6 mr-2" />
                Сохраняем изменения
              </div>
            ) : (
              name.trim() && (
                <button
                  onClick={saveProfile}
                  className="w-full rounded-2xl bg-white text-black justify-center flex py-2"
                >
                  <CheckIcon className="w-6 mr-2" />
                  Сохранить
                </button>
              )
            )}
            <button
              onClick={logout}
              className="w-full flex justify-center bg-neutral-800 rounded-2xl px-3 py-2"
            >
              <PowerIcon className="w-6 mr-2" />
              Выйти
            </button>
          </div>
        )}
      </Content>
    </>
  );
}
