import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Card({ title, href, group, onRemoveClick }) {
  return (
    <div className="relative">
      <Link href={href}>
        <a className="block sm:hover:bg-neutral-900 sm:px-4">
          <div className="py-8 text-lg pr-10">{title}</div>
        </a>
      </Link>
      {group && (
        <button
          onClick={onRemoveClick}
          className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 sm:hover:bg-neutral-900 rounded-lg sm:p-1"
        >
          <XMarkIcon className="w-6" />
        </button>
      )}
    </div>
  );
}
