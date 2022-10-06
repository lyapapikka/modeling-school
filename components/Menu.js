import {
  HomeIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import slugify from "slugify";
import siteData from "../siteData";

export default function Menu() {
  return (
    <div className="hidden sm:block w-64 shrink-0 space-y-4 mt-4 pr-6">
      <Link href="/">
        <a className="flex items-center">
          <HomeIcon className="w-6 mr-6" />
          Главная
        </a>
      </Link>
      <Link href="/teachers">
        <a className="flex items-center">
          <AcademicCapIcon className="w-6 mr-6" />
          Учители
        </a>
      </Link>
      <Link href="/groups">
        <a className="flex items-center">
          <UserGroupIcon className="w-6 mr-6" />
          Группы
        </a>
      </Link>
      <div className="border-b border-neutral-500"></div>
      {siteData.content.map(({ theme }, i) => (
        <Link href={`/${slugify(theme).toLowerCase()}`} key={i}>
          <a className="flex items-center">
            <ArrowRightIcon className="w-6 mr-6" />
            {theme}
          </a>
        </Link>
      ))}
    </div>
  );
}
