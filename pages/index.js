import Head from "next/head";
import { useAtom } from "jotai";
import tokenAtom from "../utils/token";
import { useEffect, useState } from "react";
import getHashValue from "../utils/hash";
import { useRouter } from "next/router";

export default function Home() {
  const [mount, setMount] = useState(false);
  const [token, setToken] = useAtom(tokenAtom);
  const router = useRouter();

  useEffect(() => {
    setMount(true);

    const access_token = getHashValue("access_token");

    if (!access_token) {
      return;
    }

    setToken(access_token);
    router.replace("/");
  }, [setToken, router]);

  function removeToken() {
    setToken("");
  }

  return (
    <>
      <Head>
        <title>Mathmathmath</title>
      </Head>
      {mount &&
        (token === "" ? (
          <div className="text-center mt-10">
            <a
              href={`https://oauth.vk.com/authorize?client_id=${process.env.NEXT_PUBLIC_VK_ID}&display=page&redirect_uri=${process.env.NEXT_PUBLIC_DOMAIN}&response_type=token&scope=offline&v=5.131`}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Войти через VK
            </a>
          </div>
        ) : (
          <div className="text-center mt-10">
            Вы авторизованы.{" "}
            <button className="text-blue-500" onClick={removeToken}>
              Выйти
            </button>
          </div>
        ))}
    </>
  );
}
