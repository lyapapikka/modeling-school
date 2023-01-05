export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[999999] text-center">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-30 cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="flex w-full items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg px-5 py-4 mx-auto bg-neutral-900 rounded-2xl shadow-lg cursor-default">
          {children}
        </div>
      </div>
    </div>
  );
}
