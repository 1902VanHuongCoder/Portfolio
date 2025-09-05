import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { SideBarBlogListContext } from "../../contexts/SideBarBlogListContext";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import { FaArrowCircleLeft, FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaCode} from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaBookAtlas } from "react-icons/fa6";
const SideBarBlogList = () => {
  const { setShow } = useContext(SideBarBlogListContext);
  const [numberOfAccess, setNumberOfAccess] = useState([]);
  const handleCloseSideBarBlogList = () => {
    setShow(false);
  };

  useEffect(() => {
    const fetchBlogsAndUpdateAccess = async () => {
      const likeRef = doc(db, "likes", "numberOfAccessing");
      await updateDoc(likeRef, {
        count: increment(1),
      });
      const unsubscribeLikes = onSnapshot(
        likeRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setNumberOfAccess(docSnapshot.data().count || 0);
          }
        },
        (error) => {
          console.error("Error fetching like count: ", error);
        }
      );
      return () => {
        unsubscribeLikes();
      };
    };
    fetchBlogsAndUpdateAccess();
  }, []);

  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ duration: 0.1 }}
      className="fixed top-0 left-0 z-30 w-[100%] drop-shadow-2xl flex h-full border-[rgba(255,255,255,.2)]"
    >
      <div className="w-[80%] bg-[#154D71] h-full flex flex-col gap-y-6">
        <div className="flex justify-between items-center px-4 py-5 border-b-[1px] border-b-[rgba(255,255,255,.2)] border-b-solid">
          <p className="text-2xl text-white">Paul To</p>
          <div onClick={handleCloseSideBarBlogList}>
            <p className="text-4xl text-white rounded-full hover:bg-[rgba(255,255,255,.2)] p-1 transition-all">
              <FaArrowCircleLeft />
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-10 pl-[18px] overflow-y-scroll pb-[20px]">
          <div className="">
            <p className="font-semibold text-sm text-white">SOCIAL LINKS</p>
            <ul className="mt-4 space-y-2">
              <li className="text-white/80 ml-2 text-sm hover:scale-110 hover:text-white transition-transform origin-left flex items-center gap-2 ">
                <span className="text-lg">
                  <FaFacebook />
                </span>
                <a
                  href="https://www.facebook.com/vanhuong.to.71"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li className="text-white/80 ml-2 text-sm hover:scale-110 hover:text-white transition-transform origin-left flex items-center gap-2 ">
                <span className="text-lg">
                  <FaTwitter />
                </span>
                <a
                  href="https://x.com/VnHngT6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li className="text-white/80 ml-2 text-sm hover:scale-110 hover:text-white transition-transform origin-left flex items-center gap-2 ">
                <span className="text-lg">
                  <FaLinkedin />
                </span>
                <a
                  href="https://www.linkedin.com/in/t%C3%B4-v%C4%83n-h%C6%B0%E1%BB%9Fng-25bb742a4/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li className="text-white/80 ml-2 text-sm hover:scale-110 hover:text-white transition-transform origin-left flex items-center gap-2 ">
                <span className="text-lg">
                  <FaGithub />
                </span>
                <a
                  href="https://github.com/1902VanHuongCoder"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-white">BLOG STATS</p>
            <ul className="mt-4 space-y-2">
              <li className="text-[#33A1E0] text-sm text-white/80 ml-2">
                {numberOfAccess} lượt xem
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-white">ANOTHER LINKS</p>
            <ul className="mt-4 space-y-2 flex flex-col">
              <li className="text-white/80 ml-2 text-sm hover:scale-110 hover:text-white transition-transform origin-left flex items-center gap-2 ">
                <span className="text-lg">
                  <FaCode />
                </span>
                <Link to="/exchange-source-code" className="flex-1">
                  Share source code
                </Link>
              </li>
              <li className="text-white/80 ml-2 text-sm hover:scale-110 hover:text-white transition-transform origin-left flex items-center gap-2 ">
                <span className="text-lg">
                  <FaBookAtlas />
                </span>
                <Link to="/blogs" className="flex-1">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.1 }}
        onClick={handleCloseSideBarBlogList}
        className="w-[20%] bg-black/20 h-full"
      ></motion.div>
    </motion.div>
  );
};

export default SideBarBlogList;
