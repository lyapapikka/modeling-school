import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { promises as fs } from "fs";
import path from "path";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Tutor({ tutors }) {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Учебник - Школа моделирования</title>
      </Head>
      <Content>
        <Header home />
        {tutors.map((t, i) => (
          <a className="text-blue-500" href={`/tutors/${t}`} key={i}>
            {t}
          </a>
        ))}
      </Content>
    </>
  );
}

export async function getStaticProps() {
  const tutors = await fs.readdir(path.join(process.cwd(), "public/tutors"));

  return {
    props: { tutors },
  };
}
