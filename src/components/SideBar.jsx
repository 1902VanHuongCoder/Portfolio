import { LuArrowLeftCircle } from "react-icons/lu";
import { FaAddressBook, FaHome } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { FaBookAtlas } from "react-icons/fa6";
import { PiCertificateFill, PiHandshakeFill } from "react-icons/pi";

// import framer motion library
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import { AiFillLike } from "react-icons/ai";
const SideBar = () => {
  const { isSidebar, func } = useContext(SidebarContext);
  const handleCloseSidebar = () => {
    func(!isSidebar);
  };
  const [likeCount, setLikeCount] = useState(0);

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
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 z-30 w-[80%] bg-[#2E236C] h-screen drop-shadow-2xl"
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
          href="#home"
        >
          <FaHome />
          Home
        </a>
        <a
          className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4"
          href="#projects"
        >
          <GrProjects />
          Projects
        </a>
        <a
          className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4"
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
          className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4"
          href="#contact"
        >
          <PiHandshakeFill /> Contacts
        </a>

        <p className="font-bold text-white hover:scale-110 transition-all flex items-center gap-x-4">
         <AiFillLike /> {likeCount < 10 ? "0" + likeCount : likeCount} Likes
        </p>
        <Link
          className="font-bold text-[#C8ACD6] hover:scale-110 transition-all flex items-center gap-x-4 sm:gap-x-2"
          to="/blogs"
        >
          <FaAddressBook /> My blogs
        </Link>
      </div>
    </motion.div>
  );
};

export default SideBar;
