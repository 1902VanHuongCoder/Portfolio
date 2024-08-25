import PropTypes from "prop-types";
import { FaGithubAlt } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Project = (props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const {
    projectName,
    demoLink,
    githubLink,
    completeTime,
    projectImage,
    index,
  } = props;
  return (
    <motion.div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateX(-200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
      className="w-[100%] p-3 block sm:flex gap-x-6 bg-[#19133D] rounded-[6px] hover:scale-110  transition-all"
    >
      <div className="basis-1/2 sm:h-[200px] mb-6 sm:mb-0">
        <img
          className="w-full h-full object-cover rounded-md drop-shadow-2xl"
          src={projectImage}
          alt={`${index}`}
        />
      </div>
      <div className="basis-1/2 flex flex-col justify-between rounded-tr-[6px] rounded-br-[6px] sm:p-2">
        <div>
          <p className="text-[20px] font-[700] text-white leading-6">
            {projectName}
          </p>
          <p className="text-[16px] font-[700] leading-10 text-[#ffffff] opacity-50">
            {completeTime}
          </p>
        </div>
        <div className="flex gap-x-5 sm:gap-x-2">
          <a
            href={githubLink}
            className="py-3 sm:py-2 px-4 sm:px-2 bg-white flex justify-center items-center gap-x-2 rounded-sm hover:scale-110 transition-transform"
          >
            <span>View Github</span>
            <span>
              <FaGithubAlt />
            </span>
          </a>
          <a
            href={demoLink}
            className="py-3 px-4 bg-white flex justify-center items-center gap-x-2 rounded-sm hover:scale-110 transition-transform"
          >
            <span>View Demo</span>
            <span>
              <FaArrowUpRightFromSquare />
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Validate parameter's value
Project.propTypes = {
  projectName: PropTypes.string,
  demoLink: PropTypes.string,
  githubLink: PropTypes.string,
  completeTime: PropTypes.string,
  projectImage: PropTypes.string,
  index: PropTypes.number,
};

export default Project;
