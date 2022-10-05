import Link from "next/link";
import classNames from "classnames";

export default function Card({ title, small, href }) {
  return (
    <Link href={href}>
      <a className="block">
        <div
          className={classNames({
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
