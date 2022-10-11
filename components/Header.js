import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UsersIcon,
  HashtagIcon,
  HomeIcon,
  BookOpenIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import siteData from "../siteData";
import slugify from "slugify";

export default function Header({ article, slug }) {
  const [pathname, setPathname] = useState("");
  const [modal, setModal] = useState(false);
  const [group, setGroup] = useState("");
  const [menu, setMenu] = useState(false);

  function showModal() {
    setModal(true);
  }

  function hideModal() {
    setModal(false);
  }

  function showMenu() {
    setMenu(true);
  }

  function hideMenu() {
    setMenu(false);
  }

  function save() {
    setModal(false);
    fetch(`/api/issue?group=${group}&article=${slug}`);
  }

  function changeGroup({ target: { value } }) {
    setGroup(value);
  }

  useEffect(() => {
    setPathname(location.pathname);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal || menu ? "hidden" : "auto";
  }, [modal, menu]);

  return (
    <div className="flex justify-between py-4">
      {menu && (
        <>
          <div
            onClick={hideMenu}
            className="z-10 fixed top-0 bottom-0 left-0 right-0 opacity-70 bg-black"
          ></div>
          <div className="overflow-auto z-20 fixed h-1/2 bottom-0 left-0 right-0 bg-neutral-800 p-2">
            {siteData.content.map(({ theme }, i) => (
              <Link href={`/${slugify(theme).toLowerCase()}`} key={i}>
                <a className="flex items-center p-2" onClick={hideMenu}>
                  <HashtagIcon className="w-6 mr-4" />
                  {theme}
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
      <div className="sm:hidden z-10 fixed flex w-full justify-between bottom-0 left-0 right-0 bg-neutral-800 p-2">
        <Link href="/">
          <a className="text-xs w-full flex flex-col items-center">
            <HomeIcon className="w-6 mx-auto" />
            Главная
          </a>
        </Link>
        <button
          onClick={showMenu}
          className="text-xs w-full flex flex-col items-center"
        >
          <BookOpenIcon className="w-6 mx-auto" />
          Темы
        </button>
        <Link href="/groups">
          <a className="text-xs w-full flex flex-col items-center">
            <UsersIcon className="w-6 mx-auto" />
            Группы
          </a>
        </Link>
      </div>
      {modal && (
        <>
          <div
            onClick={hideModal}
            className="cursor-pointer fixed left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
          ></div>
          <div className="z-10 bottom-0 rounded-t-lg sm:bottom-auto sm:rounded-lg text-lg fixed mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
            Группа
            <input
              value={group}
              onChange={changeGroup}
              className="block w-full mt-4 rounded-lg px-3 py-2"
            />
            <button
              onClick={save}
              className="rounded-lg bg-blue-500 py-2 mt-6 mb-1 w-full"
            >
              Выдать
            </button>
            <button
              onClick={hideModal}
              className="rounded-lg bg-white text-black py-2 mt-2 mb-1 w-full"
            >
              Отмена
            </button>
          </div>
        </>
      )}
      <div className="flex">
        <Link href="/">
          <a className="flex items-center">
            <svg width="30" viewBox="0 0 347 347">
              <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
              <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
            </svg>
            <div className="ml-4 font-bold whitespace-nowrap">
              Школа моделирования
            </div>
          </a>
        </Link>
      </div>
      {article && (
        <button onClick={showModal}>
          <UserPlusIcon className="w-6" />
        </button>
      )}
    </div>
  );
}
