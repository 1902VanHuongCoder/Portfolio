import { useState, useMemo, useRef } from 'react';
import { db, storage } from '../../firebase_setup/firebase';
import { collection, addDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManipulateOnBlogs = () => {
  const quillRef = useRef();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Insert image into editor
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
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
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
      window.location.href = "/blogs"
    } catch (error) {
      console.error('Error adding blog post: ', error);
      alert('Error adding blog post. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Form thêm bài viết */}
      <form onSubmit={handleSubmit} className="mb-10 p-5 bg-white rounded shadow">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-bold">Tiêu đề bài viết</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-2 font-bold">Ngày tạo bài viết</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block mb-2 font-bold">Ảnh tiêu đề</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 max-w-full h-auto max-h-64 object-contain" />
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 font-bold">Nội dung bài viết</label>
          <ReactQuill
            value={content}
            ref={quillRef}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="h-64 mb-10"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Đăng bài viết
        </button>
      </form>
    </div>
  );
};

export default ManipulateOnBlogs;
