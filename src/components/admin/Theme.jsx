import { useEffect, useState } from "react";
import { db } from "../../firebase_setup/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import useToast from "../../hooks/toast-hook";
import { useLoading } from "../../lib/loading-context";

const Theme = () => {
  // Custom hook for showing toast notifications
  const { showToast } = useToast();

  // State to hold loading status
  const { showLoading, hideLoading } = useLoading();

  // State to hold themes
  const [themes, setThemes] = useState([]);

  // State to hold theme ID to support updates and deletions
  const [themeId, setThemeId] = useState({ show: false, id: "" });

  // State to hold form data for adding themes
  const [formData, setFormData] = useState({
    themeName: "",
    themeSlug: "",
    startDate: "",
    endDate: "",
    isShow: false,
  });

  // State to control the visibility of the add theme dialog
  const [showAddDialog, setShowAddDialog] = useState(false);

  // State to control the visibility of the delete confirmation dialog
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  // State to hold data for updating themes
  const [dataToUpdate, setDataToUpdate] = useState({
    themeName: "",
    themeSlug: "",
    startDate: "",
    endDate: "",
    isShow: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDataToUpdate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateTheme = async (e) => {
    e.preventDefault();
    showLoading();

    try {
      // If setting this theme to show, hide all other themes first
      if (dataToUpdate.isShow) {
        const batch = [];
        themes.forEach((theme) => {
          if (theme.id !== themeId.id && theme.isShow) {
            batch.push(updateDoc(doc(db, "themes", theme.id), { isShow: false }));
          }
        });
        await Promise.all(batch);
      }

      const docRef = doc(db, "themes", themeId.id);
      await updateDoc(docRef, dataToUpdate);
      showToast("success", "Theme updated successfully!");
      await fetchThemes();
    } catch (error) {
      showToast("error", "Error updating theme!");
      console.error("Error updating theme", error);
    }
    hideLoading();
    setThemeId({ id: "", show: false });
  };

  const handleCreateNewTheme = async (e) => {
    e.preventDefault();
    showLoading();

    try {
      // If setting this theme to show, hide all other themes first
      if (formData.isShow) {
        const batch = [];
        themes.forEach((theme) => {
          if (theme.isShow) {
            batch.push(updateDoc(doc(db, "themes", theme.id), { isShow: false }));
          }
        });
        await Promise.all(batch);
      }

      await addDoc(collection(db, "themes"), formData);
      await fetchThemes();
      showToast("success", "Added theme successfully!");
      setFormData({
        themeName: "",
        themeSlug: "",
        startDate: "",
        endDate: "",
        isShow: false,
      });
    } catch (error) {
      showToast("error", "Failed to add theme!");
      console.error("Error adding document: ", error);
    }
    hideLoading();
    setShowAddDialog(false);
  };

  const handleDeleteTheme = async (id) => {
    showLoading();
    try {
      await deleteDoc(doc(db, "themes", id));
      showToast("success", "Theme deleted successfully!");
      await fetchThemes();
    } catch (error) {
      console.error("Error deleting document: ", error);
      showToast("error", "Error deleting theme!");
    }
    hideLoading();
  };

  const fetchThemes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "themes"));
      const themesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setThemes(themesData);
    } catch (error) {
      console.error("Error fetching themes: ", error);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    if (themeId.id !== "") {
      const themeToEdit = themes.find((theme) => theme.id === themeId.id);
      if (themeToEdit) {
        setDataToUpdate(themeToEdit);
      }
    }
  }, [themeId.id, themes]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      {/* Update Modal */}
      <AnimatePresence>
        {themeId.show && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleUpdateTheme}
              className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-3 relative"
            >
              <button
                type="button"
                onClick={() => setThemeId({ id: "", show: false })}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                aria-label="Close"
              >
                <IoClose />
              </button>
              <h2 className="text-lg font-bold mb-2 text-[#154D71]">
                Update Theme
              </h2>
              <input
                type="text"
                name="themeName"
                value={dataToUpdate.themeName}
                onChange={handleChange}
                placeholder="Theme name"
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
                required
              />
              <input
                type="text"
                name="themeSlug"
                value={dataToUpdate.themeSlug}
                onChange={handleChange}
                placeholder="Theme slug (e.g., new-year)"
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={dataToUpdate.startDate}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                    className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={dataToUpdate.endDate}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                    className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
                    required
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isShow"
                  checked={dataToUpdate.isShow}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#33A1E0]"
                />
                <span className="text-gray-700">Show this theme</span>
              </label>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold py-2 rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200 mt-2"
              >
                Update Theme
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
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
                Xác nhận xóa theme?
              </p>
              <div className="flex gap-4 justify-center mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                  onClick={async () => {
                    await handleDeleteTheme(confirmDelete.id);
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

      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        THEME MANAGEMENT
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage website themes, add new ones, and update existing
        ones.
      </p>

      <AnimatePresence>
        {showAddDialog && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleCreateNewTheme}
              className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-3 relative"
            >
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                aria-label="Close"
              >
                <IoClose />
              </button>
              <h2 className="text-lg font-bold mb-2 text-[#154D71]">
                Add New Theme
              </h2>
              <label htmlFor="themeName" className="flex flex-col">
                <span className="text-gray-700">Theme Name</span>
                <input
                  type="text"
                  className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
                  value={formData.themeName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      themeName: e.target.value,
                    })
                  }
                  placeholder="Enter theme name"
                  required
                />
              </label>
              <label htmlFor="themeSlug" className="flex flex-col">
                <span className="text-gray-700">Theme Slug</span>
                <input
                  type="text"
                  className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
                  value={formData.themeSlug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      themeSlug: e.target.value,
                    })
                  }
                  placeholder="e.g., new-year"
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="startDate" className="flex flex-col">
                  <span className="text-gray-700">Start Date</span>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label htmlFor="endDate" className="flex flex-col">
                  <span className="text-gray-700">End Date</span>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isShow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isShow: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#33A1E0]"
                />
                <span className="text-gray-700">Show this theme</span>
              </label>
              <button
                className="mt-4 bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold py-2 px-4 rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200"
                type="submit"
              >
                Submit
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="w-full p-6 px-6 font-semibold text-white flex justify-between items-center">
        <span className="text-xl">Themes</span>
        <button
          className="bg-white text-[#33A1E0] px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 hover:text-white transition"
          onClick={() => setShowAddDialog((prev) => !prev)}
        >
          <FaPlus /> Add Theme
        </button>
      </p>

      <div className="w-full px-4 overflow-x-auto mb-10">
        <table className="w-[1024px] md:w-full bg-white/10 backdrop-blur-sm border shadow-xl font-sans border-[#33A1E0]/20 rounded-md overflow-hidden">
          <thead className="">
            <tr className="text-white text-sm leading-normal border-b border-[#33A1E0]/20 bg-[#002b5b]">
              <th className="py-6 px-4 text-center">Order</th>
              <th className="py-6 px-4 text-left">Theme Name</th>
              <th className="py-6 px-4 text-left">Theme Slug</th>
              <th className="py-6 px-4 text-center">Start Date</th>
              <th className="py-6 px-4 text-center">End Date</th>
              <th className="py-6 px-4 text-center">Showing</th>
              <th className="py-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm">
            {themes?.map((item, index) => (
              <tr
                className="hover:bg-[#33A1E0]/10 transition-all border-b border-[#33A1E0]/20"
                key={index}
              >
                <td className="py-3 px-4 text-center">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </td>
                <td className="py-3 px-4">{item.themeName}</td>
                <td className="py-3 px-4">
                  <code className="bg-white/10 px-2 py-1 rounded text-xs">
                    {item.themeSlug}
                  </code>
                </td>
                <td className="py-3 px-4 text-center">{item.startDate}</td>
                <td className="py-3 px-4 text-center">{item.endDate}</td>
                <td className="py-3 px-4 text-center">
                  {item.isShow ? (
                    <span className="bg-green-500/80 px-2 py-1 rounded text-xs font-bold">
                      Yes
                    </span>
                  ) : (
                    <span className="bg-gray-500/80 px-2 py-1 rounded text-xs">
                      No
                    </span>
                  )}
                </td>
                <td className="flex flex-col sm:flex-row justify-center items-center gap-2 py-3">
                  <button
                    onClick={() => {
                      setThemeId({ id: item.id, show: true });
                    }}
                    className="font-bold py-2 px-4 rounded-lg transition duration-200 text-white flex items-center gap-x-2 border-gray-200 border bg-[#154D71]/80 hover:bg-[#33A1E0]/80"
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        show: true,
                        id: item.id,
                      })
                    }
                    className="flex items-center justify-center gap-x-2 text-red-100 font-bold py-2 px-4 rounded-lg transition duration-200 border-red-200 border bg-red-500/80 hover:bg-red-600/80"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Theme;