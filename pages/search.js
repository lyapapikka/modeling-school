import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useInterval from "../utils/useInterval";

export default function Search() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const [text, setText] = useState("");
  const router = useRouter();
  const [result, setResult] = useState(null);

  const changeText = ({ target: { value } }) => setText(value);

  useInterval(() => {
    const func = async () => {
      const { data } = await supabaseClient
        .from("posts")
        .select()
        .textSearch("text", `'${text}'`);
      setResult(data);
    };
    func();
  }, 500);

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
        <title>Поиск - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 left-4 w-6" />
          <input
            className="bg-neutral-800 w-full rounded-2xl pl-14 pr-4 py-3"
            placeholder="Поиск..."
            value={text}
            onChange={changeText}
          />
        </div>
        <div className="space-y-4 mt-4">
          {result &&
            result.map((r) => (
              <div
                key={r.id}
                className="bg-neutral-800 rounded-2xl py-1 px-4 relative"
              >
                <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                  {r.text}
                </div>
              </div>
            ))}
        </div>
      </Content>
    </>
  );
}
