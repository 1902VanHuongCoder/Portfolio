import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import { IoHome } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { SideBarBlogListContext } from "../contexts/SideBarBlogListContext";
import { FaBookAtlas } from "react-icons/fa6";
import Loading from "./Loading";
import Error from "./partials/Error";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setShow } = useContext(SideBarBlogListContext);

  const handleCloseSideBarBlogList = () => {
    setShow(true);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogPosts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Không tìm thấy bài viết");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải bài viết");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center px-4 sm:px-10 py-4 bg-white/10 backdrop-blur-md shadow-lg border-b border-[#33A1E0]/30">
            <div className="flex gap-2 items-center justify-between w-full">
              <p className="text-2xl text-white font-bold hidden sm:block drop-shadow">
                Paul To - <span>Challenge is an opportunity</span>
              </p>
              <div className="flex gap-x-4">
                <div className="flex gap-2 items-center">
                  <Link
                    to="/"
                    className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
                  >
                    <span className="hidden lg:block">Trang Chủ</span>
                    <span className="text-2xl lg:text-md">
                      <IoHome />
                    </span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center">
                  <Link
                    to="/blogs"
                    className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
                  >
                    <span className="hidden lg:block">Danh Sách Bài Viết</span>
                    <span className="text-2xl lg:text-md">
                      <FaBookAtlas />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <p
              onClick={handleCloseSideBarBlogList}
              className="block sm:hidden text-4xl text-white rounded-full hover:bg-[#33A1E0]/20 p-1 transition-all cursor-pointer"
            >
              <MdMenu />
            </p>
          </div>
          {blog && (
            <div className="w-full mx-auto max-w-[1200px] rounded-2xl mt-8 p-4 sm:p-10 flex flex-col gap-4">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto sm:h-[400px] object-cover mb-4 rounded-xl border border-[#33A1E0]/20 shadow"
              />
              <div className="px-1 sm:px-0">
                <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 text-white drop-shadow">
                  {blog.title}
                </h1>
                <p className="text-[#33A1E0] mb-4 flex items-center font-semibold">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {blog.date}
                </p>
                <div
                  className="mt-6 text-white text-base sm:text-lg"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDetail;
