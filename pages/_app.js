import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import randomNames from "../utils/randomNames";
import { Avatar, Grid } from "@nextui-org/react";

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

      const { data: checkNameAndPicture } = await supabaseClient
        .from("public_users")
        .select()
        .eq("id", user.id);

      if (checkNickname.length === 0) {
        await supabaseClient.from("nickname").upsert({
          default_nickname: `user-${nanoid(11)}`,
          user_id: user.id,
        });
      }

      if (!checkNameAndPicture[0] && !checkNickname[0].default_nickname)
        await supabaseClient.auth.updateUser({
          data: {
            name: randomNames(),
            picture: "ui-avatars.com/api/?name=John+Doe",
          },
        });
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
