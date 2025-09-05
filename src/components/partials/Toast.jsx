import { IoClose } from "react-icons/io5";
import useToast from "../../hooks/toast-hook";
import { FaCheck, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { motion } from "framer-motion";
const toastTypeStyles = {
  success: " text-green-600 border-green-600",
  error: " text-red-600 border-red-600",
  info: " text-blue-600 border-blue-600",
  warning: " text-yellow-600 border-yellow-600",
};

export default function Toast() {
  const { toast, hideToast } = useToast();
  return (
      <motion.div
        initial={{ x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`top-6 right-6 fixed z-[9999] shadow-lg w-fit max-w-[85%] h-fit bg-white rounded-md flex overflow-hidden items-center border-[1px] border-[#154D71]`}
        role="alert"
      >
        <div
          className={`${
            toastTypeStyles[toast.type] || toastTypeStyles.info
          } lg:flex justify-center items-center pl-4 text-2xl`}
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
          {/* <span className="font-semibold capitalize">{toast.type}</span> */}
        </div>
        <div className="flex items-center justify-between gap-2 pl-1 pr-4 py-3">
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
