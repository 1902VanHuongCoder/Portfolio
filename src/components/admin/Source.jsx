import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
import { db } from "../../firebase_setup/firebase";
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
import useToast from "../../hooks/toast-hook";
import { useLoading } from "../../lib/loading-context";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { deleteImage, uploadImage } from "../../lib/cloundinary";
import { IoClose } from "react-icons/io5";

const SourceCodeAdmin = () => {
  // Toast context
  const { showToast } = useToast();

  // Loading context
  const { showLoading, hideLoading } = useLoading();

  // Form state for new project
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    images: [],
    price: "",
    github: "",
    content: "",
    youtube: "",
  });

  // State to store all projects
  const [projects, setProjects] = useState([]);

  // State to manage deletion confirmation
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  // State to manage image upload input
  const [imageUploadInput, setImageUploadInput] = useState(null);

  // State to manage local image previews for project images
  const [localImages, setLocalImages] = useState([]);

  // State to manage local images inserted in the editor
  const [editorLocalImages, setEditorLocalImages] = useState([]); // {file, url, id}

  // Function to refetch projects
  const refreshProjects = async () => {
    const snapshot = await getDocs(collection(db, "sourceProjects"));
    setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Editor for creating new project content
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
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((f) => ({ ...f, content: editor.getJSON() }));
    },
  });

  // Insert local image into editor and track it
  const handleEditorImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = `local-img-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    setEditorLocalImages((prev) => [...prev, { file, url, id }]);
    // Insert image with unique id as src (so we can find/replace later)
    editor.chain().focus().setImage({ src: url, alt: id }).run();
    e.target.value = "";
  };

  // Function to format price input from 1000000 => 1.000.000
  const formatPrice = (value) => {
    // Remove non-digits
    const num = value.replace(/\D/g, "");
    // Format with dots
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && !isNaN(value)) {
      setForm((f) => ({ ...f, price: formatPrice(value) }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle adding new project
  const handleAddNewProject = async (e) => {
    e.preventDefault();
    showLoading();
    // Upload all local project images to Cloudinary
    let editorImages = [];
    let projectImages = [];
    for (const img of localImages) {
      try {
        const { secure_url, public_id } = await uploadImage(img.file);
        if (secure_url) projectImages.push({ secure_url, public_id });
      } catch (err) {
        showToast("error", "Error uploading image");
        console.error(err);
      }
    }

    // Upload all local editor images to Cloudinary and replace in editor content
    let htmlContent = editor.getHTML();
    let updatedHtml = htmlContent;
    for (const img of editorLocalImages) {
      try {
        const { secure_url, public_id } = await uploadImage(img.file);
        // Replace local url with Cloudinary url in HTML
        updatedHtml = updatedHtml.replaceAll(img.url, secure_url);
        editorImages.push({ secure_url: secure_url, public_id: public_id });
      } catch (err) {
        showToast("error", "Error uploading editor image");
        console.error(err);
      }
    }
    // Set editor content to updated HTML (with Cloudinary URLs)
    editor.commands.setContent(updatedHtml, false);

    // Save JSON content after replacement
    const finalContent = editor.getJSON();

    const projectData = {
      ...form,
      images: projectImages,
      editorImages: editorImages,
      content: finalContent,
    };

    console.log("Final project data to add: ", projectData);
    
    await addDoc(collection(db, "sourceProjects"), projectData);
    setForm({
      title: "",
      subtitle: "",
      images: [],
      price: "",
      github: "",
      content: "",
      youtube: "",
    });
    setLocalImages([]);
    setEditorLocalImages([]);
    await refreshProjects();
    hideLoading();
    showToast("success", "Project added successfully");
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ show: true, id });
  };

  // Confirm deletion of a project
  const confirmDeleteProject = async () => {
    showLoading();
    if (confirmDelete.id) {
      // Delete all images from Cloudinary
      const project = projects.find((p) => p.id === confirmDelete.id);
      if (project) {
        const imagesNeedToDelete = [project.images, project.editorImages].flat();
        imagesNeedToDelete.forEach(async (img) => {
          try {
            await deleteImage(img.public_id);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        });
      }
      try {
        await deleteDoc(doc(db, "sourceProjects", confirmDelete.id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
      await refreshProjects();
      setConfirmDelete({ show: false, id: null });
      showToast("success", "Project deleted successfully");
    }
    hideLoading();
  };

  const cancelDelete = () => {
    setConfirmDelete({ show: false, id: null });
  };

  // Fetch projects on mount
  useEffect(() => {
    getDocs(collection(db, "sourceProjects")).then((snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        SOURCE CODE PROJECTS
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage your source code projects for sale, add new ones,
        and update existing ones.
      </p>
      <div className="mx-auto mt-6 px-6 text-white">
        <form onSubmit={handleAddNewProject} className="mb-10">
          <div className="flex items-center gap-x-4">
            <div className="mb-4 w-full">
              <label htmlFor="title" className="block mb-2 font-bold">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border-[#33A1E0]/30 border-[2px] rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
                required
                placeholder="Enter title"
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="subtitle" className="block mb-2 font-bold">
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border-[#33A1E0]/30 border-[2px] rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
                placeholder="Enter subtitle"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="images" className="block mb-2 font-bold">
              Project Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                // Add to localImages for preview
                const previews = files.map((file) => ({
                  file,
                  url: URL.createObjectURL(file),
                }));
                setLocalImages((prev) => [...prev, ...previews]);
                e.target.value = "";
              }}
              className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {localImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img.url}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded border border-white/30"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                    onClick={() => {
                      setLocalImages((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      );
                    }}
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <div className="mb-4 w-full">
              <label htmlFor="price" className="block mb-2 font-bold">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border-[#33A1E0]/30 border-[2px] rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
                placeholder="Enter price"
              />
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="github" className="block mb-2 font-bold">
                GitHub Link
              </label>
              <input
                type="text"
                id="github"
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full px-3 py-2 border-[#33A1E0]/30 border-[2px] rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
                placeholder="Enter GitHub link"
              />
            </div>
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="youtube" className="block mb-2 font-bold">
              YouTube iframe embed code
            </label>
            <input
              type="text"
              id="youtube"
              name="youtube"
              value={form.youtube}
              onChange={handleChange}
              className="w-full px-3 py-2 border-[#33A1E0]/30 border-[2px] rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
              placeholder="YouTube iframe embed code"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Content</label>
            <div className="border-[2px] border-[#33A1E0]/30 rounded p-2 bg-white/10">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-2 bg-black/20 p-2 rounded-md">
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
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
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
                    editor.isActive("bulletList") ? "bg-white/30 px-2" : "px-2"
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
                    editor.isActive("orderedList") ? "bg-white/30 px-2" : "px-2"
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
                    editor.isActive("blockquote") ? "bg-white/30 px-2" : "px-2"
                  }
                >
                  ❝
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={
                    editor.isActive("codeBlock") ? "bg-white/30 px-2" : "px-2"
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
                  onClick={() => imageUploadInput && imageUploadInput.click()}
                  className="px-2"
                  title="Upload Image"
                >
                  🖼️
                </button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(el) => setImageUploadInput(el)}
                  onChange={handleEditorImageUpload}
                />
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
                  className="w-5 h-5 p-0"
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
              <div
                tabIndex={0}
                onClick={() => editor && editor.commands.focus()}
                className="tiptap-content min-h-[300px] px-1 focus:outline-none rounded-br-md rounded-bl-md focus:border-none cursor-text"
                style={{ outline: "none" }}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-[#33A1E0] font-semibold px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 hover:text-white transition"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
      {/* Project List Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 mb-8 border-t-[1px] border-white/30 py-6 px-6">
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            className="bg-transparent border border-[#33A1E0]/20 rounded-xl shadow-xl flex flex-col items-center transition-all p-4"
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-xs text-white font-bold">#{index + 1}</span>
              <span className="text-xs text-white">
                {proj.price ? `Price: ${proj.price}` : ""}
              </span>
            </div>
            <div className="w-full h-[150px] my-3 flex gap-2 overflow-x-auto">
              {proj.images && proj.images.length > 0 ? (
                <img
                  src={proj.images[0].secure_url}
                  alt="project"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-white">
                  <p>No image available</p>
                </div>
              )}
            </div>
            <div className="font-bold text-lg text-white mb-2 truncate w-full text-center">
              {proj.title}
            </div>
            <div className="text-white text-sm mb-2 w-full text-center truncate">
              {proj.subtitle}
            </div>
            <div className="flex flex-row items-center gap-2 mt-2 w-full justify-center">
              <ReactLink
                to={`/admin/edit/source-code/${proj.id}`}
                className="font-bold py-1 px-2 rounded-lg transition duration-200 text-white flex items-center gap-x-2 border-white border "
                rel="noopener noreferrer"
              >
                <FaPencilAlt />
                Update
              </ReactLink>
              <button
                onClick={() => handleDelete(proj.id)}
                className="flex items-center justify-center gap-x-2 text-red-500 font-bold py-1 px-2 rounded-lg transition duration-200 border-red-500 border bg-white hover:bg-red-100"
              >
                <FaRegTrashAlt />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-center max-w-xs w-full">
            <p className="text-lg font-semibold">
              Are you sure you want to delete this project?
            </p>
            <div className="flex gap-4 justify-center mt-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                onClick={confirmDeleteProject}
              >
                Delete
              </button>
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-bold"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceCodeAdmin;
