import { useEffect, useState } from "react";
import { deleteImage } from "../../lib/cloundinary";
import useToast from "../../hooks/toast-hook";
import { useLoading } from "../../lib/loading-context";
import { AnimatePresence, motion } from "framer-motion";

const Media = () => {
  const [images, setImages] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    publicId: null,
  });

  // Toast context
  const { showToast } = useToast();

  // Loading context
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    // Fetch images from Cloudinary folder
    const fetchImages = async () => {
      showLoading();
      const response = await fetch(
        "/.netlify/functions/get-cloudinary-images",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        console.error("Error fetching images:", response.statusText);

        hideLoading();
        return;
      }
      const data = await response.json();
      setImages(Array.isArray(data) ? data : []);
      hideLoading();
    };
    fetchImages();
    hideLoading();
  }, []);

  const handleDelete = async (public_id) => {
    setConfirmDelete({ show: true, publicId: public_id });
  };

  const confirmDeleteImage = async () => {
    if (!confirmDelete.publicId) return;
    try {
      await deleteImage(confirmDelete.publicId);
    } catch (error) {
      showToast("error", "Error deleting image from Cloudinary");
      console.error("Error deleting image:", error);
      setConfirmDelete({ show: false, publicId: null });
      return;
    }
    setImages((imgs) =>
      imgs.filter((img) => img.public_id !== confirmDelete.publicId)
    );
    setConfirmDelete({ show: false, publicId: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        COMMENTS
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage your comments and delete unwanted ones.
      </p>
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
                Are you sure you want to delete this image?
              </p>
              <div className="text-xs text-[#154D71] break-all mb-2">
                {confirmDelete.publicId}
              </div>
              <div className="flex gap-4 justify-center mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                  onClick={confirmDeleteImage}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-200 text-[#154D71] px-4 py-2 rounded hover:bg-gray-300 font-bold"
                  onClick={() =>
                    setConfirmDelete({ show: false, publicId: null })
                  }
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
        {images.map((img) => (
          <div
            key={img.public_id}
            className="bg-white/80 rounded-xl shadow p-4 flex flex-col items-center"
          >
            <img
              src={img.secure_url}
              alt={img.public_id}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div className="text-xs text-[#154D71] mb-2 break-all">
              {img.public_id}
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(img.public_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
