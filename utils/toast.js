import { toast as reactToastify } from "react-toastify";

export default function toast(text) {
  reactToastify.success(text, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    closeButton: false,
  });
}
