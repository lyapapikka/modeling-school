import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UsersIcon,
  HashtagIcon,
  HomeIcon,
  BookOpenIcon,
  PlusIcon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import siteData from "../siteData";
import slugify from "slugify";
import { useRouter } from "next/router";
import { supabase } from "../supabase";
import { useAtom } from "jotai";
import sessionAtom from "../sessionAtom";

export default function Header({ article }) {
  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(session === false);

  useEffect(() => {
    async function func() {
      if (session) {
        return;
      }

      const { data } = await supabase.auth.getSession();

      setSession(data);
      setLoading(false);
    }

    func();
  }, [session, setSession]);

  const [modal, setModal] = useState(false);
  const [group, setGroup] = useState("");
  const [menu, setMenu] = useState(false);
  const [newGroup, setNewGroup] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const router = useRouter();

  function showModal() {
    setModal(true);
  }

  function showUserModal() {
    setUserModal(true);
  }

  function hideModal() {
    setModal(false);
    setNewGroup(false);
    setGroup("");
  }

  function hideUserModal() {
    setUserModal(false);
  }

  function showMenu() {
    setMenu(true);
  }

  function hideMenu() {
    setMenu(false);
  }

  function create() {
    setGroups([...groups, { name: group, articles: [router.query.article] }]);

    setModal(false);
    setNewGroup(false);
    setGroup("");
  }

  function changeGroup({ target: { value } }) {
    setGroup(value);
  }

  function addNewGroup() {
    setNewGroup(true);
  }

  function addToGroup(group) {
    if (
      !groups
        .find((g) => g.name === group)
        .articles.includes(router.query.article)
    ) {
      setGroups(
        groups.map((g) =>
          g.name === group
            ? { name: g.name, articles: [...g.articles, router.query.article] }
            : g
        )
      );
    }

    setModal(false);
    setNewGroup(false);
    setGroup("");
  }

  async function logout() {
    await supabase.auth.signOut();
    location.href = "/";
  }

  return (
    <>
      {modal && (
        <>
          <div
            onClick={hideModal}
            className="cursor-pointer fixed left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
          ></div>
          <div className="p-4 z-20 bottom-0 rounded-t-lg sm:bottom-auto sm:rounded-lg text-lg fixed mx-auto left-0 right-0 bg-neutral-900 w-full w-full sm:max-w-xs mt-32">
            <div className="flex items-center justify-between ml-3">
              Выберите группу
              <button
                className="md:hover:bg-neutral-800 p-2 rounded-lg"
                onClick={hideModal}
              >
                <XMarkIcon className="w-6" />
              </button>
            </div>
            {groups.map((g, i) => (
              <button
                key={i}
                className="md:hover:bg-neutral-800 w-full text-left px-3 py-2 rounded-lg mt-2"
                onClick={() => addToGroup(g.name)}
              >
                {g.name}
              </button>
            ))}
            {!newGroup && (
              <button
                onClick={addNewGroup}
                className="flex items-center w-full mt-4 md:hover:bg-neutral-800 p-2 rounded-lg"
              >
                <PlusIcon className="w-6 mr-2" /> Новая группа
              </button>
            )}
            {newGroup && (
              <>
                <div className="mx-3">
                  <div className="mt-4">Название</div>
                  <input
                    value={group}
                    onChange={changeGroup}
                    className="rounded-lg mt-2 px-3 py-2 w-full"
                  />
                </div>
                <button
                  disabled={!group}
                  onClick={create}
                  className="ml-auto block mt-4 px-3 py-2 md:hover:bg-neutral-800 rounded-lg"
                >
                  Создать
                </button>
              </>
            )}
          </div>
        </>
      )}
      {userModal && (
        <>
          <div
            onClick={hideUserModal}
            className="cursor-pointer z-20 fixed left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
          ></div>
          <div className="p-4 z-20 bottom-0 rounded-t-lg sm:bottom-auto sm:rounded-lg text-lg fixed mx-auto left-0 right-0 bg-neutral-900 w-full w-full sm:max-w-xs mt-32">
            <div className="flex items-center justify-between ml-3">
              Профиль
              <button
                className="md:hover:bg-neutral-800 p-2 rounded-lg"
                onClick={hideUserModal}
              >
                <XMarkIcon className="w-6" />
              </button>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full mt-4 md:hover:bg-neutral-800 p-2 rounded-lg"
            >
              <ArrowLeftOnRectangleIcon className="w-6 mr-2" /> Выйти
            </button>
          </div>
        </>
      )}
      {menu && (
        <>
          <div
            onClick={hideMenu}
            className="z-10 fixed top-0 bottom-0 left-0 right-0 opacity-70 bg-black"
          ></div>
          <div className="rounded-t-lg pt-4 overflow-auto z-20 fixed h-1/2 bottom-0 left-0 right-0 bg-neutral-900 p-2">
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
      <div className="flex justify-between items-center">
        <div className="sm:hidden z-10 fixed flex w-full justify-between bottom-0 left-0 right-0 bg-neutral-900 p-2">
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
        <Link href="/">
          <a className="flex items-center my-3 sm:ml-2">
            <svg width="30" viewBox="0 0 347 347">
              <path d="M0 0L347 347H0V0Z" fill="#CB6BBC" />
              <path d="M347 0L0 347H347V0Z" fill="#5D69D6" />
            </svg>
            <div className="hidden sm:block ml-4 font-bold whitespace-nowrap">
              Школа моделирования
            </div>
          </a>
        </Link>
        {!loading && !session.session ? (
          <Link href="/login">
            <a className="bg-blue-500 px-2 py-1 rounded-lg ml-2">Войти</a>
          </Link>
        ) : (
          <div className="ml-auto">
            {article && (
              <button
                className="sm:hover:bg-neutral-800 rounded-lg sm:p-2 box-border mr-4 sm:mr-0"
                onClick={showModal}
              >
                <PlusIcon className="w-6" />
              </button>
            )}
            <button
              onClick={showUserModal}
              className="sm:hover:bg-neutral-800 rounded-lg sm:p-2 box-border -mr-2"
            >
              <UserCircleIcon className="w-6" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
