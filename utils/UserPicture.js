import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import getInitials from "../utils/getInitials";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { green, pink, black, grey } from "@mui/material/colors";
import Image from "next/image";

export default function UserPicture({ size, fz }) {
  const supabaseClient = useSupabaseClient();
  const [initials, setInitials] = useState("");
  const user = useUser();
  const { error } = supabaseClient.from("countries").delete().eq("id", 1);

  useEffect(() => {
    const setNameInitials = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setInitials(getInitials(user.user_metadata.name));
    };
    setNameInitials();
  }, []);

  return (
    <div>
      {user ? (
        user.user_metadata.picture ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/profile${user.user_metadata.picture}`}
            width={100}
            height={100}
            objectFit="cover"
            className="rounded-full"
            alt=""
          />
        ) : (
          <Avatar
            sx={{
              width: size,
              height: size,
              fontSize: fz,
              bgcolor: grey[700],
            }}
          >
            {initials}
          </Avatar>
        )
      ) : (
        <div className="bg-neutral-800 w-[100px] h-[100px] rounded-full"></div>
      )}
    </div>
  );
}
