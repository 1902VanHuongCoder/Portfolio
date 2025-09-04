import { Link, Outlet, useLocation } from "react-router-dom";
import { FaFileCode, FaUserTie } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowDropleft } from "react-icons/io";
import { FaListAlt } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { PiCertificateBold } from "react-icons/pi";
import { RiNewsFill } from "react-icons/ri";
import Toast from "../partials/Toast";
import useToast from "../../hooks/toast-hook";
import AdminLoading from "../partials/AdminLoading";
import { useLoading } from "../../lib/loading-context";
import { LiaCommentSolid } from "react-icons/lia";  
const AdminLayout = () => {
  const location = useLocation();
  const [isShowSideBar, setIsShowSideBar] = useState(true);
  const { toast } = useToast();
  const { loading } = useLoading();
  return (
    <div className="relative min-h-screen flex w-full overflow-hidden">
      {/* Toast */}
      <AnimatePresence>{toast.show && <Toast />}</AnimatePresence>

      {/* Loading Spinner */}
      {loading.show && <AdminLoading text={loading.text} />}

      {/* Sidebar */}
      <motion.div
        initial={{ width: 0, originX: 1 }}
        animate={{ width: isShowSideBar ? "20%" : 0, originX: 1 }}
        exit={{ width: 0, originX: 1 }}
        transition={{ duration: 0.4 }}
        className="h-full bg-black opacity-50 z-0"
        style={{ originX: 1 }}
      ></motion.div>
      <motion.aside
        initial={{ width: 0, originX: 1 }}
        animate={{ width: isShowSideBar ? "" : 0, originX: 1 }}
        exit={{ width: 0, originX: 1 }}
        transition={{ duration: 0.4 }}
        className="w-[80%] lg:w-[20%] fixed top-0 left-0 min-h-screen bg-[#002b5b] text-white flex flex-col border-r border-gray-100/20 z-10"
        style={{ originX: 1 }}
      >
        <div
          className={`absolute bottom-0 -translate-y-[50%] -right-5 cursor-pointer text-4xl p-1 bg-[#1075b4] rounded-full border-[1px] border-gray-200 text-white ${
            isShowSideBar ? "" : "rotate-180"
          }`}
        >
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
              to="/admin"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin" ? "bg-[#33A1E0]" : ""
              }`}
            >
              {/* Project Icon */}
              <FaListAlt />
              Projects
            </Link>
            <Link
              to="/admin/skills"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/skills" ? "bg-[#33A1E0]" : ""
              }`}
            >
              {/* Skills Icon */}
              <FcSearch />
              Skills
            </Link>
            <Link
              to="/admin/certificates"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/certificates"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
            >
              {/* Certificate Icon */}
              <PiCertificateBold />
              Certificates
            </Link>
            <Link
              to="/admin/add/blogs"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/add/blogs" ? "bg-[#33A1E0]" : ""
              }`}
            >
              {/* Blog Icon */}
              <RiNewsFill />
              Add Blog
            </Link>
            <Link
              to="/admin/source-code"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/source-code" ? "bg-[#33A1E0]" : ""
              }`}
            >
              <span>
                <FaFileCode />
              </span>
              <span>Source Code</span>
            </Link>
            <Link
              to="/admin/comments"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/comments"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
            >
              <span>
                <LiaCommentSolid />
              </span>
              <span>Comments</span>
            </Link>
            <Link
              to="/admin/personal-info"
              className={`hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2 ${
                location.pathname === "/admin/personal-info"
                  ? "bg-[#33A1E0]"
                  : ""
              }`}
            >
              <span>
                <FaUserTie />
              </span>
              <span>Personal Info</span>
            </Link>
          </nav>
        </div>
      </motion.aside>
      {/* Content */}

      <AnimatePresence>
        <motion.main
          animate={{ width: isShowSideBar ? "80%" : "100%" }}
          transition={{ duration: isShowSideBar ? 0.4 : 0 }}
          className={` bg-transparent`}
          style={{ originX: 0 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};
export default AdminLayout;
