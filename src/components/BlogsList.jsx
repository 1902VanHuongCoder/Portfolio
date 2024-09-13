import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase_setup/firebase";
import { AiFillLike } from "react-icons/ai";

import { Link } from "react-router-dom";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { SideBarBlogListContext } from "../contexts/SideBarBlogListContext";
import Blog from "./partials/Blog";
import Loading from "./Loading";

const BlogsList = () => {
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const { isShow, setShow } = useContext(SideBarBlogListContext);
  const [blogs, setBlogs] = useState([]);

  console.log(isShow);

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
  return (
    <div className="relative w-full min-h-screen bg-[#2E236C]">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center px-[25px] bg-[rgba(0,0,0,.45)]">
            <p className="text-2xl text-white hidden sm:block">
              Paul To - Challenge is an opportunity
            </p>
            <div className="flex items-center flex-row-reverse sm:flex-row gap-x-1 py-4">
              <div className="sm:px-6 py-4 pl-4 text-white font-bold rounded-sm flex items-center gap-x-2">
                <div className="flex">
                  {likeCount < 9 ? "0" : " "}
                  <motion.p>{displayValue}</motion.p>
                </div>
                <AiFillLike />
              </div>
              <Link
                to="/"
                className="w-[50px] h-[50px] bg-[rgba(255,255,255,.1)] flex justify-center items-center rounded-full"
              >
                <span className="text-2xl text-white">
                  <IoHome />
                </span>
              </Link>
            </div>
            <p
              onClick={handleCloseSideBarBlogList}
              className="block sm:hidden text-4xl text-white rounded-full hover:bg-[rgba(255,255,255,.2)] p-1 transition-all"
            >
              <MdMenu />
            </p>
          </div>

          <div className="block sm:flex w-full min-h-screen">
            <div className="hidden sm:flex flex-col gap-y-10 pl-[25px] pt-6 h-full w-1/5">
              <div className="">
                <p className="font-semibold text-sm text-white">SOCIAL LINKS</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    Facebook
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    Twitter
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    LikeIn
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    Github
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">BLOG STATS</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    13,695,374 lượt xem
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  ANOTHER LINKS
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    Tiktok.com
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    Google.com
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
            <div className="italic font-medium text-xl text-white uppercase drop-shadow-2xl w-full text-center pt-14 sm:hidden">
              <span className="relative text-[#e4d1ed] font-semibold text-[60px]">
                Challenge
                <span className="absolute top-[20px] left-[1px] text-[#C8ACD6]">
                  Challenge
                </span>
              </span>{" "}
              <br />
              <span className="not-italic">is an opportunity</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 mt-10 sm:mt-7  border-l border-[rgba(255,255,255,.2)]">
              {blogs.map((blog) => (
                <Blog
                  key={blog.id}
                  imageUrl={blog.imageUrl}
                  title={blog.title}
                  date={blog.date}
                  blogId={blog.id}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsList;
