import Link from "next/link";
import {
  BookOpenIcon,
  HomeIcon,
  XMarkIcon,
  UserGroupIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  FaceSmileIcon as FaceSmileIconSolid,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

export default function Header({
  home,
  homePage,
  groupsPage,
  bookPage,
  archivePage,
  href,
}) {
  const router = useRouter();
  const { from } = router.query;

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
            <Link href="/groups">
              <a className="mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                <UserGroupIcon className="w-6" />
              </a>
            </Link>
            <Link href="/tutor">
              <a className="mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
                <BookOpenIcon className="w-6" />
              </a>
            </Link>
            <Link href="/profile">
              <a className="sm:hover:bg-neutral-700 p-2 rounded-full">
                <FaceSmileIcon className="w-6" />
              </a>
            </Link>
          </div>
        </>
      ) : (
        <Link href={`${href}${from ? "?from=" + from : ""}`}>
          <a className="sm:hover:bg-neutral-700 rounded-full p-2 -mr-2">
            <XMarkIcon className="w-6" />
          </a>
        </Link>
      )}
      {home && (
        <div className="z-[99999] bg-neutral-900 border-t border-neutral-800 sm:hidden flex fixed justify-around bottom-0 left-0 right-0 w-full">
          <Link href="/home">
            <a className="w-full text-xs flex flex-col items-center sm:hover:bg-neutral-70 rounded-full py-1">
              {homePage ? (
                <HomeIconSolid className="w-6" />
              ) : (
                <HomeIcon className="w-6" />
              )}
              Главная
            </a>
          </Link>
          <Link href="/groups">
            <a className="w-full text-xs flex flex-col items-center sm:hover:bg-neutral-700 rounded-full py-1">
              {groupsPage ? (
                <UserGroupIconSolid className="w-6" />
              ) : (
                <UserGroupIcon className="w-6" />
              )}
              Группы
            </a>
          </Link>
          <Link href="/tutor">
            <a className="w-full text-xs flex flex-col items-center sm:hover:bg-neutral-700 rounded-full py-1">
              {bookPage ? (
                <BookOpenIconSolid className="w-6" />
              ) : (
                <BookOpenIcon className="w-6" />
              )}
              Учебник
            </a>
          </Link>
          <Link href="/profile">
            <a className="w-full text-xs flex flex-col items-center sm:hover:bg-neutral-700 rounded-full py-1">
              {archivePage ? (
                <FaceSmileIconSolid className="w-6" />
              ) : (
                <FaceSmileIcon className="w-6" />
              )}
              Профиль
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
