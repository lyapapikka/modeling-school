import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // https://stackoverflow.com/questions/11920697/how-to-get-hash-value-in-a-url-in-js
    const access_token = location.hash.match(
      new RegExp("access_token=([^&]*)")
    )[1];
    const user_id = location.hash.match(new RegExp("user_id=([^&]*)"))[1];
    const state = location.hash.match(new RegExp("state=([^&]*)"))[1];

    Cookies.set("user_id", user_id, { expires: 365 });
    Cookies.set("access_token", access_token, { expires: 365 });

    router.replace(state);
  }, [router]);

  return null;
}
