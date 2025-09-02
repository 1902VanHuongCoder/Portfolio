import { motion } from "framer-motion";

export default function AdminLoading({ text }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
        <span className="text-lg font-semibold text-white">{text}</span>
      </motion.div>
    </div>
  );
}

import PropTypes from "prop-types";

AdminLoading.propTypes = {
  text: PropTypes.string.isRequired,
};
