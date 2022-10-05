import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header({ article }) {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(location.pathname);
  }, []);

  return (
    <div className="flex justify-between py-4">
      <Link href="/">
        <a className="flex items-center">
          <svg width="30" viewBox="0 0 347 347">
            <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
            <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
          </svg>
          <div className="hidden sm:block ml-4 font-bold whitespace-nowrap">Школа моделирования</div>
        </a>
      </Link>
      <a
        href={`//oauth.vk.com/authorize?client_id=51441314&display=page&response_type=token&scope=offline&v=5.131&redirect_uri=https://modeling-school.vercel.app/callback&state=${pathname}`}
        className="flex items-center bg-blue-500 rounded px-3 ml-4"
      >
        Войти
      </a>
    </div>
  );
}
