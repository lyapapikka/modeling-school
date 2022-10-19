import Head from "next/head";
import Header from "../../components/Header";
import Content from "../../components/Content";
import Menu from "../../components/Menu";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { supabase } from "../../supabase";
import List from "../../components/List";

export default function Groups() {
  const [groups, setGroups] = useState(false);

  useEffect(() => {
    async function func() {
      const { data } = await supabase.from("groups").select("*");

      setGroups(data);
    }

    func();
  }, []);

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
            {groups &&
              (groups.length === 0 ? (
                <div className="mt-8 sm:ml-4 text-lg">
                  У вас еще нет ни одной группы
                </div>
              ) : (
                <List>
                  {groups.map((g, i) => (
                    <Card
                      key={i}
                      title={g.name}
                      href={`/groups/${g.public_id}`}
                    />
                  ))}
                </List>
              ))}
          </div>
        </div>
      </Content>
    </>
  );
}
