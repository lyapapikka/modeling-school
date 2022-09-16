import Head from "next/head";

export default function Home() {
  return (
    <div className="text-center mt-10 text-xl">
      <Head>
        <title>Mathege</title>
      </Head>
      Привет, скоро здесь будет <span className="text-yellow-500">Mathege</span>
    </div>
  );
}
