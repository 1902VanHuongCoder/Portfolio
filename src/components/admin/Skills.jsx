import { useEffect, useState } from "react";
import useToast from "../../hooks/toast-hook";
import { uploadImage } from "../../lib/cloundinary";
import { AnimatePresence, motion } from "framer-motion";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { createSkill, deleteSkill, getAllSkills, updateSkill } from "../../lib/skill-apis";
import { useLoading } from "../../lib/loading-context";

const ManipulateOnSkills = () => {
  // State for managing skills
  const [skills, setSkills] = useState();

  // State for managing individual skill being edited
  const [skill, setSkill] = useState({ show: false, sId: "" });

  // State for managing add skill dialog
  const [showAddDialog, setShowAddDialog] = useState(false);

  // State for managing form data for adding/editing skills
  const [formData, setFormData] = useState({
    tech: "",
    logoTechLink: "",
  });

  // State for managing delete confirmation dialog
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
    imgName: null,
  });

  // State for managing data to update
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

  // Toast for notifications
  const { showToast } = useToast();

  // Loading spinner
  const { showLoading, hideLoading } = useLoading();

  // Handle updating a skill
  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    showLoading();
    let dataToSaveToFirebase;

    // Check if a new logo file is being uploaded
    if (checkIfFile(dataToUpdate.logoTechLink)) {
      try {
        // Upload new logo to Cloudinary and get secure_url and public_id
        const { secure_url, public_id } = await uploadImage(
          dataToUpdate.logoTechLink
        );
        // Set the data to save to Firebase
        dataToSaveToFirebase = {
          tech: dataToUpdate.tech,
          logoTechLink: secure_url,
          techLogoName: public_id,
        };
      } catch (error) {
        showToast("error", "Error uploading image!");
        console.error("Error uploading file: ", error);
        hideLoading();
        return;
      }

      try {
        // Update the skill document in Firestore
        await updateSkill(skill.sId, dataToSaveToFirebase);

        // Show success toast and refetch skills
        const updatedSkills = await getAllSkills();
        setSkills(updatedSkills);
        setSkill({ show: false, sId: "" });
        showToast("success", "Updated skill successfully!");
      } catch (error) {
        showToast("error", "Error updating skill!");
        console.log("Error" + error);
      }
    } else {
      // Update only text info
      const dataToSaveToFirebase = {
        tech: dataToUpdate.tech,
      };
      try {
        await updateSkill(skill.sId, dataToSaveToFirebase);
        setSkill({show:false, sId:""});
        showToast("success", "Updated skill successfully!");
        const updatedSkills = await getAllSkills();
        setSkills(updatedSkills);
      } catch (error) {
        showToast("error", "Error updating skill!");
        console.error("Error updating skill", error);
      }
    }
    hideLoading();
  };

  // Handle adding a new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    showLoading();

    // Check if a logo file is being uploaded
    if (formData.logoTechLink) {
      let dataToSaveToFirebase;
      try {
        // Upload logo to Cloudinary
        const { secure_url, public_id } = await uploadImage(
          formData.logoTechLink
        );
        dataToSaveToFirebase = {
          tech: formData.tech,
          logoTechLink: secure_url,
          techLogoName: public_id,
        };
      } catch (error) {
        showToast("error", "Error uploading image!");
        console.error("Error uploading file: ", error);
        hideLoading();
        return;
      }

      try {
        await createSkill(dataToSaveToFirebase);
        const updatedSkills = await getAllSkills();
        setSkills(updatedSkills);
        setShowAddDialog(false);
        showToast("success", "Added new skill successfully!");
      } catch (error) {
        showToast("error", "Error adding skill! Form data issue.");
        console.error("Error adding document: ", error);
      }
    } else {
      showToast("error", "No image uploaded!");
    }
    hideLoading();
  };

  // Handle deleting a skill
  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      const updatedSkills = await getAllSkills();
      setSkills(updatedSkills);
      showToast("success", "Deleted skill successfully!");
    } catch (error) {
      showToast("error", "Error deleting skill!");
      console.error("Error deleting document: ", error);
    }
  };

  // Fetch all skills on mount
  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getAllSkills();
      setSkills(usersData);
      console.log(usersData);
    };
    fetchData();
  }, []);


  // Set data to update when a skill is selected
  useEffect(() => {
    if (skill.sId !== "") {
      const skillData = skills.find((item) => item.id === skill.sId);
      setDataToUpdate(skillData);
    } else {
      return;
    }
  }, [skill.sId, skills]);

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
              onSubmit={handleUpdateSkill}
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

      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        MY SKILLS
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage your skills, add new ones, and update existing ones.
      </p>
      <p className="w-full p-6 px-6 font-semibold text-white flex justify-between items-center">
        <span className="text-xl"> Skills</span>
        <button
          className="bg-white text-[#33A1E0] px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 hover:text-white transition"
          onClick={() => setShowAddDialog((prev) => !prev)}
        >
          <FaPlus /> Add Skill
        </button>
      </p>
      <AnimatePresence>
        {showAddDialog && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleAddSkill}
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

      <div className="w-full px-2 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
        {skills && skills.length > 0 ? (
          skills.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-[#33A1E0]/20 rounded-xl flex flex-row items-center justify-between gap-x-4 px-4 transition hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="w-[100px] h-16 flex items-center justify-center">
                <img
                  src={item.logoTechLink}
                  alt={item.tech}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="font-bold text-md text-white truncate w-full text-left">
                {item.tech}
              </div>
              <div className="flex flex-row items-center gap-2 w-full justify-end">
                <button
                  onClick={() => {
                    setSkill({ sId: item.id, show: true });
                  }}
                  className="font-bold p-2 rounded-lg transition duration-200 text-white flex items-center gap-x-2 border-gray-200 border bg-[#154D71]/80 hover:bg-[#33A1E0]/80"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() =>
                    setConfirmDelete({
                      show: true,
                      id: item.id,
                      imgName: item.techLogoName,
                    })
                  }
                  className="flex items-center justify-center gap-x-2 text-red-100 font-bold p-2 rounded-lg transition duration-200 border-red-200 border bg-red-500/80 hover:bg-red-600/80"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center text-white">
            No skills found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManipulateOnSkills;
