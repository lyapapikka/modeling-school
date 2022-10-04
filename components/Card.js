import Link from "next/link";
import classNames from "classnames";

export default function Card({ title, small }) {
  return (
    <Link href="/geometria/nahozdenie-ugla">
      <a className="block">
        <div
          className={classNames("font-bold", {
            "py-8 text-lg": !small,
            "py-2": small,
          })}
        >
          {title}
        </div>
      </a>
    </Link>
  );
}
