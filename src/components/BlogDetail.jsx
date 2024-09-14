import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import { IoHome } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { SideBarBlogListContext } from "../contexts/SideBarBlogListContext";
import { FaBookAtlas } from "react-icons/fa6";
import LikeButton from "./Interaction";
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
    return <Error error={error} />
  }

  return (
    <div className="relative w-full min-h-screen bg-[#2E236C]">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center px-[25px] py-4 bg-[rgba(0,0,0,.45)]">
            <div className="flex gap-2">
              <Link
                to="/"
                className="w-[50px] h-[50px] bg-[rgba(255,255,255,.1)] flex justify-center items-center rounded-full"
              >
                <span className="text-2xl text-white">
                  <IoHome />
                </span>
              </Link>
              <Link
                to="/blogs"
                className="w-[50px] h-[50px] flex justify-center items-center"
              >
                <span className="text-2xl text-white">
                  <FaBookAtlas />
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
          {blog && (
            <div className="text-white w-full mx-auto max-w-[1024px]">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto sm:h-[400px] object-cover mb-4 sm:mt-10"
              />
              <div className="px-3 sm:px-0">
                <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
                <p className="text-slate-300 mb-4 flex items-center">
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
                  className="mt-10"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
              <LikeButton />
            </div>
          )}
         
        </>
      )}
    </div>
  );
};

export default BlogDetail;
