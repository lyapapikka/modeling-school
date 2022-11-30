import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import api from "../utils/api";

export default function Home() {
  const router = useRouter();
  const { isLoading, session } = useSessionContext();

  const { data } = useSWR(
    !isLoading && session
      ? api(
          `groups?owner_id=eq.${session.user.id}&select=*,members(id)&order=created_at.desc`,
          session
        )
      : null,
    fetcher
  );

  const { data: recommended } = useSWR(
    !isLoading && session
      ? api(
          `groups?public=eq.true&select=*,members(id)&order=created_at.desc`,
          session
        )
      : null,
    fetcher
  );
  const { data: joinedGroups } = useSWR(
    !isLoading && session
      ? api(
          `members?user_id=eq.${session.user.id}&select=*,groups(id,name)`,
          session
        )
      : null,
    fetcher
  );

  const { data: groupJoins } = useSWR(
    !isLoading && session && joinedGroups
      ? api(
          `groups?id=in.(${joinedGroups.map(
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
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl">Ваши группы</div>
        {data && groupJoins && recommended ? (
          <>
            <Link href="/new">
              <a className="w-full bg-neutral-900 rounded-2xl py-5 px-4 flex my-2">
                <PlusIcon className="w-6 ml-2 mr-4" />
                Новая группа
              </a>
            </Link>
            <div className="space-y-2">
              {data.map((g) => (
                <Link href={`/group/${g.id}`} key={g.id}>
                  <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4">
                    <div className="mt-2 ml-1 shrink-0">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>
                      {g.name}
                      <div className="text-neutral-500">
                        Участников: {g.members.length}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
              {groupJoins.map((g) => (
                <Link href={`/group/${g.id}`} key={g.id}>
                  <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4">
                    <div className="mt-2 ml-1 shrink-0">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>
                      {g.name}
                      <div className="text-neutral-500">
                        Участников: {g.members.length}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            <div className="text-xl ml-4 my-4 font-bold">Рекомендации</div>
            <div className="space-y-2 mb-2">
              {recommended.map((g) => (
                <Link href={`/group/${g.id}`} key={g.id}>
                  <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4">
                    <div className="mt-2 ml-1 shrink-0">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${g.id}.svg`}
                      />
                    </div>
                    <div>
                      {g.name}
                      <div className="text-neutral-500">
                        Участников: {g.members.length}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-2 mt-2">
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
            <div className="bg-neutral-900 h-16 rounded-2xl"></div>
          </div>
        )}
        {/* <div className="space-y-4">
          <Link href="/group/random">
            <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4">
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
            <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4">
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
            <a className="bg-neutral-900 rounded-2xl py-3 px-4 flex gap-4">
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
