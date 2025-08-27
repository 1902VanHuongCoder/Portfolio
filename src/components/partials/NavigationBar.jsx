import { useContext, useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { FaBookAtlas } from "react-icons/fa6";
import { PiHandshakeFill } from "react-icons/pi";
import { PiCertificateFill } from "react-icons/pi";
import { FaAddressBook } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

import { SidebarContext } from "../../contexts/SidebarContext";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
const NavigationBar = () => {
  const { isSidebar, func } = useContext(SidebarContext);
  const [likeCount, setLikeCount] = useState(0);
  const handleShowSideBar = () => {
    func(!isSidebar);
  };
  useEffect(() => {
    const likeRef = doc(db, "likes", "likeDocument");

    const unsubscribe = onSnapshot(
      likeRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setLikeCount(docSnapshot.data().count || 0);
        }
      },
      (error) => {
        console.error("Error fetching like count: ", error);
      }
    );

    return () => unsubscribe();
  }, []);
  return (
    <div className="flex justify-between items-center px-6 py-2 mx-2 border-[1.5px] border-[#154D71] shadow-lg md:mx-4 rounded-full mt-2 bg-white/20 backdrop-blur-2xl">
      <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#154D71] to-[#33A1E0] drop-shadow tracking-wide select-none">Paul To</p>
      <div>
        <div className="hidden lg:flex gap-x-8 items-center">
          <a
            className="px-5 sm:px-2 py-3 font-bold hover:scale-105 rounded-xl text-[#154D71]  transition-all flex items-center gap-x-3 sm:gap-x-2 text-lg duration-200"
            href="#home"
          >
            <span className="rounded-full bg-[#33A1E0]/10 p-2 text-[#154D71] flex items-center justify-center"><FaHome size={20} /></span>
            Home
          </a>
          <a
            className="font-bold hover:scale-105 text-[#154D71]  transition-all flex items-center gap-x-3 sm:gap-x-2 rounded-xl px-2 py-3 text-lg duration-200"
            href="#projects"
          >
            <span className="rounded-full bg-[#33A1E0]/10 p-2 text-[#154D71] flex items-center justify-center"><GrProjects size={20} /></span>
            Projects
          </a>
          <a
            className="font-bold hover:scale-105 text-[#154D71]  transition-all flex items-center gap-x-3 sm:gap-x-2 rounded-xl px-2 py-3 text-lg duration-200"
            href="#skills"
          >
            <span className="rounded-full bg-[#33A1E0]/10 p-2 text-[#154D71] flex items-center justify-center"><FaBookAtlas size={20} /></span>
            Skills
          </a>
          <a
            className="font-bold hover:scale-105 text-[#154D71]  transition-all flex items-center gap-x-3 sm:gap-x-2 rounded-xl px-2 py-3 text-lg duration-200"
            href="#certificates"
          >
            <span className="rounded-full bg-[#33A1E0]/10 p-2 text-[#154D71] flex items-center justify-center"><PiCertificateFill size={20} /></span>
            Certificates
          </a>
          <a
            className="font-bold hover:scale-105 text-[#154D71]  transition-all flex items-center gap-x-3 sm:gap-x-2 rounded-xl px-2 py-3 text-lg duration-200"
            href="#contact"
          >
            <span className="rounded-full bg-[#33A1E0]/10 p-2 text-[#154D71] flex items-center justify-center"><PiHandshakeFill size={20} /></span>
            Contacts
          </a>
          <p className="px-4 sm:px-2 py-3 font-bold rounded-xl text-[#154D71]  transition-all flex items-center gap-x-3 sm:gap-x-2 text-lg duration-200">
            <span className="rounded-full bg-[#33A1E0]/10 p-2 text-[#154D71] flex items-center justify-center"><AiFillLike size={20} /></span>
            <span className="ml-1 font-mono tracking-widest">{likeCount < 10 ? "0" + likeCount : likeCount}</span>
          </p>
          <Link
            className="font-bold hover:scale-105 text-[#33A1E0] transition-all flex items-center gap-x-3 sm:gap-x-2 rounded-xl px-2 py-3 text-lg duration-200"
            to="/blogs"
          >
            <span className="rounded-full bg-[#154D71]/10 p-2 text-[#33A1E0] flex items-center justify-center"><FaAddressBook size={20} /></span>
            My blogs
          </Link>
        </div>
        <p
          onClick={handleShowSideBar}
          className="block lg:hidden text-4xl text-[#154D71] rounded-full/20 p-2 transition-all cursor-pointer"
        >
          <MdMenu />
        </p>
      </div>
    </div>
  );
};

export default NavigationBar;
