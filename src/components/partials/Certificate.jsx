import PropTypes from "prop-types";
import { motion, useInView } from "framer-motion";
import { useContext, useRef } from "react";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { ShowCertificateContext } from "../../contexts/ShowCertificateContext";

const Certificate = (props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const { certificate, certificateContent, index } = props;
  const {func, setCertificate} = useContext(ShowCertificateContext);
  const handleZoomCertificate = () => {
     func(true);
     setCertificate(certificate);
  }
  return (
    <motion.div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateX(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
      className="w-full p-4 block rounded-2xl shadow-xl bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#c7d2fe] hover:scale-[1.03] transition-all border border-[#e0e7ef]"
    >
      <div onClick={handleZoomCertificate} className="relative basis-1/2 sm:h-[300px] mb-6 sm:mb-0 pt-5">
        <img
          className="w-full h-full object-contain rounded-md drop-shadow-2xl"
          src={certificate}
          alt={`${index}`}
        />
        <motion.div
         whileHover={{
            opacity: 1,
         }}
         className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.5)] flex justify-center items-center opacity-0 cursor-pointer rounded-md">
          <span onClick={handleZoomCertificate} className="text-4xl text-white">
            <MdOutlineZoomOutMap />
          </span>
        </motion.div>
      </div>
      <div className="sm:pt-5 sm:text-center basis-1/2 flex flex-col justify-between rounded-tr-[6px] rounded-br-[6px] sm:p-2">
        <div>
          <p className="text-[20px] font-[700] text-[#154D71] leading-6">
            {certificateContent}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

Certificate.propTypes = {
  certificate: PropTypes.string,
  certificateContent: PropTypes.string,
  index: PropTypes.number,
};
export default Certificate;
