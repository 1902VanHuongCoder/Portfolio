import { Link as ReactLink, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import { IoHome } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { SideBarBlogListContext } from "../../contexts/SideBarBlogListContext";
import { FaBookAtlas, FaFacebook } from "react-icons/fa6";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Gapcursor from "@tiptap/extension-gapcursor";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useLoading } from "../../lib/loading-context";
import useToast from "../../hooks/toast-hook";
import { TiDocumentText } from "react-icons/ti";
import { HiCalendarDateRange } from "react-icons/hi2";
import { Helmet } from "react-helmet-async";
import { trackPageView, incrementBlogView } from "../../lib/analytics-apis";

const BlogDetail = () => {
  // Toast context
  const { showToast } = useToast();
  // Loading context
  const { showLoading, hideLoading } = useLoading();

  // Get the blog post ID from the URL parameters
  const { id } = useParams();

  // Blog post state
  const [blog, setBlog] = useState(null);

  // Sidebar context
  const { setShow } = useContext(SideBarBlogListContext);

  // Blog content state
  const [content, setContent] = useState(null);

  const handleCloseSideBarBlogList = () => {
    setShow(true);
  };

  // Initialize editor with extensions
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      ListItem,
      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Gapcursor,
      Color,
      TextStyle,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      showLoading();
      try {
        const docRef = doc(db, "blogPosts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = { id: docSnap.id, ...docSnap.data() };
          setBlog(blogData);
          setContent(docSnap.data().content);
          
          // Track page view and increment blog view count
          trackPageView("Blog Detail", window.location.pathname, {
            blogId: id,
            blogTitle: blogData.title,
          });
          incrementBlogView(id);
          
          console.log("Fetched blog:", blogData);
        } else {
          showToast("info", "Không tìm thấy bài viết");
        }
      } catch (err) {
        showToast("error", "Có lỗi xảy ra khi tải bài viết");
        console.error("Error fetching blog:", err);
      } finally {
        hideLoading();
      }
    };

    fetchBlog();
  }, [hideLoading, id, showLoading, showToast]);

  useEffect(() => {
    if (editor && content !== null) {
      try {
        editor.commands.setContent(JSON.parse(content));
      } catch {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      {blog && (
        <Helmet>
          <title>{blog.title}</title>
          <meta property="og:title" content={blog.title} />
          <meta
            property="og:description"
            content={blog.description || blog.title}
          />
          <meta property="og:image" content={blog.image} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="article" />
        </Helmet>
      )}
      <div className="flex justify-between items-center px-4 sm:px-10 py-4 bg-white/10 backdrop-blur-md shadow-lg border-b border-[#33A1E0]/30">
        <div className="flex gap-2 items-center justify-between w-full">
          <p className="text-2xl text-white font-bold hidden sm:block drop-shadow">
            Paul To - <span>Challenge is an opportunity</span>
          </p>
          <div className="flex gap-x-4">
            <div className="flex gap-2 items-center">
              <ReactLink
                to="/"
                className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
              >
                <span className="hidden lg:block">Trang Chủ</span>
                <span className="text-2xl lg:text-md">
                  <IoHome />
                </span>
              </ReactLink>
            </div>
            <div className="flex gap-2 items-center">
              <ReactLink
                to="/blogs"
                className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
              >
                <span className="hidden lg:block">Danh Sách Bài Viết</span>
                <span className="text-2xl lg:text-md">
                  <FaBookAtlas />
                </span>
              </ReactLink>
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
        <div className="w-full mx-auto lg:max-w-[80%] rounded-2xl p-4 sm:p-10 flex flex-col gap-4">
          <div className="relative w-full">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto sm:h-[400px] object-cover mb-4 rounded-xl border border-[#33A1E0]/20 shadow"
            />
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"              
              className="absolute bottom-8 right-4 bg-white/30 backdrop-blur-md px-4 py-2 rounded-md border border-[#33A1E0]/40 shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <p className="text-white font-semibold flex items-center gap-x-2">
                <span>Share on Facebook</span>{" "}
                <span className="text-2xl">
                  <FaFacebook />
                </span>
              </p>
            </a>
          </div>
          <div className="px-1 sm:px-0">
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 text-white drop-shadow">
              {blog.title}
            </h1>
            <p className="text-white/70 mb-4 flex items-center font-semibold gap-x-2">
              <HiCalendarDateRange />
              {blog.date}
            </p>
            <div className="mt-6">
              <div className="flex items-center gap-x-3 mb-4">
                {" "}
                <p className="flex gap-x-2 items-center text-white/80 font-semibold shrink-0 bg-white/10 px-3 py-2 rounded-full">
                  <span>
                    <TiDocumentText />
                  </span>
                  <span>Blog content</span>
                </p>{" "}
                <span className="w-full h-[2px] bg-white/20 rounded-full"></span>
              </div>

              <EditorContent
                editor={editor}
                className="tiptap-content min-h-[300px] focus:outline-none rounded-br-md rounded-bl-md focus:border-none text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
