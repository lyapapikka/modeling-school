export default function Menu({ actions, onClose }) {
  return (
    <>
      <div
        className="bg-black fixed top-0 left-0 right-0 bottom-0 z-10 opacity-50"
        onClick={onClose}
      ></div>
      <div className="space-y-2 bg-neutral-800 fixed bottom-4 sm:bottom-auto left-4 right-4 mx-auto max-w-sm mt-60 z-10 rounded-2xl p-2">
        {actions.map((a, i) => (
          <button key={i} className="flex p-2 sm:hover:bg-neutral-700 w-full rounded-2xl" onClick={a.onClick}>
            <div className="mr-2">{a.icon}</div>
            {a.title}
          </button>
        ))}
      </div>
    </>
  );
}
