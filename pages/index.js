import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [logined, setLogined] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const { isLoading, session } = useSessionContext();
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
    if (!isLoading && session) {
      router.replace("/home");
    }
  }, [session, router, isLoading]);

  if (isLoading || session) {
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
        <div className="mx-auto">
          <svg
            width="70"
            viewBox="0 0 245 108"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="140.876"
              y1="5.39438"
              x2="191.538"
              y2="103.033"
              stroke="#5E50FF"
              strokeWidth="20"
            />
            <line
              x1="10"
              y1="2"
              x2="10"
              y2="108"
              stroke="#FC6BE5"
              strokeWidth="20"
            />
            <line
              x1="49"
              y1="2"
              x2="49"
              y2="108"
              stroke="#FC6BE5"
              strokeWidth="20"
            />
            <line
              x1="184.876"
              y1="5.39438"
              x2="235.538"
              y2="103.033"
              stroke="#5E50FF"
              strokeWidth="20"
            />
            <line
              x1="88"
              y1="2"
              x2="88"
              y2="108"
              stroke="#FC6BE5"
              strokeWidth="20"
            />
            <circle cx="132" cy="93" r="15" fill="#5E50FF" />
          </svg>
        </div>
        {!logined ? (
          <>
            <input
              value={email}
              onChange={changeEmail}
              placeholder="Почта"
              className="w-full rounded-2xl py-2 px-3 bg-neutral-700"
              type="email"
            />
            {!disabled && (
              <button
                className={`w-full bg-white text-black rounded-2xl py-2`}
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
