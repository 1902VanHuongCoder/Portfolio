import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase_setup/firebase";
import { AiFillLike } from "react-icons/ai";

import { Link } from "react-router-dom";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { SideBarBlogListContext } from "../../contexts/SideBarBlogListContext";
import Blog from "../partials/Blog";
import Loading from "./Loading";

const BlogsList = () => {
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [numberOfAccess, setNumberOfAccess] = useState(0);
  const { setShow } = useContext(SideBarBlogListContext);
  const [blogs, setBlogs] = useState([]);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const displayValue = useTransform(rounded, (latest) => latest.toString());

  const handleCloseSideBarBlogList = () => {
    setShow(true);
  };

  useEffect(() => {
    const controls = animate(count, likeCount);
    return () => controls.stop();
  }, [likeCount, count]);

  useEffect(() => {
    const likeRef = doc(db, "likes", "likeDocument");

    const unsubscribe = onSnapshot(
      likeRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setLikeCount(docSnapshot.data().count || 0);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching like count: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const blogData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-row justify-between items-center px-4 sm:px-10 py-2 bg-white/10 backdrop-blur-md shadow-lg border-b border-[#33A1E0]/30">
            <p className="text-2xl text-white font-bold hidden sm:block drop-shadow">
              Paul To - <span>Challenge is an opportunity</span>
            </p>
            <div className="flex items-center flex-row-reverse sm:flex-row gap-x-2 py-2">
              <div className="sm:px-6 py-2 pl-4 font-bold rounded-full flex items-center gap-x-2 text-white">
                <div className="flex">
                  {likeCount < 9 ? "0" : " "}
                  <motion.p>{displayValue}</motion.p>
                </div>
                <AiFillLike className="text-white text-xl" />
              </div>
              <Link
                to="/"
                className="w-12 h-12 bg-[#33A1E0]/10 flex justify-center items-center rounded-full border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
              >
                <span className="text-2xl text-white">
                  <IoHome />
                </span>
              </Link>
            </div>
            <p
              onClick={handleCloseSideBarBlogList}
              className="block lg:hidden text-4xl text-white rounded-full hover:bg-[#33A1E0]/20 p-1 transition-all cursor-pointer"
            >
              <MdMenu />
            </p>
          </div>

          <div className="flex flex-col lg:flex-row w-full min-h-screen">
            <aside className="hidden lg:flex flex-col gap-y-10 pl-6 pt-10 h-full w-1/5  rounded-r-3xl">
              <div>
                <p className="font-semibold text-sm text-white">SOCIAL LINKS</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://www.facebook.com/vanhuong.to.71">
                      Facebook
                    </a>
                  </li>
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://x.com/VnHngT6">Twitter</a>
                  </li>
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://www.linkedin.com/in/t%C3%B4-v%C4%83n-h%C6%B0%E1%BB%9Fng-25bb742a4/">
                      LinkedIn
                    </a>
                  </li>
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://github.com/1902VanHuongCoder">Github</a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">BLOG STATS</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    {numberOfAccess} lượt xem
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  ANOTHER LINKS
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://www.tiktok.com/@huongto007">Tik tok</a>
                  </li>
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <Link to="/exchange-source-code">Exchange Source Code</Link>
                  </li>
                  <li className="text-[#33A1E0] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <Link to="/blogs">Blogs</Link>
                  </li>
                </ul>
              </div>
            </aside>
            <div className="italic font-medium text-xl text-white uppercase drop-shadow-2xl w-full pt-10 sm:hidden px-4">
              {/* <span className="relative text-[#e4d1ed] font-semibold text-4xl">
                Challenge
                <span className="absolute top-[10px] left-[1px] text-[#33A1E0] opacity-80">Challenge</span>
              </span>
              <br />
              <span className="not-italic">is an opportunity</span> */}
              <h1>My Blogs</h1>
              <div className="w-full h-[2px] bg-[#33A1E0]/20 mt-2 mb-1"></div>
            </div>
            <div className="lg:border-l border-[#33A1E0]/20"></div>
            {blogs.length > 0 ? (
              <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 sm:pt-7 px-3 sm:px-6 mb-8">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white/10 rounded-2xl shadow-lg border border-[#33A1E0]/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 flex flex-col gap-2"
                  >
                    <Blog
                      imageUrl={blog.image}
                      title={blog.title}
                      date={blog.date}
                      blogId={blog.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-auto flex justify-center items-center pt-10 sm:pt-7 px-3 sm:px-6 lg:border-l border-[#33A1E0]/20">
                <p className="text-center text-white">
                  <img
                    src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif"
                    alt="Cute loading gif"
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  No blogs available at the moment. Check back later!
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsList;
