import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [logined, setLogined] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    setDisabled(!email);
  }, [email]);

  function changeEmail({ target: { value } }) {
    setEmail(value);
  }

  async function login(e) {
    e.preventDefault();
    setLogined(true);
    await supabaseClient.auth.signInWithOtp({ email });
  }

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  if (user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Школа моделирования</title>
      </Head>
      <form
        onSubmit={login}
        className="flex mx-auto flex-col max-w-sm justify-center space-y-4 px-3 mt-40"
      >
        <Link href="/">
          <a className="mx-auto">
            <svg width="30" viewBox="0 0 347 347">
              <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
              <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
            </svg>
          </a>
        </Link>
        {!logined ? (
          <>
            <input
              value={email}
              onChange={changeEmail}
              placeholder="Почта"
              className="w-full rounded-2xl py-2 px-3"
              type="email"
            />
            {!disabled && (
              <button
                className={`w-full bg-blue-500 rounded-2xl py-2`}
                type="submit"
              >
                Войти
              </button>
            )}
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
