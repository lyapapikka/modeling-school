import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import api from "../utils/api";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function Groups() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  const { data: ownGroups } = useSWR(
    !isLoading && session
      ? api(
          `groups?owner_id=eq.${session.user.id}&select=*&order=created_at.desc`,
          session
        )
      : null,
    fetcher
  );

  const { data: subscriptions } = useSWR(
    !isLoading && session
      ? api(
          `members?user_id=eq.${session.user.id}&select=*,groups(id,name)`,
          session
        )
      : null,
    fetcher
  );

  const { data: groups } = useSWR(
    !isLoading && session && subscriptions
      ? api(
          `groups?id=in.(${subscriptions.map(
            (g) => g.groups.id
          )})&select=*,members(id)`,
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

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Группы - Школа моделирования</title>
      </Head>
      <Content>
        <Header home groupsPage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          Группы
        </div>
        <Link href="/new">
          <a className="w-full bg-neutral-900 rounded-2xl py-5 px-4 flex my-2">
            <PlusIcon className="w-6 ml-2 mr-4" />
            Новая группа
          </a>
        </Link>
        <div className="space-y-2">
          {ownGroups && groups ? (
            <>
              {ownGroups.map((g) => (
                <Link href={`/group/${g.id}`} key={g.id}>
                  <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4 items-center">
                    <div className="mt-2 ml-1 shrink-0">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>{g.name}</div>
                  </a>
                </Link>
              ))}
              {groups.map((g) => (
                <Link href={`/group/${g.id}`} key={g.id}>
                  <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4 items-center">
                    <div className="mt-2 ml-1 shrink-0">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>{g.name}</div>
                  </a>
                </Link>
              ))}
            </>
          ) : (
            <>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
              <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            </>
          )}
        </div>
      </Content>
    </>
  );
}
