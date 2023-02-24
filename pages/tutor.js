import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import path from "path";
import { promises as fs } from "fs";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function Tutor({ filenames }) {
  const { isLoading, session } = useSessionContext();
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [showDocument, setShowDocument] = useState(false);
  const [filename, setFilename] = useState("");
  const [numPages, setNumPages] = useState();
  const [showHandling, setShowHandling] = useState(false);

  const toggleHandling = () => {
    setShowHandling(!showHandling);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const prev = () => {
    setPageNumber(pageNumber - 1);
  };

  const next = () => {
    setPageNumber(pageNumber + 1);
  };

  const openDocument = (f) => {
    setShowDocument(true);
    setFilename(f);
  };

  const closeDocument = () => {
    setShowDocument(false);
    setShowHandling(false);
  };

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
        <Header home bookPage />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-2">
          Учебник
        </div>
        <div className="space-y-2">
          {filenames.map((f, i) => (
            <button
              onClick={() => openDocument(f)}
              className="flex ml-auto bg-neutral-900 sm:hover:bg-neutral-800 px-4 py-2 rounded-2xl w-full items-center"
              key={i}
            >
              <div className="rounded-full p-2 bg-neutral-700">
                <DocumentIcon className="w-6" />
              </div>
              <div className="ml-4">{f}</div>
            </button>
          ))}
        </div>
      </Content>
      {showDocument && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black opacity-80 cursor-pointer"
              onClick={closeDocument}
            ></div>
            <div className="flex items-center relative cursor-default ">
              <iframe
                id="pdf-js-viewer"
                src={`/tutors/${filename}`}
                title="webviewer"
                className="h-screen w-[80vw]"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "public/tutors");
  const filenames = await fs.readdir(postsDirectory);

  return { props: { filenames } };
}
