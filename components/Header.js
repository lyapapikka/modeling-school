import Link from "next/link";
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  PlusIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <div className="flex justify-between items-center my-2">
      <Link href="/">
        <a>
          <svg width="30" viewBox="0 0 347 347">
            <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
            <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
          </svg>
        </a>
      </Link>
      <button className="flex ml-auto sm:hover:bg-neutral-700 p-2 rounded-full">
        <MagnifyingGlassIcon className="w-6" />
      </button>
      <div className="sm:flex hidden">
        <button className="flex mx-2 sm:hover:bg-neutral-700 p-2 rounded-full">
          <PlusIcon className="w-6" />
        </button>
        <button className="flex mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
          <BookmarkIcon className="w-6" />
        </button>
        <button className="flex mr-2 sm:hover:bg-neutral-700 p-2 rounded-full">
          <BookOpenIcon className="w-6" />
        </button>
        <button className="sm:hover:bg-neutral-700 rounded-full p-2">
          <Cog6ToothIcon className="w-6" />
        </button>
      </div>
      <div className="sm:hidden flex fixed justify-around bottom-0 left-0 right-0 w-full bg-neutral-800">
        <button className="w-full flex justify-center sm:hover:bg-neutral-70 rounded-full py-3">
          <HomeIcon className="w-6" />
        </button>
        <button className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
          <BookmarkIcon className="w-6" />
        </button>
        <button className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
          <PlusIcon className="w-6" />
        </button>
        <button className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
          <BookOpenIcon className="w-6" />
        </button>
        <button className="w-full flex justify-center sm:hover:bg-neutral-700 rounded-full py-3">
          <Cog6ToothIcon className="w-6" />
        </button>
      </div>
    </div>
  );
}
