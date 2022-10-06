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
    <div className="hidden sm:block w-64 shrink-0 space-y-4 mt-4 pr-6">
      <Link href="/">
        <a className="flex items-center">
          <HomeIcon className="w-6 mr-4" />
          Главная
        </a>
      </Link>
      <Link href="/teachers">
        <a className="flex items-center">
          <AcademicCapIcon className="w-6 mr-4" />
          Учителя
        </a>
      </Link>
      <Link href="/groups">
        <a className="flex items-center">
          <UserGroupIcon className="w-6 mr-4" />
          Группы
        </a>
      </Link>
      <Link href="/library">
        <a className="flex items-center">
          <RectangleStackIcon className="w-6 mr-4" />
          Библиотека
        </a>
      </Link>
      <div className="border-b border-neutral-500"></div>
      {siteData.content.map(({ theme }, i) => (
        <Link href={`/${slugify(theme).toLowerCase()}`} key={i}>
          <a className="flex items-center">
            <HashtagIcon className="w-6 mr-4" />
            {theme}
          </a>
        </Link>
      ))}
    </div>
  );
}
