import Link from "next/link";
import {
  BookOpenIcon,
  HomeIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
} from "@heroicons/react/24/solid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Header({
  home,
  homePage,
  bookPage,
  archivePage,
  href,
}) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const logout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center py-4 px-4 bg-neutral-900">
      <Link href="/home">
        <a>
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
        </a>
      </Link>
      {home ? (
        <>
          <div className="sm:flex hidden ml-auto">
            <Link href="/home">
              <a className="mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                <HomeIcon className="w-6" />
              </a>
            </Link>
            <Link href="/tutor">
              <a className="mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                <BookOpenIcon className="w-6" />
              </a>
            </Link>
            <Link href="/archive">
              <a className="sm:hover:bg-neutral-700 p-2 rounded-full">
                <ArchiveBoxIcon className="w-6" />
              </a>
            </Link>
          </div>
          <button
            onClick={logout}
            className="ml-2 sm:hover:bg-neutral-700 p-2 rounded-full"
          >
            <ArrowLeftOnRectangleIcon className="w-6" />
          </button>
        </>
      ) : (
        <Link href={href}>
          <a className="sm:hover:bg-neutral-700 rounded-full p-2 -mr-2">
            <XMarkIcon className="w-6" />
          </a>
        </Link>
      )}
      {home && (
        <div className="z-[99999] backdrop-blur sm:hidden flex fixed justify-around bottom-0 left-0 right-0 w-full">
          <Link href="/home">
            <a className="w-full flex justify-center sm:hover:bg-neutral-70 rounded-full py-3">
              {homePage ? (
                <HomeIconSolid className="w-6" />
              ) : (
                <HomeIcon className="w-6" />
              )}
            </a>
          </Link>
          <Link href="/tutor">
            <a className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
              {bookPage ? (
                <BookOpenIconSolid className="w-6" />
              ) : (
                <BookOpenIcon className="w-6" />
              )}
            </a>
          </Link>
          <Link href="/archive">
            <a className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
              {archivePage ? (
                <ArchiveBoxIconSolid className="w-6" />
              ) : (
                <ArchiveBoxIcon className="w-6" />
              )}
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
