import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import tutors from "../tutors";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function Tutor() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

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
        <title>Учебник - Школа моделирования</title>
      </Head>
      <Content>
        <Header home bookPage />
        <div className="text-xl ml-4 mb-4 font-bold">Учебник</div>
        {tutors.map((t, i) => (
          <a
            target="_blanc"
            className="sm:hover:bg-neutral-700 flex ml-auto block bg-neutral-800 text-sm font-medium px-4 py-2 rounded-2xl w-full"
            href={`/tutors/${t.filename}`}
            key={i}
          >
            <ArrowTopRightOnSquareIcon className="w-6 mr-2" />
            {t.title}
          </a>
        ))}
      </Content>
    </>
  );
}
