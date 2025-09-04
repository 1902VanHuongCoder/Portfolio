import { useEffect, useState } from "react";
import { deleteImage } from "../../lib/cloundinary";

const CLOUDINARY_SEARCH_URL = "https://api.cloudinary.com/v1_1/" + import.meta.env.VITE_CLOUDINARY_CLOUD_NAME + "/resources/search";
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

const Media = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch images from Cloudinary folder
  const fetchImages = async () => {
    setLoading(true);
    const query = {
      expression: "folder:paulto-porfolio",
      max_results: 100,
    };
    const response = await fetch(CLOUDINARY_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          btoa(CLOUDINARY_API_KEY + ":" + CLOUDINARY_API_SECRET),
      },
      body: JSON.stringify(query),
    });
    const data = await response.json();
    setImages(data.resources || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (public_id) => {
    if (!window.confirm("Delete this image?")) return;
    await deleteImage(public_id);
    setImages((imgs) => imgs.filter((img) => img.public_id !== public_id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Cloud Images Manager</h1>
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.public_id} className="bg-white/80 rounded-xl shadow p-4 flex flex-col items-center">
              <img
                src={img.secure_url}
                alt={img.public_id}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <div className="text-xs text-[#154D71] mb-2 break-all">{img.public_id}</div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(img.public_id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;