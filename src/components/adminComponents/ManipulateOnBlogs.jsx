import { useState, useMemo, useRef, useEffect } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoClose } from "react-icons/io5";

const ManipulateOnBlogs = () => {
  const quillRef = useRef();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateBlog, setUpdateBlog] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateImageFile, setUpdateImageFile] = useState(null);
  const [updateImagePreview, setUpdateImagePreview] = useState(null);
  // Handle update image preview
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

  // Open update modal and set state
  const openUpdateModal = (blog) => {
    setUpdateBlog(blog);
    setUpdateTitle(blog.title);
    setUpdateDate(blog.date);
    setUpdateContent(blog.content);
    setUpdateImagePreview(blog.imageUrl || null);
    setUpdateImageFile(null);
    setShowUpdate(true);
  };

  // Update blog in Firestore
  const handleUpdateBlog = async (e) => {
    alert("Updating blog...");
    e.preventDefault();
    try {
      let imageUrl = updateBlog.imageUrl || null;
      if (updateImageFile) {
        const storageRef = ref(
          storage,
          `blog-thumbnails/${Date.now()}-${updateImageFile.name}`
        );
        await uploadBytes(storageRef, updateImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, "blogPostsUpdateLog"), {
        blogId: updateBlog.id,
        oldTitle: updateBlog.title,
        oldContent: updateBlog.content,
        oldDate: updateBlog.date,
        oldImageUrl: updateBlog.imageUrl,
        updatedAt: new Date(),
      }); // Optional: log update
      const blogDocRef = doc(db, "blogPosts", updateBlog.id);
      await updateDoc(blogDocRef, {
        title: updateTitle,
        date: updateDate,
        content: updateContent,
        imageUrl,
      });
      setShowUpdate(false);
      setUpdateBlog(null);
      fetchBlogs();
      alert("Blog post updated successfully!");
    } catch (error) {
      alert("Error updating blog post.");
      console.error("Error updating blog post: ", error);
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      quill.insertEmbed(range.index, "image", url);
      quill.setSelection(range.index + 1);
    };
  };

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

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "code-block"],
          ["clean"],
          // Add color palette for text
          [{ color: [] }],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "code-block",
    "color",
  ];

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
      await deleteDoc(doc(db, "blogPosts", id));
      fetchBlogs();
    } catch (error) {
      alert("Error deleting blog post.");
      console.error("Error deleting blog post: ", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-4xl p-4 font-extrabold text-white drop-shadow-xl border-b-[1px]">
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
            <div
              className="bg-white/50 rounded shadow"
              style={{ minHeight: 256 }}
            >
              <ReactQuill
                value={content}
                ref={quillRef}
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{
                  height: 400,
                  background: "rgba(255,255,255,.8)",
                  color: "black",
                  border: "none",
                }}
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
                <button
                  onClick={() => openUpdateModal(item)}
                  className="font-bold py-2 px-4 rounded-lg transition duration-200 text-slate-600 flex items-center gap-x-2 border-slate-600 border bg-white hover:bg-[#33A1E0]/10"
                >
                  <FaPencilAlt />
                  Update
                </button>
                {/* Update Blog Modal */}
                <AnimatePresence>
                  {showUpdate && (
                    <motion.div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-50 px-5">
                      <motion.form
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onSubmit={handleUpdateBlog}
                        className="bg-white rounded-xl p-5 w-full shadow-2xl flex flex-col gap-3 relative"
                      >
                        <button
                          type="button"
                          onClick={() => setShowUpdate(false)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                          aria-label="Close"
                        >
                          <IoClose />
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
                            <img
                              src={updateImagePreview}
                              alt="Preview"
                              className="h-20 w-auto object-cover"
                            />
                          )}
                        </div>
                       
                        <label className="flex flex-col">
                          <span className="text-gray-700">Blog Content</span>
                          <div
                            className="bg-white/50 rounded shadow"
                            style={{ minHeight: 256 }}
                          >
                            <ReactQuill
                              value={updateContent}
                              onChange={setUpdateContent}
                              modules={modules}
                              formats={formats}
                              style={{
                                height: 200,
                                background: "rgba(255,255,255,.8)",
                                color: "black",
                                border: "none",
                              }}
                            />
                          </div>
                        </label>
                        <div className="flex justify-end gap-x-2 mt-2">
                          <button
                            type="button"
                            className="bg-gray-200 text-[#154D71] font-bold px-4 py-2 rounded-lg shadow hover:bg-gray-300"
                            onClick={() => setShowUpdate(false)}
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
                      </motion.form>
                    </motion.div>
                  )}
                </AnimatePresence>
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
