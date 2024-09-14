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
                    <a href="https://www.facebook.com/vanhuong.to.71">
                      Facebook
                    </a>
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://x.com/VnHngT6">Twitter</a>
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://www.linkedin.com/in/t%C3%B4-v%C4%83n-h%C6%B0%E1%BB%9Fng-25bb742a4/">
                      LikeIn
                    </a>
                  </li>
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    <a href="https://github.com/1902VanHuongCoder">Github</a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">BLOG STATS</p>
                <ul className="mt-2 space-y-2">
                  <li className="text-[#C8ACD6] text-sm hover:scale-110 hover:text-white transition-transform origin-left">
                    {numberOfAccess} lượt xem
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  ANOTHER LINKS
                </p>
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
            <div className=" border-l border-[rgba(255,255,255,.2)]"></div>
            {blogs.length > 0 ? (
              <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 pt-10 sm:pt-7 px-3 sm:px-6">
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
            ) : (
              <div className="w-full h-auto flex justify-center items-center pt-10 sm:pt-7 px-3 sm:px-6 border-l border-[rgba(255,255,255,.2)]">
                  <p className="text-center text-white">
                    <img src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Cute loading gif" className="w-24 h-24 mx-auto mb-2" />
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
