import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header({ article }) {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(location.pathname);
  }, []);

  return (
    <>
      <div className="flex justify-between py-4">
        <Link href="/">
          <a className="flex items-center">
            <svg width="30" viewBox="0 0 347 347">
              <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
              <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
            </svg>
            <div className="ml-4 text-md font-bold">Школа моделирования</div>
          </a>
        </Link>
        <div className="flex">
          <button>
            <MagnifyingGlassIcon className="w-6" />
          </button>
          <a
            href={`//oauth.vk.com/authorize?client_id=51441314&display=page&response_type=token&scope=offline&v=5.131&redirect_uri=https://modeling-school.vercel.app/callback&state=${pathname}`}
            className="flex items-center bg-blue-500 rounded px-3 ml-4"
          >
            Войти
          </a>
        </div>
      </div>
      {!article && (
        <div className="flex space-x-2 overflow-auto">
          <Link href="/">
            <a className="whitespace-nowrap text-black bg-white rounded-full py-1 px-3">
              Моё
            </a>
          </Link>
          <Link href="/from-teacher">
            <a className="whitespace-nowrap bg-neutral-800 rounded-full py-1 px-3">
              От преподавателя
            </a>
          </Link>
          <Link href="/all">
            <a className="whitespace-nowrap bg-neutral-800 rounded-full py-1 px-3">
              Все темы
            </a>
          </Link>
          <Link href="/algebra">
            <a className="whitespace-nowrap bg-neutral-800 rounded-full py-1 px-3">
              Алгебра
            </a>
          </Link>
          <Link href="/geometria">
            <a className="whitespace-nowrap bg-neutral-800 rounded-full py-1 px-3">
              Геометрия
            </a>
          </Link>
          <Link href="/nachala-analiza">
            <a className="whitespace-nowrap bg-neutral-800 rounded-full py-1 px-3">
              Начала анализа
            </a>
          </Link>
          <Link href="/more">
            <a className="text-blue-500 py-1 px-3">ЕЩЁ</a>
          </Link>
        </div>
      )}
    </>
  );
}
