import Link from "next/link";
import {
  BookOpenIcon,
  PlusIcon,
  HomeIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
} from "@heroicons/react/24/solid";

export default function Header({ home }) {
  return (
    <div className="flex justify-between items-center my-2">
      <Link href="/home">
        <a>
          <svg width="30" viewBox="0 0 347 347">
            <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
            <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
          </svg>
        </a>
      </Link>
      {home ? (
        <>
          <Link href="/new">
            <a className="flex ml-auto -mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <PlusIcon className="w-6" />
            </a>
          </Link>
          <div className="sm:flex hidden">
            <Link href="/tutor">
              <a className="flex ml-4 mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                <BookOpenIcon className="w-6" />
              </a>
            </Link>
            <Link href="/other">
              <a className="-mr-2 sm:hover:bg-neutral-700 rounded-full p-2">
                <Bars3Icon className="w-6" />
              </a>
            </Link>
          </div>
        </>
      ) : (
        <Link href="/home">
          <a className="sm:hover:bg-neutral-700 rounded-full p-2 -mr-2">
            <XMarkIcon className="w-6" />
          </a>
        </Link>
      )}
      {home && (
        <div className="sm:hidden flex fixed justify-around bottom-0 left-0 right-0 w-full border-t border-neutral-700">
          <Link href="/home">
            <a className="w-full flex justify-center sm:hover:bg-neutral-70 rounded-full py-3">
              {location.pathname === "/home" ? (
                <HomeIconSolid className="w-6" />
              ) : (
                <HomeIcon className="w-6" />
              )}
            </a>
          </Link>
          <Link href="/tutor">
            <a className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
              {location.pathname === "/tutor" ? (
                <BookOpenIconSolid className="w-6" />
              ) : (
                <BookOpenIcon className="w-6" />
              )}
            </a>
          </Link>
          <Link href="/other">
            <a className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
              <Bars3Icon className="w-6" />
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
