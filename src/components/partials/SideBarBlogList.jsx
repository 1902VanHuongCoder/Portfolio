import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { LuArrowLeftCircle } from "react-icons/lu";
import { SideBarBlogListContext } from "../../contexts/SideBarBlogListContext";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
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
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 z-30 w-[80%] bg-[#2E236C] drop-shadow-2xl flex flex-col gap-y-10 h-full border-[rgba(255,255,255,.2)]"
    >
      <div className="flex justify-between items-center px-4 py-5 border-b-[1px] border-b-[rgba(255,255,255,.2)] border-b-solid">
        <p className="text-2xl text-white">Paul To</p>
        <div onClick={handleCloseSideBarBlogList}>
          <p className="text-4xl text-white rounded-full hover:bg-[rgba(255,255,255,.2)] p-1 transition-all">
            <LuArrowLeftCircle />
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-y-10 pl-[18px] overflow-y-scroll pb-[20px]">
        <div className="">
          <p className="font-semibold text-sm text-white">SOCIAL LINKS</p>
          <ul className="mt-2 space-y-2">
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
              <a href="https://www.facebook.com/vanhuong.to.71">Facebook</a>
            </li>
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
            <a href="https://x.com/VnHngT6">Twitter</a>
            </li>
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
              <a href="https://www.linkedin.com/in/t%C3%B4-v%C4%83n-h%C6%B0%E1%BB%9Fng-25bb742a4/">LikeIn</a>
            </li>
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
            <a href="https://github.com/1902VanHuongCoder">Github</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm text-white">BLOG STATS</p>
          <ul className="mt-2 space-y-2">
            <li className="text-[#C8ACD6] text-sm">
              {numberOfAccess} lượt xem
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm text-white">ANOTHER LINKS</p>
          <ul className="mt-2 space-y-2">
          <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://www.tiktok.com/@huongto007">Tik tok</a>
                  </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm text-white">OVERVIEW</p>
          <ul className="mt-2 space-y-2">
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
              April 2024 (1)
            </li>
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
              May 2024 (4)
            </li>
            <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
              August 2024 (4)
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default SideBarBlogList;
