import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bars2Icon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import siteData from "../siteData";
import slugify from "slugify";
import useSWR from "swr";

export default function Header({ article }) {
  const [pathname, setPathname] = useState("");
  const [modal, setModal] = useState(false);
  const [group, setGroup] = useState("");
  const [menu, setMenu] = useState(false);
  const { data } = useSWR("/api/auth");

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
  }

  function changeGroup({ target: { value } }) {
    setGroup(value);
  }

  useEffect(() => {
    setPathname(location.pathname);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "auto";
  }, [modal]);

  return (
    <div className="flex justify-between py-4">
      {menu && (
        <>
          <div
            onClick={hideMenu}
            className="cursor-pointer absolute left-0 right-0 top-0 bottom-0 opacity-50 bg-black"
          ></div>
          <div className="absolute top-0 bottom-0 left-0 right-0 w-5/6 bg-neutral-800 p-4">
            <Link href="/">
              <a className="flex items-center p-2" onClick={hideMenu}>
                <HomeIcon className="w-6 mr-6" />
                Главная
              </a>
            </Link>
            <Link href="/teachers">
              <a className="flex items-center p-2" onClick={hideMenu}>
                <AcademicCapIcon className="w-6 mr-6" />
                Преподаватели
              </a>
            </Link>
            <Link href="/groups">
              <a className="flex items-center p-2" onClick={hideMenu}>
                <UserGroupIcon className="w-6 mr-6" />
                Группы
              </a>
            </Link>
            <div className="border-b border-neutral-500 my-2"></div>
            {siteData.content.map(({ theme }, i) => (
              <Link href={`/${slugify(theme).toLowerCase()}`} key={i}>
                <a className="flex items-center p-2" onClick={hideMenu}>
                  <ArrowRightIcon className="w-6 mr-6" />
                  {theme}
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
      {modal && (
        <>
          <div
            onClick={hideModal}
            className="cursor-pointer absolute left-0 right-0 top-0 bottom-0 opacity-50 bg-black"
          ></div>
          <div className="bottom-0 rounded-t sm:bottom-auto sm:rounded text-lg absolute mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
            Введите название группы
            <input
              value={group}
              onChange={changeGroup}
              className="block w-full mt-4 rounded px-3 py-2"
            />
            <button
              onClick={save}
              className="rounded bg-blue-500 py-2 mt-6 mb-1 w-full"
            >
              Выдать
            </button>
          </div>
        </>
      )}
      <div className="flex">
        <Bars2Icon onClick={showMenu} className="sm:hidden w-6 mr-4" />
        <Link href="/">
          <a className="flex items-center">
            <svg width="30" viewBox="0 0 347 347">
              <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
              <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
            </svg>
            <div className="hidden sm:block ml-4 font-bold whitespace-nowrap">
              Школа моделирования
            </div>
          </a>
        </Link>
      </div>
      {article && data && data.isAuthorized && (
        <button onClick={showModal} className="block bg-blue-500 rounded px-3">
          Выдать группе
        </button>
      )}
      {data && !data.isAuthorized && (
        <a
          href={`//oauth.vk.com/authorize?client_id=51441314&display=page&response_type=token&scope=offline&v=5.131&redirect_uri=https://modeling-school.vercel.app/callback&state=${pathname}`}
          className="flex items-center bg-blue-500 rounded px-3 ml-4"
        >
          Войти
        </a>
      )}
    </div>
  );
}
