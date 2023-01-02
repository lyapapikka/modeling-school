import Head from 'next/head'
import Content from '../../components/Content'
import Header from '../../components/Header'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import api from '../../utils/api'
import fetcher from '../../utils/fetcher'
import Link from 'next/link'
import { formatRelative } from 'date-fns'
import russianLocale from 'date-fns/locale/ru'
import Image from 'next/image'
import { toast } from 'react-toastify'
import ReactLinkify from 'react-linkify'
import {
  ArchiveBoxArrowDownIcon,
  LinkIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'

export default function Post() {
  const { isLoading, session, supabaseClient } = useSessionContext()
  const router = useRouter()
  const { id } = router.query
  const { data } = useSWR(
    !isLoading && session
      ? api(`posts?id=eq.${id}&select=*,groups(name,id)`, session)
      : null,
    fetcher,
  )
  const [_origin, setOrigin] = useState('')

  const addToArchive = async (post_id) => {
    const { data } = await supabaseClient
      .from('archive')
      .select()
      .eq('user_id', session.user.id)
      .eq('post_id', post_id)

    if (data.length === 0) {
      await supabaseClient
        .from('archive')
        .insert([{ user_id: session.user.id, post_id }])
    }

    toast.success('Запись сохранена в архиве', {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
      closeButton: false,
      className: 'bottom-14 sm:bottom-auto m-2',
    })
  }

  const sharePost = (id) => {
    navigator.share({ url: `${origin}/post/${id}` })
  }

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/')
    }
  }, [isLoading, session, router])

  useEffect(() => {
    setOrigin(origin)
  }, [])

  if (isLoading || !session) {
    return null
  }

  return (
    <>
      <Content>
        <Header home homePage />
        <div className="flex items-center text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          <Link href="/home">
            <a className="inline-block -my-1 mr-2 -ml-2 sm:hover:bg-neutral-700 p-2 rounded-full">
              <ChevronLeftIcon className="w-6" />
            </a>
          </Link>
        </div>
        {!data ? (
          <div className="bg-neutral-900 h-36 rounded-2xl"></div>
        ) : (
          <>
            <Head>
              <title>{data[0].groups.name} - Школа моделирования</title>
            </Head>
            <div
              className="bg-neutral-900 rounded-2xl py-1 px-4"
              key={data[0].id}
            >
              <div>
                <div className="flex gap-4">
                  <Link href={`/group/${data[0].groups.id}?from=post/${id}`}>
                    <a className="mt-4 ml-2">
                      <Image
                        alt=""
                        width={30}
                        height={30}
                        src={`https://avatars.dicebear.com/api/identicon/${data[0].groups.id}.svg`}
                      />
                    </a>
                  </Link>
                  <div>
                    <Link href={`/group/${data[0].groups.id}?from=post/${id}`}>
                      <a className="mt-2 inline-block">{data[0].groups.name}</a>
                    </Link>
                    <div className="text-neutral-500">
                      {formatRelative(
                        new Date(data[0].created_at),
                        new Date(),
                        {
                          locale: russianLocale,
                        },
                      )}
                    </div>
                  </div>
                </div>
                <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
                  <ReactLinkify
                    componentDecorator={(href, text, key) =>
                      href.startsWith(_origin) ? (
                        <Link href={`${href}?from=post/${id}`} key={key}>
                          <a className="text-blue-500">{text}</a>
                        </Link>
                      ) : (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={href}
                          key={key}
                          className="text-blue-500"
                        >
                          {text}
                        </a>
                      )
                    }
                  >
                    {data[0].text}
                  </ReactLinkify>
                </div>
              </div>
              <div className="flex justify-between mb-2 mt-2">
                <button
                  title="Добавить в архив"
                  onClick={() => addToArchive(data[0].id)}
                  className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
                >
                  <ArchiveBoxArrowDownIcon className="w-6" />
                </button>
                <button
                  title="Поделиться записью"
                  onClick={() => sharePost(data[0].id)}
                  className="p-2 -m-2 ml-2 sm:hover:bg-neutral-700 rounded-full"
                >
                  <LinkIcon className="w-6" />
                </button>
              </div>
            </div>
          </>
        )}
      </Content>
    </>
  )
}
