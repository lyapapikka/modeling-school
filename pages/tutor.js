import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import tutors from "../tutors";
import {
  ArrowTopRightOnSquareIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Tutor() {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const [_origin, setOrigin] = useState("");
  const [query, setQuery] = useState("");

  const changeQuery = ({ target: { value } }) => setQuery(value);

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
        <title>Учебник - Школа моделирования</title>
      </Head>
      <Content>
        <Header home bookPage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-4">
          Учебник
        </div>
        <div className="relative px-2 mb-4">
          <input
            value={query}
            onChange={changeQuery}
            placeholder="Поиск..."
            className="rounded-2xl bg-neutral-700 py-2 pr-3 w-full pl-11"
          />
          <MagnifyingGlassIcon className="w-6 stroke-neutral-500 absolute left-5 top-1/2 -translate-y-1/2" />
        </div>
        {tutors.map((t, i) => (
          <a
            className="flex ml-auto block bg-neutral-900 px-4 py-2 rounded-2xl w-full"
            href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${_origin}/tutors/${t.filename}`}
            key={i}
          >
            <DocumentIcon className="w-6 mr-4 shrink-0" />
            {t.title}
          </a>
        ))}
      </Content>
    </>
  );
}
