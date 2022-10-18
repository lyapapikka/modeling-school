import Head from "next/head";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(false);
  const [logined, setLogined] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setDisabled(!email);
  }, [email]);

  useEffect(() => {
    async function func() {
      const { data } = await supabase.auth.getSession();

      setSession(data);
    }

    func();
  }, []);

  function changeEmail({ target: { value } }) {
    setEmail(value);
  }

  async function login(e) {
    e.preventDefault();

    await supabase.auth.signInWithOtp({ email });

    setLogined(true);
  }

  useEffect(() => {
    if (session.session) {
      router.replace("/");
    }
  }, [session]);

  if (!session || session.session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Вход - Школа моделирования</title>
      </Head>
      <form className="flex mx-auto flex-col max-w-sm h-[calc(100vh-100px)] justify-center space-y-4 px-2">
        <Link href="/">
          <a className="flex items-center mx-auto">
            <svg width="30" viewBox="0 0 347 347">
              <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
              <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
            </svg>
            <div className="ml-4 font-bold whitespace-nowrap">
              Школа моделирования
            </div>
          </a>
        </Link>
        {!logined ? (
          <>
            <input
              value={email}
              onChange={changeEmail}
              placeholder="Почта"
              className="w-full rounded-lg py-1 px-2"
            />
            <button
              onClick={login}
              className={`w-full ${
                disabled ? "bg-neutral-500" : "bg-blue-500"
              } rounded-lg py-1`}
              disabled={disabled}
            >
              Войти
            </button>
          </>
        ) : (
          <div className="text-center">
            На почту отправлено письмо с ссылкой для подтверждения
          </div>
        )}
      </form>
    </>
  );
}
