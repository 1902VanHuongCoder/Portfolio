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
    // index,
  } = props;
  return (
    <motion.div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(60px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
      }}
      className="relative w-full h-fit sm:h-[300px] rounded-md mx-auto bg-white/80 shadow-2xl hover:shadow-blue-200 hover:scale-[1.03] transition-all duration-300 flex flex-col sm:flex-row overflow-hidden border border-[#e0e7ef]"
    >
      {/* Image section */}
      <div className="w-full h-fit sm:h-auto flex items-center justify-center rounded-md overflow-hidden p-2">
        <img
          className="object-cover sm:w-full sm:h-full shadow-lg border-4 border-white/60 rounded-md"
          src={projectImage}
          alt={projectName}
        />
      </div>
      {/* Content section */}
      <div className="sm:w-1/2 w-full flex flex-col justify-between p-6 gap-4">
        <div>
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text mb-1">
            {projectName}
          </h3>
          <p className="text-[#154D71] text-base font-semibold opacity-70 mb-2">
            {completeTime}
          </p>
        </div>
        <div className="flex gap-4 mt-2">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold shadow hover:scale-105 transition-transform"
            >
              <FaGithubAlt />
              <span>Github</span>
            </a>
          )}
          {demoLink && (
            <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#33A1E0] to-[#154D71] text-white font-bold shadow hover:scale-105 transition-transform"
          >
            <FaArrowUpRightFromSquare />
            <span>Demo</span>
          </a> )}
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
