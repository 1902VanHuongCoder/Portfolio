import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase_setup/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
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
import useToast from "../../hooks/toast-hook";
import { useLoading } from "../../lib/loading-context";
import { deleteImage, uploadImage } from "../../lib/cloundinary";
import { MdDateRange } from "react-icons/md";

const UpdateBlog = () => {
  // Toast context
  const { showToast } = useToast();
  // Loading context
  const { showLoading, hideLoading } = useLoading();

  // Route parameters
  const { id } = useParams();

  // Navigation
  const navigate = useNavigate();

  // State for blog data
  const [blog, setBlog] = useState(null);

  // State to manage updates data
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [, setUpdateContent] = useState("");
  const [updateImageFile, setUpdateImageFile] = useState(null);
  const [updateImagePreview, setUpdateImagePreview] = useState(null);

  // State to show old content before changes
  const [content, setContent] = useState("");

  // State to manage image upload input
  const [imageUploadInput, setImageUploadInput] = useState(null);

  // State to manage local images inserted in the editor
  const [editorLocalImages, setEditorLocalImages] = useState([]); // {file, url, id}

  // All editor images
  const [allEditorImages, setAllEditorImages] = useState([]); // [{secure_url, public_id},...]

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

  // Function to replace all local images in text editor with Cloudinary url after uploading
  const replaceLocalImageInTextEditor = async (imagesArray) => {
    let htmlContent = editor.getHTML();
    let updatedHtml = htmlContent;
    let editorImages = [];
    for (const img of imagesArray) {
      try {
        const { secure_url, public_id } = await uploadImage(img.file);
        updatedHtml = updatedHtml.replaceAll(img.url, secure_url);
        editorImages.push({ secure_url, public_id });
      } catch {
        showToast("error", "Error uploading image in text editor");
      }
    }
    editor.commands.setContent(updatedHtml, false);
    return { editorImages };
  };

  // Function to get all images url from text editor to check which images are no longer used
  const getAllImagesInTextEditor = () => {
    const htmlContent = editor.getHTML();
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");
    return Array.from(images).map((img) => img.src);
  };

  // Handle form submission to update blog
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    showLoading();
    if (!blog) return;

    // Check if user add new images into text editor, if so, system has to upload all local images to Cloud, get url and replace into content to ensure images are showed when deploying
    if (editorLocalImages.length > 0) {
      await replaceLocalImageInTextEditor(editorLocalImages);

      // Delete old images that are no longer used in the text editor
      const allUsedImages = getAllImagesInTextEditor(); // Return url array
      const unusedImages = allEditorImages.filter(
        // Filter out unused images
        (img) => !allUsedImages.includes(img.secure_url)
      );

      // Loop unusedImages to delete from Cloudinary
      for (const img of unusedImages) {
        try {
          await deleteImage(img.public_id);
        } catch (error) {
          console.error("Error deleting unused image from Cloudinary: ", error);
        }
      }
    }

    try {
      let imageUrl = blog.image || "";
      let publicID = blog.publicID || "";
      let newImageIsUploadedToCloud = false;
      if (!updateImagePreview) {
        showToast("error", "No image uploaded");
        hideLoading();
        return;
      }

      if (updateImageFile) {
        // Upload new image to Cloundinary and get secure_url and image's public ID
        const { secure_url, public_id } = await uploadImage(updateImageFile);

        if (!secure_url && !public_id) {
          showToast("error", "Error uploading image.");
        }

        imageUrl = secure_url;
        publicID = public_id;
        newImageIsUploadedToCloud = true;
      }

      // Delete old image from Cloudinary
      if (newImageIsUploadedToCloud && blog.publicID) {
        try {
          await deleteImage(blog.publicID);
        } catch (error) {
          console.error("Error deleting old blog image from Cloudinary: ", error);
        }
      }

      const blogDocRef = doc(db, "blogPosts", blog.id);
      await updateDoc(blogDocRef, {
        title: updateTitle,
        date: updateDate,
        content: content,
        image: imageUrl,
        publicID: publicID,
      });

      showToast("success", "Blog post updated successfully!");
      navigate(-1);
    } catch (error) {
      showToast("error", "Error updating blog post.");
      console.error("Error updating blog post: ", error);
    }
    hideLoading();
  };

  useEffect(() => {
    const fetchBlog = async () => {
      showLoading();
      const docRef = doc(db, "blogPosts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBlog({ id, ...data });
        setUpdateTitle(data.title || "");
        setUpdateDate(data.date || "");
        setUpdateContent(data.content || "");
        setUpdateImagePreview(data.image || null);
        setContent(data.content || "");
        setAllEditorImages(data.editorImages || []);
      }
      hideLoading();
    };
    if (id) fetchBlog();
  }, [hideLoading, id, showLoading]);

  useEffect(() => {
    if (editor && content !== null) {
      try {
        editor.commands.setContent(JSON.parse(content));
        console.log(JSON.parse(content));
      } catch {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        UPDATE BLOG POST
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can update the blog post details.
      </p>
      <form
        onSubmit={handleUpdateBlog}
        className="rounded-xl p-5 w-full shadow-2xl flex flex-col gap-3 relative"
      >
        <div className="lg:flex gap-x-4">
          <label className="flex flex-col w-full">
            <span className="block mb-2 font-bold text-white">Title</span>
            <input
              type="text"
              className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              required
            />
          </label>
          <div className=" mb-4 w-full text-white">
            <label htmlFor="date" className="block mb-2 font-bold">
              Date Created
            </label>
            <div className="relative ">
              <input
                type="date"
                id="date"
                value={updateDate}
                onChange={(e) => setUpdateDate(e.target.value)}
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-white bg-transparent"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 ">
                <MdDateRange />
              </span>
            </div>
          </div>
        </div>
        <label className="flex flex-col">
          <span className="block mb-2 font-bold text-white">
            Featured Image
          </span>
          <input
            type="file"
            className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0] text-white"
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
          <span className="block mb-2 font-bold text-white">Blog Content</span>
          <div className="border-[2px] border-[#33A1E0]/30 rounded p-2 text-white">
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
