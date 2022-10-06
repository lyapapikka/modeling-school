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
  const { data } = useSWR("/api/auth");

  function showModal() {
    setModal(true);
  }

  function hideModal() {
    setModal(false);
  }

  function changeTeacher({ target: { value } }) {
    setTeacher(value);
  }

  function save() {
    setModal(false);
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
            <div className="bottom-0 rounded-lg-t-lg sm:bottom-auto sm:rounded-lg text-lg absolute mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
              Введите код учителя
              <input
                value={teacher}
                onChange={changeTeacher}
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
                    Добавить преподавателя
                  </button>
                  <div className="text-lg font-bold">
                    Мельников Юрий Борисович
                  </div>
                  <List>
                    {siteData.content.map(({ title, theme }, i) => (
                      <Card
                        title={title}
                        href={`${slugify(theme).toLowerCase()}/${slugify(
                          title
                        ).toLowerCase()}`}
                        key={i}
                      />
                    ))}
                    {siteData.content.map(({ title, theme }, i) => (
                      <Card
                        title={title}
                        href={`${slugify(theme).toLowerCase()}/${slugify(
                          title
                        ).toLowerCase()}`}
                        key={i}
                      />
                    ))}
                  </List>
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
