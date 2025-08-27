import { useState, useMemo, useRef, useEffect } from 'react';
import { db, storage } from '../../firebase_setup/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaRegTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const ManipulateOnBlogs = () => {
  const quillRef = useRef();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      quill.insertEmbed(range.index, 'image', url);
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
    const storageRef = ref(storage, `blog-thumbnails/${Date.now()}-${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'code-block'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadImage();
      await addDoc(collection(db, 'blogPosts'), {
        title,
        date,
        content,
        imageUrl,
        createdAt: new Date()
      });
      alert('Blog post added successfully!');
      setTitle('');
      setDate('');
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error adding blog post: ', error);
      alert('Error adding blog post. Please try again.');
    }
  };

  const fetchBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    const blogsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogsData);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      fetchBlogs();
    } catch (error) {
      alert('Error deleting blog post.');
      console.error('Error deleting blog post: ', error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] py-8">
      <AnimatePresence>
        {confirmDelete.show && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-xs w-full shadow-2xl flex flex-col gap-4 text-center"
            >
              <p className="text-lg font-semibold text-[#154D71]">
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
                  className="bg-gray-200 text-[#154D71] px-4 py-2 rounded hover:bg-gray-300 font-bold"
                  onClick={() => setConfirmDelete({ show: false, id: null })}
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto mt-10">
        <form onSubmit={handleSubmit} className="mb-10 p-5 bg-white/80 rounded-xl shadow-xl border border-[#33A1E0]/20 backdrop-blur-md">
          <p className="text-xl font-semibold text-[#154D71] mb-4">Thêm bài viết mới</p>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-bold text-[#154D71]">Tiêu đề bài viết</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0]"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 font-bold text-[#154D71]">Ngày tạo bài viết</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0]"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 font-bold text-[#154D71]">Ảnh tiêu đề</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0]"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 max-w-full h-auto max-h-64 object-contain rounded shadow" />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 font-bold text-[#154D71]">Nội dung bài viết</label>
            <ReactQuill
              value={content}
              ref={quillRef}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-64 mb-10"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 mt-2 bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200 font-bold">
            Đăng bài viết
          </button>
        </form>

        {/* Blog List Table */}
        <div className="w-full min-w-[600px] px-2 sm:px-0 overflow-x-auto mt-10">
          <table className="w-full bg-white/90 border border-[#33A1E0]/20 rounded-md shadow-xl">
            <thead className="border-b-[2px]">
              <tr className="text-[#1178b3] text-sm leading-normal">
                <th className="py-6 px-4 text-center">Số Thứ Tự</th>
                <th className="py-6 px-4 text-left">Tiêu đề</th>
                <th className="py-6 px-4 text-left">Ngày tạo</th>
                <th className="py-6 px-4 text-left">Ảnh tiêu đề</th>
                <th className="py-6 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="text-black text-sm">
              {blogs.map((item, index) => (
                <tr className="hover:bg-[#33A1E0]/10 transition-all" key={item.id}>
                  <td className="py-3 px-4 border-b border-[#33A1E0]/10 font-bold text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                    {item.date}
                  </td>
                  <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-md border border-[#33A1E0]/20"
                      />
                    )}
                  </td>
                  <td className="flex flex-col sm:flex-row justify-center items-center gap-2 py-3 px-4 border-b border-[#33A1E0]/10">
                    <button
                      onClick={() => alert('Chức năng cập nhật blog sẽ được bổ sung!')}
                      className="font-bold py-2 px-4 rounded-lg transition duration-200 text-slate-600 flex items-center gap-x-2 border-slate-600 border"
                    >
                      <FaPencilAlt />
                      Update
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ show: true, id: item.id })}
                      className="flex items-center justify-center gap-x-2 text-red-500 font-bold py-2 px-4 rounded-lg transition duration-200 border-red-500 border"
                    >
                      <FaRegTrashAlt />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManipulateOnBlogs;
