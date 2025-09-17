import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link as ReactLink } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
import { IoClose } from "react-icons/io5";
import { deleteImage, uploadImage } from "../../lib/cloundinary";
import useToast from "../../hooks/toast-hook";
import { useLoading } from "../../lib/loading-context";
import { Color, TextStyle } from "@tiptap/extension-text-style";

const EditSourceCodeAdmin = () => {
  // Get project ID from URL parameters
  const { id } = useParams();

  const navigate = useNavigate();

  // Toast notifications
  const { showToast } = useToast();

  // Loading state
  const { showLoading, hideLoading } = useLoading();

  // Form state
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    images: [],
    editorImages: [],
    price: "",
    github: "",
    content: "",
    youtube: "",
  });

  const [localImages, setLocalImages] = useState([]); // local previews
  const [editorLocalImages, setEditorLocalImages] = useState([]); // for editor upload
  const [imageUploadInput, setImageUploadInput] = useState(null);

  // Ref to track if content has been set => Prevent change editor content on every render 
  const hasSetContent = useRef(false);

  // State to manage main project images that were removed
  const [removedImages, setRemovedImages] = useState([]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, "sourceProjects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({ ...data });
      }
    };
    fetchProject();
  }, [id]);

  // Initialize editor
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handle image upload for editor,
  const handleEditorImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = `local-img-${Date.now()}`;
    setEditorLocalImages((prev) => [...prev, { file, url, id }]);
    editor.chain().focus().setImage({ src: url, alt: id }).run();
    e.target.value = "";
  };

  const handleDeleteImage = (i) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
    setRemovedImages((prev) => [...prev, form.images[i]]);
  };

  // Function to get all images url from text editor to check which images are no longer used
  const getAllImagesInTextEditor = () => {
    const htmlContent = editor.getHTML();
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");
    return Array.from(images).map((img) => img.src);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    showLoading();

    try {
      // Upload new local project images
      let images = [...form.images];
      let editorImages = [...form.editorImages];
      let content = form.content;
      if (localImages.length > 0) {
        for (const img of localImages) {
          const { secure_url, public_id } = await uploadImage(img.file);
          if (secure_url) images.push({ secure_url, public_id });
        }
      }

      if (editorLocalImages.length > 0) {
        // Upload new editor images
        let htmlContent = editor.getHTML();
        let updatedHtml = htmlContent;
        const newEditorImages = [];
        for (const img of editorLocalImages) {
          const { secure_url, public_id } = await uploadImage(img.file);
          updatedHtml = updatedHtml.replaceAll(img.url, secure_url);
          newEditorImages.push({ secure_url, public_id });
        }
        editor.commands.setContent(updatedHtml, false);
        content = editor.getJSON();
        editorImages = [...editorImages, ...newEditorImages];
      }

      // Get all used image URLs in the text editor
      const allUsedEditorImageUrls = getAllImagesInTextEditor();
      // Filter editorImages to only those still used
      const editorImagesAfterChanges = Array.isArray(editorImages)
        ? editorImages.filter((img) =>
            allUsedEditorImageUrls.includes(img.secure_url)
          )
        : [];

      // Find and delete unused editor images from Cloudinary
      const imagesWereRemoved = Array.isArray(editorImages)
        ? editorImages.filter(
            (img) => !allUsedEditorImageUrls.includes(img.secure_url)
          )
        : [];
      if (imagesWereRemoved.length > 0) {
        for (const img of imagesWereRemoved) {
          try {
            await deleteImage(img.public_id);
          } catch (error) {
            console.error("Error deleting unused editor image:", error);
          }
        }
      }

      // Handle removed main project images (delete from Cloudinary)
      if (removedImages.length > 0) {
        for (const img of removedImages) {
          try {
            await deleteImage(img.public_id);
          } catch (error) {
            console.error("Error deleting removed project image:", error);
          }
        }
      }

      // Save only images that are still in use (project images)
      // (Assume images array is already filtered by handleDeleteImage)

      const projectData = {
        ...form,
        images: images,
        editorImages: editorImagesAfterChanges,
        content: content,
      };

      await updateDoc(doc(db, "sourceProjects", id), projectData);
      showToast("success", "Project updated successfully");
      setEditorLocalImages([]);
      setRemovedImages([]);
      navigate(-1);
    } catch (err) {
      console.error(err);
      showToast("error", "Error updating project");
    }

    hideLoading();
  };

  // Update editor content when form.content changes
  useEffect(() => {
    if (editor && form.content && !hasSetContent.current) {
      editor.commands.setContent(form.content);
      hasSetContent.current = true;
    }
  }, [editor , form.content]);

  if (!editor) return null;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        SOURCE CODE PROJECTS - EDIT PROJECT
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage your source code projects for sale, add new ones,
        and update existing ones.
      </p>
      <form onSubmit={handleSave} className="mt-6 text-white px-6 mb-8">
        {/* Title + Subtitle */}
        <div className="flex items-center gap-x-4">
          <div className="mb-4 w-full">
            <label className="block mb-2 font-bold">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded bg-transparent text-white"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block mb-2 font-bold">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded bg-transparent text-white"
            />
          </div>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block mb-2 font-bold">Project Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const previews = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
              }));
              setLocalImages((prev) => [...prev, ...previews]);
              e.target.value = "";
            }}
            className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded bg-transparent text-white"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.secure_url}
                  alt="project"
                  className="w-20 h-20 object-cover rounded border border-white/30"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                >
                  <IoClose />
                </button>
              </div>
            ))}
            {localImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="preview"
                className="w-20 h-20 object-cover rounded border border-white/30"
              />
            ))}
          </div>
        </div>

        {/* Price + Github */}
        <div className="flex items-center gap-x-4">
          <div className="mb-4 w-full">
            <label className="block mb-2 font-bold">Price</label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded bg-transparent text-white"
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block mb-2 font-bold">GitHub Link</label>
            <input
              type="text"
              name="github"
              value={form.github}
              onChange={handleChange}
              className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded bg-transparent text-white"
            />
          </div>
        </div>

        {/* Youtube */}
        <div className="mb-4">
          <label className="block mb-2 font-bold">
            YouTube iframe embed code
          </label>
          <input
            type="text"
            name="youtube"
            value={form.youtube}
            onChange={handleChange}
            className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded bg-transparent text-white"
          />
        </div>

        {/* Editor */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Content</label>
          <div className="border-[2px] border-[#33A1E0]/30 rounded p-2 bg-white/10">
            {/* toolbar same as add page */}
            <div className="flex flex-wrap gap-2 mb-2 bg-black/20 p-2 rounded-md">
              {/* Bold, Italic, Underline, etc... same as add page */}
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
                  editor.isActive("italic") ? "italic bg-white/30 px-2" : "px-2"
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
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={
                  editor.isActive("bulletList") ? "bg-white/30 px-2" : "px-2"
                }
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={
                  editor.isActive("orderedList") ? "bg-white/30 px-2" : "px-2"
                }
              >
                1. List
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
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
                  editor.isActive("link") ? "bg-white/30 px-2" : "px-2"
                }
              >
                🔗
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
              {/* Add rest of toolbar like in add page... */}
              <button
                type="button"
                onClick={() => imageUploadInput && imageUploadInput.click()}
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
            </div>
            <EditorContent
              editor={editor}
              className="tiptap-content min-h-[300px] px-1 focus:outline-none rounded-br-md rounded-bl-md focus:border-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-x-2">
          <ReactLink
            to="/admin/source-code"
            type="button"
            className=" text-white font-semibold px-4 py-2 rounded-md border border-white shadow hover:opacity-80 transition"
          >
            Discard Changes
          </ReactLink>
          <button
            type="submit"
            className="bg-white text-[#33A1E0] font-semibold px-4 py-2 rounded-md border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 hover:text-white transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSourceCodeAdmin;
