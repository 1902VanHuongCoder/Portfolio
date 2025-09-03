import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { storage } from "../../firebase_setup/firebase";
import { ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase_setup/firebase";
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
import { IoCloseCircleSharp } from "react-icons/io5";

const EditSourceCodeAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    images: [],
    price: "",
    github: "",
    content: "",
    youtube: "",
  });
  const [originalImages, setOriginalImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, "sourceProjects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({ ...data });
        setOriginalImages(data.images || []);
      }
    };
    fetchProject();
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
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((f) => ({ ...f, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (editor && form.content !== editor.getHTML()) {
      editor.commands.setContent(form.content || "<p></p>");
    }
    // eslint-disable-next-line
  }, [form.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleDeleteImage = async (imgUrl) => {
      const newForm = {
        ...form,
        images: form.images.filter((img) => img !== imgUrl),
      };
      setForm(newForm);
  }

  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);
    if(form.images.length === 0){
      alert("No images uploaded");
      return;
    }
    // Find deleted images
    const deletedImages = originalImages.filter(img => !form.images.includes(img));
    // Delete removed images from Firebase Storage
    for (const imgUrl of deletedImages) {
      try {
        // Extract the storage path from the download URL
        const matches = decodeURIComponent(imgUrl).match(/\/o\/(.+)\?/);
        const path = matches && matches[1] ? matches[1] : null;
        if (path) {
          const imgRef = storageRef(storage, path);
          await deleteObject(imgRef);
        }
      } catch (err) {
        // Ignore errors for missing files
        console.warn("Failed to delete image:", imgUrl, err);
      }
    }
    const docRef = doc(db, "sourceProjects", id);
    await updateDoc(docRef, form);
    setLoading(false);
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Edit Project</h2>
      <form
        onSubmit={handleSave}
        className="space-y-4 bg-white rounded-xl shadow p-6 mb-8"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="Subtitle"
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const storagePath = `source-project-images/${Date.now()}-${
                file.name
              }`;
              const storageReference = storageRef(storage, storagePath);
              await uploadBytes(storageReference, file);
              const url = await getDownloadURL(storageReference);
              setForm((f) => ({ ...f, images: [...f.images, url] }));
              e.target.value = "";
            }}
            className="flex-1 p-2 border rounded"
          />
          <span className="text-gray-500 text-sm">
            Upload image from your computer
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.images.map((img, i) => (
            <div key={i} className="w-fit h-full relative">
              <img
                src={img}
                alt={`Project Image ${i + 1}`}
                className="w-32 h-32 object-cover rounded mb-1"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(img)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded"
              >
                <IoCloseCircleSharp />
              </button>
            </div>
          ))}
        </div>
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />
        <input
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="GitHub Link"
          className="w-full p-2 border rounded"
        />
        <input
          name="youtube"
          value={form.youtube}
          onChange={handleChange}
          placeholder="YouTube iframe embed code"
          className="w-full p-2 border rounded"
        />
        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <div className="border rounded p-2 bg-gray-50">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={
                  editor.isActive("bold")
                    ? "font-bold bg-blue-100 px-2 rounded"
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
                    ? "italic bg-blue-100 px-2 rounded"
                    : "px-2"
                }
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={
                  editor.isActive("underline")
                    ? "underline bg-blue-100 px-2 rounded"
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
                    ? "line-through bg-blue-100 px-2 rounded"
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
                    ? "font-bold bg-blue-100 px-2 rounded"
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
                    ? "font-bold bg-blue-100 px-2 rounded"
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
                    ? "font-bold bg-blue-100 px-2 rounded"
                    : "px-2"
                }
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={
                  editor.isActive("bulletList")
                    ? "bg-blue-100 px-2 rounded"
                    : "px-2"
                }
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={
                  editor.isActive("orderedList")
                    ? "bg-blue-100 px-2 rounded"
                    : "px-2"
                }
              >
                1. List
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={
                  editor.isActive("blockquote")
                    ? "bg-blue-100 px-2 rounded"
                    : "px-2"
                }
              >
                ❝
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={
                  editor.isActive("codeBlock")
                    ? "bg-blue-100 px-2 rounded"
                    : "px-2"
                }
              >
                {"<>"}
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="px-2"
              >
                ―
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={
                  editor.isActive("link") ? "bg-blue-100 px-2 rounded" : "px-2"
                }
              >
                🔗
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Image URL");
                  if (url) editor.chain().focus().setImage({ src: url }).run();
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
                    ? "bg-blue-100 px-2 rounded"
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
                    ? "bg-blue-100 px-2 rounded"
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
                    ? "bg-blue-100 px-2 rounded"
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
            </div>
            <EditorContent
              editor={editor}
              className="tiptap-content min-h-[300px] p-3 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded font-bold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-400 text-white rounded"
      >
        Back
      </button>
    </div>
  );
};

export default EditSourceCodeAdmin;
