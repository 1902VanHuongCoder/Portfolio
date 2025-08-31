import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase_setup/firebase";
import { doc, updateDoc, addDoc, collection, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { IoCloseCircleSharp } from "react-icons/io5";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [, setUpdateContent] = useState("");
  const [updateImageFile, setUpdateImageFile] = useState(null);
  const [updateImagePreview, setUpdateImagePreview] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const docRef = doc(db, "blogPosts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBlog({ id, ...data });
        setUpdateTitle(data.title || "");
        setUpdateDate(data.date || "");
        setUpdateContent(data.content || "");
        setUpdateImagePreview(data.imageUrl || null);
        setContent(data.content || null);
      }
      setLoading(false);
    };
    if (id) fetchBlog();
  }, [id]);

 const editor = useEditor({
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

  const handleUpdateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdateImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    if (!blog) return;
    try {
      let imageUrl = blog.imageUrl || null;

      if(!updateImagePreview){
         alert("No image uploaded");
         return;
      }

      if (updateImageFile) {
        // Delete old image
        const oldImageRef = ref(storage, blog.imageUrl);
        await deleteObject(oldImageRef);

        const storageRef = ref(
          storage,
          `blog-thumbnails/${Date.now()}-${updateImageFile.name}`
        );
        await uploadBytes(storageRef, updateImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, "blogPostsUpdateLog"), {
        blogId: blog.id,
        oldTitle: blog.title,
        oldContent: blog.content,
        oldDate: blog.date,
        oldImageUrl: blog.imageUrl,
        updatedAt: new Date(),
      });
      const blogDocRef = doc(db, "blogPosts", blog.id);
      await updateDoc(blogDocRef, {
        title: updateTitle,
        date: updateDate,
        content: content,
        imageUrl,
      });
      alert("Blog post updated successfully!");
      navigate(-1);
    } catch (error) {
      alert("Error updating blog post.");
      console.error("Error updating blog post: ", error);
    }
  };

  useEffect(() => {
    if (editor && content !== null) {
      try {
        editor.commands.setContent(JSON.parse(content));
      } catch {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }
  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Blog not found.
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] px-5">
      <form
        onSubmit={handleUpdateBlog}
        className="rounded-xl p-5 w-full shadow-2xl flex flex-col gap-3 relative"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2 text-[#154D71]">
          Update Blog Post
        </h2>
        <div className="lg:flex gap-x-4">
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Title</span>
            <input
              type="text"
              className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0] text-black"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col w-full">
            <span className="text-gray-700">Date Created</span>
            <input
              type="date"
              className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0] text-black"
              value={updateDate}
              onChange={(e) => setUpdateDate(e.target.value)}
              required
            />
          </label>
        </div>
        <label className="flex flex-col">
          <span className="text-gray-700">Featured Image</span>
          <input
            type="file"
            className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
            onChange={handleUpdateImageChange}
          />
        </label>
        <div className="w-30 relative">
          {updateImagePreview && (
           <div className="w-fit h-full relative">
                         <img
                           src={updateImagePreview}
                           alt={`Project Image`}
                           className="w-32 h-32 object-cover rounded mb-1"
                         />
                         <button
                           type="button"
                           onClick={() => setUpdateImagePreview(null)}
                           className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded"
                         >
                           <IoCloseCircleSharp />
                         </button>
                       </div>
          )}
        </div>
        <label className="flex flex-col">
          <span className="text-gray-700">Blog Content</span>
          <div className="border rounded">
            {/* Toolbar */}
            <div className="border rounded p-2">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={
                    editor.isActive("bold")
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={
                    editor.isActive("italic")
                      ? "italic bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                  }
                  className={
                    editor.isActive("underline")
                      ? "underline bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  U
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={
                    editor.isActive("strike")
                      ? "line-through bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 })
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 })
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 })
                      ? "font-bold bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={
                    editor.isActive("bulletList")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={
                    editor.isActive("orderedList")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  className={
                    editor.isActive("blockquote")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ❝
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                  }
                  className={
                    editor.isActive("codeBlock")
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  {"<>"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
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
                      editor.chain().focus().setLink({ href: url }).run();
                  }}
                  className={
                    editor.isActive("link") ? "bg-white/30 px-2" : "px-2"
                  }
                >
                  🔗
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Image URL");
                    if (url)
                      editor.chain().focus().setImage({ src: url }).run();
                  }}
                  className="px-2"
                >
                  🖼️
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" })
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ⯇
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" })
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ≡
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" })
                      ? "bg-white/30 px-2"
                      : "px-2"
                  }
                >
                  ⯈
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor
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
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                />
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                >
                  Clear Color
                </button>
              </div>
              <EditorContent
                editor={editor}
                className="tiptap-content min-h-[300px] p-3 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
              />
            </div>
            <EditorContent
              editor={editor}
              className="tiptap-content min-h-[300px] p-3 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
            />
          </div>
        </label>
        <div className="flex justify-end gap-x-2 mt-2">
          <button
            type="button"
            className="bg-gray-200 text-[#154D71] font-bold px-4 py-2 rounded-lg shadow hover:bg-gray-300"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold px-4 py-2 rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
