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
  const { data: teachers } = useSWR(
    data && data.isAuthorized ? "/api/teachers" : null
  );

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
    fetch(`/api/teachers/new?group=${group}&teacher=${teacher}`);
  }

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "auto";
  }, [modal]);

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
              className="cursor-pointer absolute left-0 right-0 top-0 bottom-0 opacity-50 bg-black"
            ></div>
            <div className="bottom-0 rounded-t-lg z-10 sm:bottom-auto sm:rounded-lg text-lg absolute mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
              Код учителя
              <input
                value={teacher}
                onChange={changeTeacher}
                className="block w-full my-4 rounded-lg px-3 py-2"
              />
              Ваша группа
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
                    className="bg-blue-500 rounded-lg px-3 py-1 my-7"
                  >
                    Добавить учителя
                  </button>
                  {teachers &&
                    teachers.map((t, i) => (
                      <div key={i}>
                        <div className="flex items-center mt-7 mb-2">
                          <div className="text-lg font-bold">{t.name}</div>
                          <button className="text-blue-500 ml-auto">Удалить</button>
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
