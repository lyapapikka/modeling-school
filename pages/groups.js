import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import Menu from "../components/Menu";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import List from "../components/List";
import siteData from "../siteData";
import Card from "../components/Card";
import slugify from "slugify";
import useSWR from "swr";

export default function Groups() {
  const [modal, setModal] = useState(false);
  const [group, setGroup] = useState("");
  const { data } = useSWR("/api/auth");
  const { data: groups } = useSWR(
    data && data.isAuthorized ? "/api/groups" : null
  );

  function showModal() {
    setModal(true);
  }

  function hideModal() {
    setModal(false);
  }

  function changeGroup({ target: { value } }) {
    setGroup(value);
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
        <title>Группы - Школа моделирования</title>
      </Head>
      <Content>
        {modal && (
          <>
            <div
              onClick={hideModal}
              className="cursor-pointer absolute left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
            ></div>
            <div className="text-lg absolute mx-auto left-0 right-0 bg-neutral-800 rounded-lg px-4 py-3 w-full max-w-lg mt-32">
              Введите название группы
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
            <Title>Группы</Title>
            {data &&
              (data.isAuthorized ? (
                groups &&
                groups.map((g, i) => (
                  <div key={i}>
                    <div className="flex items-center mt-7 mb-2">
                      <div className="text-lg font-bold">{g.name}</div>
                      <button className="text-blue-500 ml-auto">Удалить</button>
                    </div>
                    <List>
                      {g.value.map((slug, j) => (
                        <Card
                          group
                          title={
                            siteData.content.find(
                              (c) => slugify(c.title).toLowerCase() === slug
                            ).title
                          }
                          href={`${slugify(
                            siteData.content.find(
                              (c) => slugify(c.title).toLowerCase() === slug
                            ).theme
                          ).toLowerCase()}/${slugify(slug).toLowerCase()}`}
                          key={j}
                        />
                      ))}
                    </List>
                  </div>
                ))
              ) : (
                <div className="text-lg mt-8">
                  Войдите в аккаунт, чтобы видеть группы
                </div>
              ))}
          </div>
        </div>
      </Content>
    </>
  );
}
