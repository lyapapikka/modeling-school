import Link from "next/link";

export default function Card({ title }) {
  return (
    <Link href="/geometria/nahozdenie-ugla">
      <a className="block">
        <div className="text-md font-bold py-8">{title}</div>
      </a>
    </Link>
  );
}
