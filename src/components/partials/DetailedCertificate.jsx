import { useContext } from "react";
import { ShowCertificateContext } from "../../contexts/ShowCertificateContext";
import { motion } from "framer-motion";
import { IoCloseCircleSharp } from "react-icons/io5";

const DetailedCertificate = () => {
  const { func, certificate } = useContext(ShowCertificateContext);
  const handleZoomOutCertificate = () => {
    func(false);
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,.5)] flex justify-center items-center z-30"
    >
      <div onClick={handleZoomOutCertificate} className="absolute top-4 right-6 text-white text-4xl hover:bg-[rgba(255,255,255,.5)] rounded-full p-1 transition-all">
        <IoCloseCircleSharp />
      </div>
      <div className="w-full sm:w-[70%] h-fit p-2" >
        <img
          className="w-full h-full object-cover rounded-md drop-shadow-2xl"
          src={certificate}
          alt="certificate is zoomed"
        />
      </div>
    </motion.div>
  );
};

export default DetailedCertificate;
