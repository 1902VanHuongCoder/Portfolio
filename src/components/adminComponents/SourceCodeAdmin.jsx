import { useState } from "react";
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
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
import { db } from "../../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";

const SourceCodeAdmin = () => {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    images: [],
    price: "",
    github: "",
    content: "",
    youtube: "",
  });
  const [projects, setProjects] = useState([]);
  const [imageInput, setImageInput] = useState("");
  const [editId, setEditId] = useState(null);
  const router = useNavigate();
  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    images: [],
    price: "",
    github: "",
    content: "",
    youtube: "",
  });
  const editEditor = useEditor({
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
    content: editForm.content,
    onUpdate: ({ editor }) => {
      setEditForm((f) => ({ ...f, content: editor.getHTML() }));
    },
  });
  const refreshProjects = async () => {
    const snapshot = await getDocs(collection(db, "sourceProjects"));
    setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

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

  // Fetch projects on mount
  useState(() => {
    getDocs(collection(db, "sourceProjects")).then((snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageInput) {
      setForm((f) => ({ ...f, images: [...f.images, imageInput] }));
      setImageInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "sourceProjects"), form);
    setForm({
      title: "",
      subtitle: "",
      images: [],
      price: "",
      github: "",
      content: "",
    });
    await refreshProjects();
  };

  const handleEdit = (proj) => {
    router(`/admin/dashboard/edit/source-code/${proj.id}`);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleEditImageChange = (i, value) => {
    setEditForm((f) => ({ ...f, images: f.images.map((img, idx) => (idx === i ? value : img)) }));
  };

  const handleEditSave = async (id) => {
    const docRef = doc(db, "sourceProjects", id);
    await updateDoc(docRef, editForm);
    setEditId(null);
    await refreshProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "sourceProjects", id));
      await refreshProjects();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Add New Project for Sale</h2>
      <form
        onSubmit={handleSubmit}
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
        <div className="flex gap-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Image URL"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Image
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="project"
              className="w-20 h-20 object-cover rounded"
            />
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
        >
          Add Project
        </button>
      </form>
      <h3 className="text-2xl font-bold mb-4">Project List</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
          >
            {editId === proj.id ? (
              <>
                <div className="flex gap-2 overflow-x-auto">
                  {editForm.images.map((img, i) => (
                    <input
                      key={i}
                      value={img}
                      onChange={e => handleEditImageChange(i, e.target.value)}
                      className="w-32 p-1 border rounded mb-1"
                    />
                  ))}
                </div>
                <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full p-2 border rounded" />
                <input name="subtitle" value={editForm.subtitle} onChange={handleEditChange} className="w-full p-2 border rounded" />
                <input name="price" value={editForm.price} onChange={handleEditChange} className="w-full p-2 border rounded" />
                <input name="github" value={editForm.github} onChange={handleEditChange} className="w-full p-2 border rounded" />
                <input name="youtube" value={editForm.youtube} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="YouTube iframe embed code" />
                <div>
                  <label className="block mb-1 font-semibold">Content</label>
                  <div className="border rounded p-2 bg-gray-50">
                    {/* Toolbar */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button type="button" onClick={() => editEditor.chain().focus().toggleBold().run()} className={editEditor.isActive("bold") ? "font-bold bg-blue-100 px-2 rounded" : "px-2"}>B</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleItalic().run()} className={editEditor.isActive("italic") ? "italic bg-blue-100 px-2 rounded" : "px-2"}>I</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleUnderline().run()} className={editEditor.isActive("underline") ? "underline bg-blue-100 px-2 rounded" : "px-2"}>U</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleStrike().run()} className={editEditor.isActive("strike") ? "line-through bg-blue-100 px-2 rounded" : "px-2"}>S</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleHeading({ level: 1 }).run()} className={editEditor.isActive("heading", { level: 1 }) ? "font-bold bg-blue-100 px-2 rounded" : "px-2"}>H1</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleHeading({ level: 2 }).run()} className={editEditor.isActive("heading", { level: 2 }) ? "font-bold bg-blue-100 px-2 rounded" : "px-2"}>H2</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleHeading({ level: 3 }).run()} className={editEditor.isActive("heading", { level: 3 }) ? "font-bold bg-blue-100 px-2 rounded" : "px-2"}>H3</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleBulletList().run()} className={editEditor.isActive("bulletList") ? "bg-blue-100 px-2 rounded" : "px-2"}>• List</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleOrderedList().run()} className={editEditor.isActive("orderedList") ? "bg-blue-100 px-2 rounded" : "px-2"}>1. List</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleBlockquote().run()} className={editEditor.isActive("blockquote") ? "bg-blue-100 px-2 rounded" : "px-2"}>❝</button>
                      <button type="button" onClick={() => editEditor.chain().focus().toggleCodeBlock().run()} className={editEditor.isActive("codeBlock") ? "bg-blue-100 px-2 rounded" : "px-2"}>{"<>"}</button>
                      <button type="button" onClick={() => editEditor.chain().focus().setHorizontalRule().run()} className="px-2">―</button>
                      <button type="button" onClick={() => { const url = prompt("Enter URL"); if (url) editEditor.chain().focus().setLink({ href: url }).run(); }} className={editEditor.isActive("link") ? "bg-blue-100 px-2 rounded" : "px-2"}>🔗</button>
                      <button type="button" onClick={() => { const url = prompt("Image URL"); if (url) editEditor.chain().focus().setImage({ src: url }).run(); }} className="px-2">🖼️</button>
                      <button type="button" onClick={() => editEditor.chain().focus().setTextAlign("left").run()} className={editEditor.isActive({ textAlign: "left" }) ? "bg-blue-100 px-2 rounded" : "px-2"}>⯇</button>
                      <button type="button" onClick={() => editEditor.chain().focus().setTextAlign("center").run()} className={editEditor.isActive({ textAlign: "center" }) ? "bg-blue-100 px-2 rounded" : "px-2"}>≡</button>
                      <button type="button" onClick={() => editEditor.chain().focus().setTextAlign("right").run()} className={editEditor.isActive({ textAlign: "right" }) ? "bg-blue-100 px-2 rounded" : "px-2"}>⯈</button>
                      <button type="button" onClick={() => editEditor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="px-2">▦</button>
                    </div>
                    <EditorContent
                      editor={editEditor}
                      className="tiptap-content min-h-[300px] p-3 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEditSave(proj.id)} className="px-4 py-1 bg-green-500 text-white rounded">Save</button>
                  <button onClick={() => setEditId(null)} className="px-4 py-1 bg-gray-400 text-white rounded">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 overflow-x-auto">
                  {proj.images &&
                    proj.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="project"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                </div>
                <h4 className="text-xl font-bold">{proj.title}</h4>
                <p className="text-gray-600">{proj.subtitle}</p>
                <p className="text-blue-700 font-semibold">Price: {proj.price}</p>
                <a
                  href={proj.github}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                {proj.youtube && (
                  <div className="my-2">
                    <div dangerouslySetInnerHTML={{ __html: proj.youtube }} />
                  </div>
                )}
                {/* <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: proj.content }}
                /> */}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(proj)} className="px-4 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(proj.id)} className="px-4 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceCodeAdmin;
