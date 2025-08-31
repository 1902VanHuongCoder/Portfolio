import { useEffect, useState } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import {
  collection,
  addDoc,
  getDocs,
  // setDoc,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ManipulateOnSkills = () => {
  const [skills, setSkills] = useState();
  const [skill, setSkill] = useState({ show: false, sId: "" });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    tech: "",
    logoTechLink: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
    imgName: null,
  });

  const [dataToUpdate, setDataToUpdate] = useState({
    logoTechLink: null,
    tech: "",
    techLogoName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataToUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDataToUpdate((prev) => ({ ...prev, logoTechLink: e.target.files[0] }));
  };

  const checkIfFile = (value) => {
    return value && typeof value === "object";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkIfFile(dataToUpdate.logoTechLink)) {
      const desertRef = ref(storage, `skills/${dataToUpdate.techLogoName}`);
      try {
        await deleteObject(desertRef);
        const storageRef = ref(
          storage,
          `skills/${dataToUpdate.logoTechLink.name}`
        );
        await uploadBytes(storageRef, dataToUpdate.logoTechLink);
        const downloadURL = await getDownloadURL(storageRef);
        const dataToSaveToFirebase = {
          tech: dataToUpdate.tech,
          logoTechLink: downloadURL,
          techLogoName: dataToUpdate.logoTechLink.name,
        };
        const docRef = doc(db, "skills", skill.sId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Cập nhật skills thành công!");
      } catch (error) {
        console.log("Error" + error);
      }
    } else {
      const dataToSaveToFirebase = {
        tech: dataToUpdate.tech,
      };
      try {
        const docRef = doc(db, "skills", skill.sId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Cập nhật skill thành công!");
      } catch (error) {
        console.error("Cập nhật không thành công", error);
      }
    }
  };

  const uploadImageToFirebase = async (e) => {
    e.preventDefault();
    if (formData.logoTechLink) {
      const storageRef = ref(storage, `skills/${formData.logoTechLink.name}`);
      try {
        await uploadBytes(storageRef, formData.logoTechLink);
        const downloadURL = await getDownloadURL(storageRef);
        const dataToSaveToFirebase = {
          tech: formData.tech,
          logoTechLink: downloadURL,
          techLogoName: formData.logoTechLink.name,
        };
        try {
          await addDoc(collection(db, "skills"), dataToSaveToFirebase);
          window.location.reload();
        } catch (error) {
          alert("Thêm skills không thành công! Lỗi dữ liệu form.");
          console.error("Error adding document: ", error);
        }
      } catch (error) {
        alert("Thêm skill không thành công do lỗi upload hình ảnh!");
        console.error("Error uploading file: ", error);
      }
    } else {
      alert("Chưa thêm hình!");
    }
  };

  const handleDeleteSkill = async (id, techLogoName) => {
    try {
      await deleteDoc(doc(db, "skills", id));
      const desertRef = ref(storage, `skills/${techLogoName}`);
      try {
        await deleteObject(desertRef);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting image: ", error);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "skills"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(usersData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (skill.sId !== "") {
      const fetchProject = async () => {
        const docRef = doc(db, "skills", skill.sId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDataToUpdate(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      fetchProject();
    } else {
      return;
    }
  }, [skill.sId]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      {/* Update Modal */}
      <AnimatePresence>
        {skill.show && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3 relative"
            >
              <button
                type="button"
                onClick={() => setSkill({ sId: "", show: false })}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                aria-label="Close"
              >
                <IoClose />
              </button>
              <h2 className="text-lg font-bold mb-2 text-[#154D71]">
                Update Skill
              </h2>
              <input
                type="text"
                name="tech"
                value={dataToUpdate.tech}
                onChange={handleChange}
                placeholder="Technology"
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold py-2 rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200 mt-2"
              >
                Update Skill
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
                Xác nhận xóa skill?
              </p>
              <div className="flex gap-4 justify-center mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                  onClick={async () => {
                    await handleDeleteSkill(
                      confirmDelete.id,
                      confirmDelete.imgName
                    );
                    setConfirmDelete({ show: false, id: null, imgName: null });
                  }}
                >
                  Xóa
                </button>
                <button
                  className="bg-gray-200 text-[#154D71] px-4 py-2 rounded hover:bg-gray-300 font-bold"
                  onClick={() =>
                    setConfirmDelete({ show: false, id: null, imgName: null })
                  }
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="w-full text-4xl p-6 font-extrabold text-white drop-shadow-xl border-b-[1px] ">
        MY SKILLS
      </h1>
      <p className="w-full p-6 font-bold text-white flex justify-between items-center">
        <span className="text-xl"> Skills List</span>
        <button
          className="bg-[#33A1E0]/10 text-white px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 transition"
          onClick={() => setShowAddDialog(true)}
        >
          <FaPlus /> Add Skills
        </button>
      </p>
      <AnimatePresence>
        {showAddDialog && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={uploadImageToFirebase}
              className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3 relative"
            >
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                aria-label="Close"
              >
                {/* Icon */}
                 <IoClose />
              </button>
              <h2 className="text-lg font-bold mb-2 text-[#154D71]">
                Add New Skill
              </h2>
              <label htmlFor="tech" className="flex flex-col">
                <span className="text-gray-700">Technology</span>
                <input
                  type="text"
                  className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
                  value={formData.tech}
                  onChange={(e) =>
                    setFormData({ ...formData, tech: e.target.value })
                  }
                  placeholder="Enter technology"
                  required
                />
              </label>
              <label htmlFor="logoTechLink" className="flex flex-col">
                <span className="text-gray-700">Choose skill logo</span>
                <input
                  type="file"
                  className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      logoTechLink: e.target.files[0],
                    })
                  }
                  required
                />
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

      <div className="w-full px-2 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
        {skills?.map((item, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm border border-[#33A1E0]/20 rounded-xl shadow-xl flex flex-col items-center p-6 transition hover:scale-[1.03] hover:shadow-2xl"
          >
            <img
              src={item.logoTechLink}
              alt={item.tech}
              className="w-16 h-16 rounded-md border border-[#33A1E0]/20 mb-4 bg-white/40 object-contain"
            />
            <div className="font-bold text-lg text-white mb-2 truncate w-full text-center">
              {item.tech}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full justify-center">
              <button
                onClick={() => {
                  setSkill({ sId: item.id, show: true });
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
                    imgName: item.techLogoName,
                  })
                }
                className="flex items-center justify-center gap-x-2 text-red-100 font-bold py-2 px-4 rounded-lg transition duration-200 border-red-200 border bg-red-500/80 hover:bg-red-600/80"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManipulateOnSkills;
