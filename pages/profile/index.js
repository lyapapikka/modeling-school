import Head from "next/head";
import Content from "../../components/Content";
import Header from "../../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Link from "next/link";
import Image from "next/image";
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Post from "../../components/Post";

export default function Profile() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const [_origin, setOrigin] = useState("");

  const { data: user } = useSWR(
    !isLoading && session ? api(`user`, session, { user: true }) : null,
    fetcher
  );

  const { data: archive, mutate: mutateArchive } = useSWR(
    !isLoading && session
      ? api(
          `archive?select=*,posts(text,created_at,id,groups(name,id))`,
          session
        )
      : null,
    fetcher
  );

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    setOrigin(origin);
  }, []);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Профиль - Школа моделирования</title>
      </Head>
      <Content>
        <Header home archivePage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          Профиль
        </div>
        <div className="bg-neutral-900 rounded-2xl relative mb-2">
          <div className="flex justify-center pt-4">
            {user ? (
              user?.user_metadata?.picture ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/profile/${user.user_metadata.picture}`}
                  width={100}
                  height={100}
                  objectFit="cover"
                  className="rounded-full"
                  alt=""
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-neutral-800 rounded-full flex justify-center">
                  <QuestionMarkCircleIcon className="w-14" />
                </div>
              )
            ) : (
              <div className="bg-neutral-800 w-[100px] h-[100px] rounded-full"></div>
            )}
          </div>
          <div className="flex mt-2 pb-4 items-center justify-center">
            <div className="text-lg line-clamp-1 text-center">
              {user ? (
                user?.user_metadata?.name || "Неизвестный пользователь"
              ) : (
                <div className="bg-neutral-800 text-lg w-40 rounded-2xl">
                  &nbsp;
                </div>
              )}
            </div>
          </div>
          <Link href="/profile/settings">
            <a className="absolute top-2 right-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <Cog6ToothIcon className="w-6" />
            </a>
          </Link>
        </div>
        <div className="space-y-2 mb-8">
          {archive ? (
            archive.length === 0 ? (
              <div className="text-center text-neutral-500 mt-8">
                Нет сохраненных записей
              </div>
            ) : (
              archive.map((p) => (
                <Post
                  key={p.id}
                  groupId={p.posts.groups.id}
                  groupData={[p.posts.groups]}
                  postData={p.posts}
                  session={session}
                  archive={archive}
                  from={"profile"}
                  mutateArchive={mutateArchive}
                />
              ))
            )
          ) : (
            <div className="space-y-2 mt-2">
              <div className="bg-neutral-900 h-36 rounded-2xl"></div>
              <div className="bg-neutral-900 h-36 rounded-2xl"></div>
              <div className="bg-neutral-900 h-36 rounded-2xl"></div>
              <div className="bg-neutral-900 h-36 rounded-2xl"></div>
              <div className="bg-neutral-900 h-36 rounded-2xl"></div>
            </div>
          )}
        </div>
      </Content>
    </>
  );
}
