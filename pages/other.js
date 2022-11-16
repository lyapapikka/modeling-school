import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Other() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();

  const logout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/");
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
        <title>Другое - Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        <button
          onClick={logout}
          className="sm:hover:bg-neutral-700 flex ml-auto block bg-neutral-800 text-sm font-medium px-4 py-2 rounded-2xl w-full"
        >
          <ArrowLeftOnRectangleIcon className="w-6 mr-2" /> Выйти
        </button>
      </Content>
    </>
  );
}
