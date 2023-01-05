import Head from "next/head";
import Content from "../../components/Content";
import Header from "../../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import api from "../../utils/api";
import fetcher from "../../utils/fetcher";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Post from "../../components/Post";

export default function PostPage() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR(
    !isLoading && session && router.isReady
      ? api(`posts?id=eq.${id}&select=*,groups(name,id)`, session)
      : null,
    fetcher
  );
  const [_origin, setOrigin] = useState("");

  const { data: archive, mutate: mutateArchive } = useSWR(
    !isLoading && session && data
      ? api(
          `archive?select=*,post_id=${data[0].id},posts(text,created_at,id,groups(name,id))`,
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
      <Content>
        <Header home homePage />
        <div className="flex items-center text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          <Link href="/home">
            <a className="inline-block -my-1 mr-2 -ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <ChevronLeftIcon className="w-6" />
            </a>
          </Link>
          <div className="text-xl font-bold bg-neutral-900 rounded-b-2xl mb-1">
            Запись
          </div>
        </div>
        {data && archive ? (
          <>
            <Head>
              <title>{data[0].groups.name} - Школа моделирования</title>
            </Head>
            <Post
              groupId={data[0].groups.id}
              groupData={[data[0].groups]}
              postData={data[0]}
              session={session}
              from="home"
              archive={archive}
              mutateArchive={mutateArchive}
            />
          </>
        ) : (
          <div className="bg-neutral-900 h-[265px] rounded-2xl"></div>
        )}
      </Content>
    </>
  );
}
