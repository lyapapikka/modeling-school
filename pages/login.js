import Head from "next/head";
import { useState } from "react";
import { supabase } from "../supabase";

export default function Login() {
  const [email, setEmail] = useState("");

  function changeEmail({ target: { value } }) {
    setEmail(value);
  }

  async function login() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });

    console.log({ data, error });
  }

  return (
    <>
      <Head>
        <title>Вход - Школа моделирования</title>
      </Head>
      <div className="flex mx-auto flex-col max-w-sm h-[calc(100vh-100px)] justify-center space-y-2 px-2">
        <input
          value={email}
          onChange={changeEmail}
          placeholder="Почта"
          className="w-full rounded-lg py-1 px-2"
        />
        <button onClick={login} className="w-full bg-blue-500 rounded-lg py-1">
          Войти
        </button>
      </div>
    </>
  );
}
