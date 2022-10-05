import Head from "next/head";
import Header from "../components/Header";
import Content from "../components/Content";
import Menu from "../components/Menu";
import Title from "../components/Title";
import { useEffect, useState } from "react";
import List from "../components/List";
import data from "../data";
import Card from "../components/Card";
import slugify from "slugify";

export default function Groups() {
  const [modal, setModal] = useState(false);
  const [group, setGroup] = useState("");

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
              className="cursor-pointer absolute left-0 right-0 top-0 bottom-0 opacity-50 bg-black"
            ></div>
            <div className="text-lg absolute mx-auto left-0 right-0 bg-neutral-800 rounded px-4 py-3 w-full max-w-lg mt-32">
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
            <div className="text-lg font-bold mt-7">АИС-20-1</div>
            <List>
              {data.content.map(({ title, theme }, i) => (
                <Card
                  title={title}
                  href={`${slugify(theme).toLowerCase()}/${slugify(
                    title
                  ).toLowerCase()}`}
                  key={i}
                />
              ))}
              {data.content.map(({ title, theme }, i) => (
                <Card
                  title={title}
                  href={`${slugify(theme).toLowerCase()}/${slugify(
                    title
                  ).toLowerCase()}`}
                  key={i}
                />
              ))}
            </List>
          </div>
        </div>
      </Content>
    </>
  );
}
