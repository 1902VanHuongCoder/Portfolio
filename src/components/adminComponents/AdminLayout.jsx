import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserTie } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowDropleft } from "react-icons/io";
const AdminLayout = () => {
  const location = useLocation();
  const [isShowSideBar, setIsShowSideBar] = useState(true);
  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isShowSideBar ? "25%" : 0 }}
        exit={{ width: 0 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
      <motion.aside
        initial={{ width: 0 }}
        animate={{ width: isShowSideBar ? "" : 0 }}
        exit={{ width: 0 }}
        transition={{ duration: isShowSideBar ? 0.4 : 0.6 }}
        className="w-[80%] lg:w-[20%] fixed top-0 left-0 min-h-screen bg-[#1075b4] text-white flex flex-col border-r border-gray-200 z-10"
      >
        <div className="absolute bottom-0 -translate-y-[50%] -right-5 cursor-pointer text-4xl p-1 bg-[#1075b4] rounded-full border-[1px] border-gray-200 text-white">
          <IoIosArrowDropleft
            onClick={() => setIsShowSideBar(!isShowSideBar)}
          />
        </div>
        <div
          className={`${
            isShowSideBar ? "w-full py-8 px-4" : "w-0"
          } h-full  overflow-hidden`}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-x-2">
            <FaUserTie />
            Administrator
          </h2>
          <nav className="flex flex-col gap-4">
            <Link
              to="/admin/dashboard/projects"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/dashboard/projects"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
              onClick={() => setIsShowSideBar(false)}
            >
              {/* Project Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
              </svg>
              Projects
            </Link>
            <Link
              to="/admin/dashboard/skills"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/dashboard/skills"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
              onClick={() => setIsShowSideBar(false)}
            >
              {/* Skills Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2v20M2 12h20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              Skills
            </Link>
            <Link
              to="/admin/dashboard/certificates"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/dashboard/certificates"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
              onClick={() => setIsShowSideBar(false)}
            >
              {/* Certificate Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="12" cy="10" r="2" fill="currentColor" />
                <path
                  d="M8 20l4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Certificates
            </Link>
            <Link
              to="/admin/dashboard/add/blogs"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/dashboard/add/blogs"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
              onClick={() => setIsShowSideBar(false)}
            >
              {/* Blog Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 8h8M8 12h8M8 16h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Add Blog
            </Link>
          </nav>
        </div>
      </motion.aside>
      {/* Content */}

      <AnimatePresence>
        <motion.main
          animate={{ width: isShowSideBar ? "w-[80%]" : "" }}
          transition={{ duration: isShowSideBar ? 0.1 : 0 }}
          className={`w-full bg-gray-50`}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};
export default AdminLayout;
