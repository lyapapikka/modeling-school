export default function Content({ children }) {
  return <div className="max-w-screen-sm mx-auto">{children}<div className="h-16 sm:hidden"></div></div>;
}
