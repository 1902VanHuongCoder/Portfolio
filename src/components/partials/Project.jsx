import PropTypes from "prop-types";
import { FaGithubAlt } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
const Project = (props) => {
  const { projectName, demoLink, githubLink, completeTime } = props;
  return (
    <div className="w-[90%] p-3 block sm:flex gap-x-6 bg-[#19133D] rounded-[6px] hover:shadow-md transition-all">
      <div className="basis-1/2 mb-6 sm:mb-0">
        <img
          className="w-full h-full object-contain rounded-md drop-shadow-2xl"
          src="https://www.verywellmind.com/thmb/15xUglFOvLnNWygFwRyRiu6nIts=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/iStock-619961796-edit-59cabaf6845b3400111119b7.jpg"
          alt="project"
        />
      </div>
      <div className="basis-1/2 flex flex-col justify-between rounded-tr-[6px] rounded-br-[6px]">
        <div>
          <p className="text-[20px] font-[700] text-white leading-6">
            {projectName}
          </p>
          <p className="text-[16px] font-[700] leading-10 text-[#ffffff] opacity-50">
            {completeTime}
          </p>
        </div>
        <div className="flex gap-x-5">
          <a
            href={githubLink}
            className="py-3 px-4 bg-white flex justify-center items-center gap-x-2 rounded-sm hover:scale-110 transition-transform"
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
    </div>
  );
};

// Validate parameter's value
Project.propTypes = {
  projectName: PropTypes.string,
  demoLink: PropTypes.string,
  githubLink: PropTypes.string,
  completeTime: PropTypes.string,
};

export default Project;
