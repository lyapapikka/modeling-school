import Content from "../components/Content";
import Menu from "../components/Menu";
import Head from "next/head";
import Header from "../components/Header";
import Title from "../components/Title";
import Card from "../components/Card";
import List from "../components/List";
import siteData from "../siteData";
import slugify from "slugify";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Teachers() {
  const [modal, setModal] = useState(false);
  const [teacher, setTeacher] = useState("");
  const [group, setGroup] = useState("");
  const { data } = useSWR("/api/auth");
  const { data: teachers, mutate } = useSWR(
    data && data.isAuthorized ? "/api/teachers" : null
  );
  const [removeModal, setRemoveModal] = useState(false);
  const [removingTeacher, setRemovingTeacher] = useState("");

  function showRemoveModal() {
    setRemoveModal(true);
  }

  function hideRemoveModal() {
    setRemoveModal(false);
  }

  function showModal() {
    setModal(true);
  }

  function hideModal() {
    setModal(false);
  }

  function changeTeacher({ target: { value } }) {
    setTeacher(value);
  }

  function changeGroup({ target: { value } }) {
    setGroup(value);
  }

  function save() {
    setModal(false);
    fetch(`/api/teachers/new?group=${group}&teacher=${teacher}`).then(() => {
      mutate();
    });
  }

  function remove() {
    setRemoveModal(false);
    fetch(`/api/teachers/remove?teacher=${removingTeacher}`).then(() => {
      mutate();
    });
  }

  useEffect(() => {
    document.body.style.overflow = modal || removeModal ? "hidden" : "auto";
  }, [modal, removeModal]);

  return (
    <>
      <Head>
        <title>Учителя - Школа моделирования</title>
      </Head>
      <Content>
        {modal && (
          <>
            <div
              onClick={hideModal}
              className="z-20 cursor-pointer fixed left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
            ></div>
            <div className="bottom-0 rounded-t-lg z-20 sm:bottom-auto sm:rounded-lg text-lg fixed mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
              Код учителя
              <input
                value={teacher}
                onChange={changeTeacher}
                className="block w-full my-4 rounded-lg px-3 py-2"
              />
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
                Сохранить
              </button>
            </div>
          </>
        )}
        {removeModal && (
          <>
            <div
              onClick={hideRemoveModal}
              className="fixed z-10 cursor-pointer left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
            ></div>
            <div className="fixed z-30 bottom-0 rounded-t-lg z-10 sm:bottom-auto sm:rounded-lg text-lg mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
              Вы хотите удалить этого учителя?
              <button
                onClick={remove}
                className="rounded-lg bg-blue-500 py-2 mt-2 mb-1 w-full"
              >
                Удалить
              </button>
              <button
                onClick={hideRemoveModal}
                className="rounded-lg bg-white text-black py-2 mt-2 mb-1 w-full"
              >
                Отмена
              </button>
            </div>
          </>
        )}
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">
            <Title>Учителя</Title>
            {data &&
              (data.isAuthorized ? (
                <>
                  <button
                    onClick={showModal}
                    className="bg-blue-500 rounded-lg px-3 py-1 mt-2"
                  >
                    Добавить учителя
                  </button>
                  {teachers &&
                    (teachers.length > 0 ? (
                      teachers.map((t, i) => (
                        <div key={i}>
                          <div className="flex items-center mt-6 mb-2">
                            <div className="text-lg font-bold">{t.name}</div>
                            <button
                              onClick={() => {
                                setRemovingTeacher(t.id);
                                showRemoveModal();
                              }}
                              className="text-blue-500 ml-auto"
                            >
                              Удалить
                            </button>
                          </div>
                          <List>
                            {t.articles.map((a, j) => (
                              <Card
                                title={
                                  siteData.content.find(
                                    (c) => slugify(c.title).toLowerCase() === a
                                  ).title
                                }
                                href={`${slugify(
                                  siteData.content.find(
                                    (c) => slugify(c.title).toLowerCase() === a
                                  ).theme
                                ).toLowerCase()}/${a}`}
                                key={j}
                              />
                            ))}
                          </List>
                        </div>
                      ))
                    ) : (
                      <div className="text-lg mt-4">
                        Добавьте учителя, чтобы видеть выданные задания
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-lg mt-8">
                  Войдите в аккаунт, чтобы добавить преподавателей
                </div>
              ))}
          </div>
        </div>
      </Content>
    </>
  );
}
