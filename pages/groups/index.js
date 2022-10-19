import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import Menu from "../../components/Menu";
import { useEffect, useState } from "react";
import List from "../../components/List";
import siteData from "../../siteData";
import Card from "../../components/Card";
import slugify from "slugify";
import { useAtom } from "jotai";
import groupsAtom from "../../groupsAtom";
import { ShareIcon } from "@heroicons/react/24/outline";

export default function Groups() {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  function removeArticle(group, slug) {
    if (groups.find((g) => g.name === group).articles.length === 1) {
      setGroups(groups.filter((g) => g.name !== group));
      return;
    }

    setGroups(
      groups.map((g) =>
        g.name === group
          ? { name: g.name, articles: g.articles.filter((a) => a !== slug) }
          : g
      )
    );
  }

  return (
    <>
      <Head>
        <title>Группы - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">
            {mount &&
              (groups.length === 0 ? (
                <div className="mt-8 sm:ml-4 text-lg">
                  У вас еще нет ни одной группы
                </div>
              ) : (
                groups.map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mt-7 mb-2">
                      <div className="sm:ml-4 text-lg font-bold">{g.name}</div>
                      <button
                        onClick={() =>
                          navigator.share({
                            url: `https://modeling-school.vercel.app/new-group?data=${JSON.stringify(
                              g
                            )}`,
                          })
                        }
                        className="p-2 sm:mr-2 sm:hover:bg-neutral-800 rounded-xl"
                      >
                        <ShareIcon className="w-6" />
                      </button>
                    </div>
                    <List>
                      {g.articles.map((slug, j) => (
                        <Card
                          group
                          onRemoveClick={() => {
                            removeArticle(g.name, slug);
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
                ))
              ))}
          </div>
        </div>
      </Content>
    </>
  );
}
