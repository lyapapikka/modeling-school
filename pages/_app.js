import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    const get = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data: checkNickname } = await supabaseClient
        .from("nickname")
        .select()
        .eq("user_id", user.id);

      console.log(checkNickname);
      await supabaseClient.from("public_users").select().eq("id", user.id);

      if (checkNickname === []) {
        await supabaseClient.from("nickname").upsert({
          user_id: user.id,
          nickname: `user-${nanoid(11)}`,
        });
      } else {
        null;
      }
      null;
    };
    get();
  }, []);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
      <ToastContainer />
    </SessionContextProvider>
  );
}

export default MyApp;
