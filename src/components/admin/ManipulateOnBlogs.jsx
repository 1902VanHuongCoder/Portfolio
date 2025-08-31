import { useState, useEffect } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Link as ReactLink } from "react-router-dom";
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
import {deleteObject, ref as storageRef} from "firebase/storage";
const ManipulateOnBlogs = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const [content, setContent] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  // Initialize text editor

  const addEditor = useEditor({
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
      setContent(editor.getJSON());
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const storageRef = ref(
      storage,
      `blog-thumbnails/${Date.now()}-${imageFile.name}`
    );
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadImage();
      await addDoc(collection(db, "blogPosts"), {
        title,
        date,
        content,
        imageUrl,
        createdAt: new Date(),
      });
      alert("Blog post added successfully!");
      setTitle("");
      setDate("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error adding blog post: ", error);
      alert("Error adding blog post. Please try again.");
    }
  };

  const fetchBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, "blogPosts"));
    const blogsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogs(blogsData);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (id) => {
    try {
      // Delete all relative images
      const blogThumbnailImage = blogs.find(blog => blog.id === id)?.imageUrl;
      if (blogThumbnailImage) {
        const imageRef = storageRef(storage, blogThumbnailImage);
        await deleteObject(imageRef);
      }

      await deleteDoc(doc(db, "blogPosts", id));
      fetchBlogs();
    } catch (error) {
      alert("Error deleting blog post.");
      console.error("Error deleting blog post: ", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] px-4">
      <h1 className="w-full text-4xl px-4 py-6 font-extrabold text-white drop-shadow-xl border-b-[1px] border-b-white/10">
        BLOG OPERATIONS
      </h1>
      <AnimatePresence>
        {confirmDelete.show && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-xs w-full shadow-2xl flex flex-col gap-4 text-center"
            >
              <p className="text-lg font-semibold">
                Xác nhận xóa bài viết này?
              </p>
              <div className="flex gap-4 justify-center mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                  onClick={async () => {
                    await handleDeleteBlog(confirmDelete.id);
                    setConfirmDelete({ show: false, id: null });
                  }}
                >
                  Xóa
                </button>
                <button
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-bold"
                  onClick={() => setConfirmDelete({ show: false, id: null })}
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto mt-6 px-4 text-white">
        <form onSubmit={handleSubmit} className="mb-10">
          <p className="text-xl font-semibold mb-4">Add New Blog Post</p>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-bold">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-black"
              required
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 font-bold">
              Date Created
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 font-bold">
              Featured Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0]"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-w-full h-auto max-h-64 object-contain rounded shadow"
              />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 font-bold">
              Blog Content
            </label>
            <div className="border rounded p-2">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => addEditor.chain().focus().toggleBold().run()}
                  className={
                    addEditor.isActive("bold")
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => addEditor.chain().focus().toggleItalic().run()}
                  className={
                    addEditor.isActive("italic")
                      ? "italic bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleUnderline().run()
                  }
                  className={
                    addEditor.isActive("underline")
                      ? "underline bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  U
                </button>
                <button
                  type="button"
                  onClick={() => addEditor.chain().focus().toggleStrike().run()}
                  className={
                    addEditor.isActive("strike")
                      ? "line-through bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={
                    addEditor.isActive("heading", { level: 1 })
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    addEditor.isActive("heading", { level: 2 })
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={
                    addEditor.isActive("heading", { level: 3 })
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleBulletList().run()
                  }
                  className={
                    addEditor.isActive("bulletList")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleOrderedList().run()
                  }
                  className={
                    addEditor.isActive("orderedList")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleBlockquote().run()
                  }
                  className={
                    addEditor.isActive("blockquote")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ❝
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().toggleCodeBlock().run()
                  }
                  className={
                    addEditor.isActive("codeBlock")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  {"<>"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().setHorizontalRule().run()
                  }
                  className="px-2"
                >
                  ―
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter URL");
                    if (url)
                      addEditor.chain().focus().setLink({ href: url }).run();
                  }}
                  className={
                    addEditor.isActive("link") ? "bg-white/30 px-2" : "px-2"
                  }
                >
                  🔗
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Image URL");
                    if (url)
                      addEditor.chain().focus().setImage({ src: url }).run();
                  }}
                  className="px-2"
                >
                  🖼️
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().setTextAlign("left").run()
                  }
                  className={
                    addEditor.isActive({ textAlign: "left" })
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ⯇
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().setTextAlign("center").run()
                  }
                  className={
                    addEditor.isActive({ textAlign: "center" })
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ≡
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor.chain().focus().setTextAlign("right").run()
                  }
                  className={
                    addEditor.isActive({ textAlign: "right" })
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ⯈
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addEditor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                  className="px-2"
                >
                  ▦
                </button>
                <input
                  type="color"
                  onInput={(e) =>
                    addEditor.chain().focus().setColor(e.target.value).run()
                  }
                />
                <button
                  type="button"
                  onClick={() => addEditor.chain().focus().unsetColor().run()}
                >
                  Clear Color
                </button>
              </div>
              <EditorContent
                editor={addEditor}
                className="tiptap-content min-h-[300px] p-3 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-[#33A1E0] font-bold px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 hover:text-white transition"
            >
              Đăng bài viết
            </button>
          </div>
        </form>

        {/* Blog List Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 mb-8 border-t-[1px] border-white/40 py-6">
          {blogs.map((item, index) => (
            <div
              key={item.id}
              className="bg-white/90 border border-[#33A1E0]/20 rounded-xl shadow-xl flex flex-col items-center p-6 transition-all"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-xs text-[#1178b3] font-bold">
                  #{index + 1}
                </span>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-24 rounded-md border border-[#33A1E0]/20 object-cover mb-4"
                />
              )}
              <div className="font-bold text-lg text-[#154D71] mb-2 truncate w-full text-center">
                {item.title}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full justify-center">
                <ReactLink
                  to={`/admin/dashboard/blogs/update/${item.id}`}
                  className="font-bold py-2 px-4 rounded-lg transition duration-200 text-slate-600 flex items-center gap-x-2 border-slate-600 border bg-white hover:bg-[#33A1E0]/10"
                >
                  <FaPencilAlt />
                  Update
                </ReactLink>
                <button
                  onClick={() => setConfirmDelete({ show: true, id: item.id })}
                  className="flex items-center justify-center gap-x-2 text-red-500 font-bold py-2 px-4 rounded-lg transition duration-200 border-red-500 border bg-white hover:bg-red-100"
                >
                  <FaRegTrashAlt />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManipulateOnBlogs;
