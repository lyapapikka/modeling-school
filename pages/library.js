import Head from "next/head";
import Menu from "../components/Menu";
import Title from "../components/Title";
import Header from "../components/Header";
import Content from "../components/Content";
import useSWR from "swr";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Library() {
  const { data } = useSWR("/api/auth");
  const { data: user } = useSWR(
    data && data.isAuthorized ? "/api/library" : null
  );
  const router = useRouter();

  function logout() {
    Cookies.remove("access_token");
    Cookies.remove("user_id");
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Библиотека - Школа моделирования</title>
      </Head>
      <Content>
        <Header />
        <div className="flex">
          <Menu />
          <div className="w-full">
            <Title>Библиотека</Title>
            {data &&
              (data.isAuthorized ? (
                user && (
                  <>
                    <div className="flex items-center mt-6">
                      <Image
                        src={user[0].photo_50}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-lg">
                          {user[0].first_name + " " + user[0].last_name}
                        </div>
                        <button onClick={logout} className="text-blue-500">
                          Выйти
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center my-6">
                      <div className="text-lg mr-4 whitespace-nowrap">Код</div>
                      <div>
                        <input
                          className="px-3 py-1 rounded-lg"
                          readOnly
                          value={user[0].id}
                        />
                      </div>
                    </div>
                  </>
                )
              ) : (
                <div className="text-lg mt-8">
                  Войдите в аккаунт, чтобы видеть библиотеку
                </div>
              ))}
          </div>
        </div>
      </Content>
    </>
  );
}
