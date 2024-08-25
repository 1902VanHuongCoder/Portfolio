import { LuArrowLeftCircle } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { FaBookAtlas } from "react-icons/fa6";
import { PiHandshakeFill } from "react-icons/pi";

// import framer motion library
import { motion } from "framer-motion";
import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
const SideBar = () => {
  const { isSidebar, func } = useContext(SidebarContext);
  const handleCloseSidebar = () => {
    func(!isSidebar);
  };
  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ duration: .5 }}
      className="fixed top-0 left-0 z-10 w-[80%] bg-[#2E236C] h-screen drop-shadow-2xl"
    >
      <div className="flex justify-between items-center px-4 py-4 border-b-[1px] border-b-[#201B4E] border-b-solid">
        <p className="text-2xl text-white">Paul To</p>
        <div onClick={handleCloseSidebar}>
          <p className="text-4xl text-white rounded-full hover:bg-[rgba(255,255,255,.2)] p-1 transition-all">
            <LuArrowLeftCircle />
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start h-full gap-y-10 text-xl px-4 pt-10">
        <a
          className="px-6 py-4 bg-white font-bold rounded-sm hover:scale-110 transition-transform flex items-center gap-x-4"
          href=""
        >
          <FaHome />
          Home
        </a>
        <a
          className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4"
          href=""
        >
          <GrProjects />
          Projects
        </a>
        <a
          className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4"
          href=""
        >
          <FaBookAtlas />
          Skills
        </a>
        <a
          className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4"
          href=""
        >
          <PiHandshakeFill /> Contacts
        </a>
      </div>
    </motion.div>
  );
};

export default SideBar;
