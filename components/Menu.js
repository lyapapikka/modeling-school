import {
  HomeIcon,
  HashtagIcon,
  AcademicCapIcon,
  UserGroupIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import slugify from "slugify";
import siteData from "../siteData";

export default function Menu() {
  return (
    <div className="hidden sm:block w-64 shrink-0 mt-4 pr-6">
      <Link href="/">
        <a className="flex items-center hover:bg-neutral-800 rounded p-2">
          <HomeIcon className="w-6 mr-4" />
          Главная
        </a>
      </Link>
      <Link href="/teachers">
        <a className="flex items-center hover:bg-neutral-800 rounded p-2">
          <AcademicCapIcon className="w-6 mr-4" />
          Учителя
        </a>
      </Link>
      <Link href="/groups">
        <a className="flex items-center hover:bg-neutral-800 rounded p-2">
          <UserGroupIcon className="w-6 mr-4" />
          Группы
        </a>
      </Link>
      <Link href="/library">
        <a className="flex items-center hover:bg-neutral-800 rounded p-2">
          <RectangleStackIcon className="w-6 mr-4" />
          Библиотека
        </a>
      </Link>
      {siteData.content.map(({ theme }, i) => (
        <Link href={`/${slugify(theme).toLowerCase()}`} key={i}>
          <a className="flex items-center hover:bg-neutral-800 rounded p-2">
            <HashtagIcon className="w-6 mr-4" />
            {theme}
          </a>
        </Link>
      ))}
    </div>
  );
}
