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

export default function Groups() {
  const [removeArticleModal, setRemoveArticleModal] = useState(false);
  const [removingArticle, setRemovingArticle] = useState("");

  function showRemoveArticleModal() {
    setRemoveArticleModal(true);
  }

  function hideRemoveArticleModal() {
    setRemoveArticleModal(false);
  }

  function removeArticle() {
    setRemoveArticleModal(false);
    fetch(
      `/api/remove-article-from-group?article=${removingArticle.slug}&group=${removingArticle.group}`
    ).then(() => {
      mutate();
    });
  }

  useEffect(() => {
    document.body.style.overflow = removeArticleModal ? "hidden" : "auto";
  }, [removeArticleModal]);

  return (
    <>
      <Head>
        <title>Группы - Школа моделирования</title>
      </Head>
      <Content>
        {removeArticleModal && (
          <>
            <div
              onClick={hideRemoveArticleModal}
              className="fixed z-10 cursor-pointer left-0 right-0 top-0 bottom-0 opacity-70 bg-black"
            ></div>
            <div className="fixed z-30 bottom-0 rounded-t-lg z-10 sm:bottom-auto sm:rounded-lg text-lg mx-auto left-0 right-0 bg-neutral-800 px-4 py-3 w-full max-w-lg mt-32">
              Вы хотите удалить эту группу?
              <button
                onClick={removeArticle}
                className="rounded-lg bg-blue-500 py-2 mt-2 mb-1 w-full"
              >
                Удалить
              </button>
              <button
                onClick={hideRemoveArticleModal}
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
            <Title>Группы</Title>
            {false && groups &&
              groups.map((g, i) => (
                <div key={i}>
                  <div className="text-lg font-bold mt-7 mb-2">{g.name}</div>
                  <List>
                    {g.value.map((slug, j) => (
                      <Card
                        group
                        onRemoveClick={() => {
                          setRemovingArticle({ group: g.name, slug });
                          showRemoveArticleModal();
                        }}
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
              ))}
          </div>
        </div>
      </Content>
    </>
  );
}
