import PropTypes from "prop-types";
import { motion } from "framer-motion";
const SkillCard = (props) => {
  const { tech, logoTechLink } = props;
  return (
    <motion.div
      className="bg-[#1E3A8A] w-[100%] rounded-[6px] flex flex-col items-center justify-between gap-y-2 py-4 drop-shadow-2xl"
    >
      <div className="w-[50px] h-[50px] overflow-hidden rounded-full border-[3px] border-solid border-white shadow-inner">
        <img className="w-full h-full object-cover" src={logoTechLink} />
      </div>
      <div className="text-white">{tech}</div>
    </motion.div>
  );
};

// Validate parameter's value
SkillCard.propTypes = {
  tech: PropTypes.string,
  logoTechLink: PropTypes.string,
};
export default SkillCard;
