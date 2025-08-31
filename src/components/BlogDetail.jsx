import { Link as ReactLink, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import { IoHome } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { SideBarBlogListContext } from "../contexts/SideBarBlogListContext";
import { FaBookAtlas } from "react-icons/fa6";
import Loading from "./Loading";
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


const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { setShow } = useContext(SideBarBlogListContext);
  const [content, setContent] = useState(null);

  const handleCloseSideBarBlogList = () => {
    setShow(true);
  };

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
      try {
        const docRef = doc(db, "blogPosts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
          setContent(docSnap.data().content);
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
            <div className="w-full mx-auto max-w-[80%] rounded-2xl p-4 sm:p-10 flex flex-col gap-4">
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
                <div className="prose max-w-none p-4 rounded">
                  <EditorContent
                    editor={editor}
                    className="tiptap-content min-h-[300px] p-3 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDetail;
