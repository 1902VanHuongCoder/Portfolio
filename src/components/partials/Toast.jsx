import { IoClose } from "react-icons/io5";
import useToast from "../../hooks/toast-hook";
import { FaCheck, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { motion } from "framer-motion";
const toastTypeStyles = {
  success: "bg-green-500 text-white border-green-600",
  error: "bg-red-500 text-white border-red-600",
  info: "bg-blue-500 text-white border-blue-600",
  warning: "bg-yellow-500 text-white border-yellow-500",
};

export default function Toast() {
  const { toast, hideToast } = useToast();
  return (
      <motion.div
        initial={{ x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`top-6 right-6 fixed z-[9999] shadow-lg w-[85%] md:w-fit h-fit lg:flex items-center lg:gap-3 bg-white rounded-md overflow-hidden`}
        role="alert"
      >
        <div
          className={`${
            toastTypeStyles[toast.type] || toastTypeStyles.info
          } lg:flex items-center gap-x-2 lg:pl-2 lg:pr-3 hidden py-4`}
        >
          <span>
            {toast.type === "success" ? (
              <FaCheck />
            ) : toast.type === "info" ? (
              <FaInfoCircle />
            ) : toast.type === "warning" ? (
              <FaExclamationTriangle />
            ) : (
              <VscError />
            )}
          </span>
          <span className="font-semibold capitalize">{toast.type}</span>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <span className="ml-2">{toast.content}</span>
          <button
            className="ml-4 text-xl hover:text-black/60 focus:outline-none"
            onClick={hideToast}
            aria-label="Close toast"
          >
            <IoClose />
          </button>
        </div>
      </motion.div>
  );
}
