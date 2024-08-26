import { useContext } from "react";
import { MdMenu } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { FaBookAtlas } from "react-icons/fa6";
import { PiHandshakeFill } from "react-icons/pi";
import { PiCertificateFill } from "react-icons/pi";

import { SidebarContext } from "../../contexts/SidebarContext";
const NavigationBar = () => {
  const { isSidebar, func } = useContext(SidebarContext);
  const handleShowSideBar = () => {
    func(!isSidebar);
  };
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#19133D]">
      <p className="text-2xl text-white">Paul To</p>
      <div>
        <div className="hidden sm:flex gap-x-10 ">
          <a
            className="px-6 sm:px-0 py-4 bg-white sm:bg-transparent sm:text-white font-bold rounded-sm hover:scale-110 transition-transform flex items-center gap-x-4 sm:gap-x-2"
            href="#home"
          >
            <FaHome />
            Home
          </a>
          <a
            className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4 sm:gap-x-2"
            href="#projects"
          >
            <GrProjects />
            Projects
          </a>
          <a
            className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4 sm:gap-x-2"
            href="#skills"
          >
            <FaBookAtlas />
            Skills
          </a>
          <a
            className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4 sm:gap-x-2"
            href="#certificates"
          >
            <PiCertificateFill /> Certificates
          </a>

          <a
            className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4 sm:gap-x-2"
            href="#contact"
          >
            <PiHandshakeFill /> Contacts
          </a>
        </div>
        <p
          onClick={handleShowSideBar}
          className="block sm:hidden text-4xl text-white rounded-full hover:bg-[rgba(255,255,255,.2)] p-1 transition-all"
        >
          <MdMenu />
        </p>
      </div>
    </div>
  );
};

export default NavigationBar;
