import Link from "next/link";
import formatRelative from "date-fns/formatRelative";
import russianLocale from "date-fns/locale/ru";
import ReactLinkify from "react-linkify";
import {
  LinkIcon,
  ChevronUpDownIcon,
  BookmarkIcon,
  FolderPlusIcon,
  XMarkIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "../utils/toast";
import { useRouter } from "next/router";

export default function Post({
  groupId,
  groupData,
  postData,
  session,
  from,
  archive,
  mutateArchive,
  paginated,
  folders,
}) {
  const [modal, setModal] = useState(false);
  const [_origin, setOrigin] = useState("");
  const [selection, setSelection] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const supabase = useSupabaseClient();
  const [folderName, setFolderName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const changeFolderName = ({ target: { value } }) => setFolderName(value);

  const createFolder = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("folders")
      .insert([{ name: folderName, post_id: selection }])
      .select();
    router.push(`/folder/${data[0].id}?from=/group/${groupId}`);
  };

  const showModal = () => setModal(true);
  const hideModal = () => setModal(false);

  const showCreateFolderDialog = (id) => {
    setSelection(id);
    setCreateFolderDialog(true);
  };
  const hideCreateFolderDialog = () => setCreateFolderDialog(false);

  const addToArchive = async (post) => {
    mutateArchive(
      [...archive, { id: "", post_id: post.id, user_id: session.user.id }],
      false
    );
    await supabase
      .from("archive")
      .insert([{ user_id: session.user.id, post_id: post.id }]);
  };

  const deleteFromArchive = async (post_id) => {
    mutateArchive(
      paginated
        ? archive.map((posts) => posts.filter((p) => p.post_id !== post_id))
        : archive.filter((p) => p.post_id !== post_id),
      false
    );
    await supabase.from("archive").delete().eq("post_id", post_id);
  };

  const hideDeleteDialog = () => setDeleteDialog(false);

  const copyLink = (id) => {
    navigator.clipboard.writeText(`${origin}/post/${id}`);
    toast("Ссылка скопирована");
  };

  useEffect(() => {
    setOrigin(origin);
  }, []);

  return (
    <>
      <div className="bg-neutral-900 rounded-2xl py-1 px-4">
        <div>
          <div className="flex gap-4">
            <Link href={`/group/${groupId}`}>
              <a className="mt-4 shrink-0">
                <Image
                  alt=""
                  width={40}
                  height={40}
                  src={`https://avatars.dicebear.com/api/identicon/${groupId}.svg`}
                  className="rounded-full"
                  objectFit="cover"
                />
              </a>
            </Link>
            <div>
              <Link href={`/group/${groupId}`}>
                <a className="mt-2 inline-block line-clamp-1">
                  {groupData[0].name}
                </a>
              </Link>
              <div className="text-neutral-500">
                {formatRelative(new Date(postData.created_at), new Date(), {
                  locale: russianLocale,
                })}
              </div>
            </div>
          </div>
          <div className="py-2 rounded-2xl pr-6 whitespace-pre-wrap">
            <ReactLinkify
              componentDecorator={(href, text, key) =>
                href.startsWith(_origin) ? (
                  <Link
                    href={`${href}?from=group/${groupId}?from=${
                      from || "/home"
                    }`}
                    key={key}
                  >
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
              {postData.text}
            </ReactLinkify>
          </div>
        </div>
        <div className="flex mb-2 mt-2 items-center">
          <div className="flex mr-auto">
            <button
              title="Создать папку"
              onClick={() => showCreateFolderDialog(postData.id)}
              className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full mr-3"
            >
              <FolderPlusIcon className="w-6" />
            </button>
            {paginated ? (
              archive
                .reduce((r, c) => r.concat(c))
                .map((p) => p.post_id)
                .includes(postData.id) ? (
                <button
                  title="Убрать из сохраненного"
                  onClick={() => deleteFromArchive(postData.id)}
                  className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full mr-3"
                >
                  <BookmarkIconSolid className="w-6 " />
                </button>
              ) : (
                <button
                  title="Сохранить"
                  onClick={() => addToArchive(postData)}
                  className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full mr-3"
                >
                  <BookmarkIcon className="w-6 " />
                </button>
              )
            ) : archive.map((p) => p.post_id).includes(postData.id) ? (
              <button
                title="Убрать из сохраненного"
                onClick={() => deleteFromArchive(postData.id)}
                className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full mr-3"
              >
                <BookmarkIconSolid className="w-6 " />
              </button>
            ) : (
              <button
                title="Сохранить"
                onClick={() => addToArchive(postData)}
                className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full mr-3"
              >
                <BookmarkIcon className="w-6 " />
              </button>
            )}
            <button
              title="Скопировать ссылку"
              onClick={() => copyLink(postData.id)}
              className="p-2 -m-2 sm:hover:bg-neutral-700 rounded-full"
            >
              <LinkIcon className="w-6" />
            </button>
          </div>
        </div>
        {folders.filter((f) => f.post_id === postData.id)[0] ? (
          <button
            className="bg-neutral-800 sm:hover:bg-neutral-700 rounded-2xl py-1 px-4 mt-4 mb-3 w-full flex justify-between"
            onClick={showModal}
          >
            <div className="flex my-2 items-center">
              <div className="bg-neutral-600 rounded-full p-2">
                <FolderIcon className="w-6" />
              </div>
              <div className="ml-4">
                {
                  folders
                    .filter((f) => f.post_id === postData.id)
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )[0].name
                }
              </div>
            </div>
          </button>
        ) : null}
      </div>
      {modal && (
        <Modal onClose={hideModal}>
          <div className="flex justify-between items-center">
            <div className="text-lg ml-3">Папки</div>
            <button
              className="p-2 sm:hover:bg-neutral-700 rounded-full"
              onClick={hideModal}
            >
              <XMarkIcon className="w-6" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[400px] mb-2">
            {folders
              .filter((f) => f.post_id === postData.id)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((f, i) => (
                <Link href={`/folder/${f.id}?from=/${from}`} key={i}>
                  <a className="flex items-center w-full sm:hover:bg-neutral-800 rounded-2xl py-2 px-3">
                    <div className="bg-neutral-700 rounded-full p-2 mr-4">
                      <FolderIcon className="w-6" />
                    </div>
                    {f.name}
                  </a>
                </Link>
              ))}
          </div>
        </Modal>
      )}
      {deleteDialog && (
        <Modal onClose={hideDeleteDialog}>
          <div className="text-lg mb-4">
            Запись нельзя будет восстановить после удаления. Вы уверены?
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={deletePost}
              className="bg-neutral-800 sm:hover:bg-neutral-700 rounded-2xl px-3 py-2 w-full"
            >
              Да
            </button>
            <button
              onClick={hideDeleteDialog}
              className="bg-white sm:hover:bg-neutral-200 text-black rounded-2xl px-3 py-2 w-full"
            >
              Нет
            </button>
          </div>
        </Modal>
      )}
      {createFolderDialog && (
        <Modal onClose={hideCreateFolderDialog}>
          <input
            value={folderName}
            onChange={changeFolderName}
            placeholder="Название папки"
            className="bg-neutral-700 py-2 px-3 rounded-2xl block w-full"
          />
          <div className="flex gap-2 mt-4">
            {loading ? (
              <div className="bg-neutral-800 rounded-2xl px-3 py-2 w-full">
                Создаем
              </div>
            ) : (
              <button
                disabled={!folderName.trim()}
                onClick={createFolder}
                className={`${
                  !folderName.trim()
                    ? "bg-neutral-800"
                    : "bg-white text-black sm:hover:bg-neutral-200"
                } rounded-2xl px-3 py-2 w-full`}
              >
                Создать
              </button>
            )}
            <button
              onClick={hideCreateFolderDialog}
              className="bg-neutral-700 sm:hover:bg-neutral-600 rounded-2xl px-3 py-2 w-full"
            >
              Отмена
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
