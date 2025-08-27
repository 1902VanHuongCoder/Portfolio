import { useEffect, useState } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
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

const ManipulateOnProjects = () => {
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, imgName: null });
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState();
  const [projectId, setProjectId] = useState({ show: false, pId: "" });
  const [formData, setFormData] = useState({
    projectName: "",
    demoLink: "",
    githubLink: "",
    completeTime: "",
    projectImage: "",
  });

  const [dataToUpdate, setDataToUpdate] = useState({
    projectName: "",
    demoLink: "",
    githubLink: "",
    completeTime: "",
    projectImage: null,
    projectImgName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataToUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDataToUpdate((prev) => ({ ...prev, projectImage: e.target.files[0] }));
  };

  const checkIfFile = (value) => {
    return value && typeof value === "object";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Handle submit run....");

    if (checkIfFile(dataToUpdate.projectImage)) {
      console.log("If chay");

      const desertRef = ref(storage, `projects/${dataToUpdate.projectImgName}`);

      try {
        // Delete the existing file
        await deleteObject(desertRef);
        console.log(`${dataToUpdate.projectImgName} deleted successfully.`);

        const storageRef = ref(
          storage,
          `projects/${dataToUpdate.projectImage.name}`
        );

        // Upload the new file
        await uploadBytes(storageRef, dataToUpdate.projectImage);
        console.log("File uploaded successfully.");

        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Preparing data to save to Firebase
        const dataToSaveToFirebase = {
          projectName: dataToUpdate.projectName,
          demoLink: dataToUpdate.demoLink,
          githubLink: dataToUpdate.githubLink,
          completeTime: dataToUpdate.completeTime,
          projectImage: downloadURL,
          projectImgName: dataToUpdate.projectImage.name, // Make sure to use the name from the uploaded image
        };

        // Update Firestore document
        const docRef = doc(db, "projects", projectId.pId);
        await updateDoc(docRef, dataToSaveToFirebase);

        alert("Project updated successfully!");
      } catch (error) {
        console.log("Error" + error);
        // console.error("Error during delete/upload/update process", error);
      }
    } else {
      // If no new project image, just update the other fields

      console.log("else chay");
      const dataToSaveToFirebase = {
        projectName: dataToUpdate.projectName,
        demoLink: dataToUpdate.demoLink,
        githubLink: dataToUpdate.githubLink,
        completeTime: dataToUpdate.completeTime,
        projectImgName: dataToUpdate.projectImgName, // Only name, not image
      };

      try {
        const docRef = doc(db, "projects", projectId.pId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Project updated successfully!");
      } catch (error) {
        console.error("Error updating project without new image: ", error);
      }

      // console.log("No new image found!");
    }
  };

  const uploadImageToFirebase = async (e) => {
    e.preventDefault();
    if (!formData.projectImage) return;
    const storageRef = ref(storage, `projects/${formData.projectImage.name}`);
    try {
      await uploadBytes(storageRef, formData.projectImage);
      const downloadURL = await getDownloadURL(storageRef);
      const dataToSaveToFirebase = {
        projectName: formData.projectName,
        demoLink: formData.demoLink,
        githubLink: formData.githubLink,
        completeTime: formData.completeTime,
        projectImage: downloadURL,
        projectImgName: formData.projectImage.name,
      };
      try {
        await addDoc(collection(db, "projects"), dataToSaveToFirebase);
        window.location.reload();
      } catch (error) {
        alert("Thêm dự án không thành công do lỗi tham số!");
        console.error("Error adding document: ", error);
      }
    } catch (error) {
      alert("Thêm dự án không thành công do upload hình ảnh!");
      console.error("Error uploading file: ", error);
    }
  };

  const handleDeleteProject = async (id, projectImgName) => {
    try {
      // Step 1: Delete the Firestore document
      await deleteDoc(doc(db, "projects", id));
      console.log(`Document with ID ${id} deleted successfully.`);

      // Step 2: Create a reference to the image in Firebase Storage
      const desertRef = ref(storage, `projects/${projectImgName}`);

      try {
        // Step 3: Delete the image file from Firebase Storage
        await deleteObject(desertRef);
        console.log(`${projectImgName} deleted successfully.`);
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
      const querySnapshot = await getDocs(collection(db, "projects"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(usersData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (projectId.pId !== "") {
      const fetchProject = async () => {
        const docRef = doc(db, "projects", projectId.pId);
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
  }, [projectId]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] py-8">
      <AnimatePresence>
        {projectId.show && (
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
                onClick={() => setProjectId({ pId: "", show: false })}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-[#154D71]">
                Update Project
              </h2>
              <input
                type="text"
                name="projectName"
                value={dataToUpdate.projectName}
                onChange={handleChange}
                placeholder="Project name"
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
              />
              <input
                type="text"
                name="demoLink"
                value={dataToUpdate.demoLink}
                onChange={handleChange}
                placeholder="Demo Link"
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
              />
              <input
                type="text"
                name="githubLink"
                value={dataToUpdate.githubLink}
                onChange={handleChange}
                placeholder="GitHub Link"
                className="block w-full p-2 border border-[#33A1E0]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#33A1E0]"
              />
              <input
                type="text"
                name="completeTime"
                value={dataToUpdate.completeTime}
                onChange={handleChange}
                placeholder="Completion Time"
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
                Update Project
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="w-full text-4xl text-center p-4 font-extrabold text-white drop-shadow-xl">
        CÁC THAO TÁC VỚI DỰ ÁN
      </h1>
      <button
        className="fixed bottom-5 right-5 bg-white p-4 rounded-full hover:bg-[#33A1E0] hover:text-white transition duration-200] shadow-lg border border-[#33A1E0]/30"
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        <FaPlus />
      </button>
      {showAddForm && (
        <form
          onSubmit={uploadImageToFirebase}
          className="flex flex-col gap-y-4 p-6 bg-white shadow-xl w-full border border-[#33A1E0]/20 mt-2 mx-auto max-w-4xl  rounded-md"
        >
          <p className="text-xl font-semibold">Add New Project</p>
          <label htmlFor="projectName" className="flex flex-col">
            <span className="text-gray-700">Project name</span>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
              placeholder="Enter project name"
              required
            />
          </label>

          <label htmlFor="demoLink" className="flex flex-col">
            <span className="text-gray-700">Demo link</span>
            <input
              type="url"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={formData.demoLink}
              onChange={(e) =>
                setFormData({ ...formData, demoLink: e.target.value })
              }
              placeholder="Enter demo link"
              required
            />
          </label>

          <label htmlFor="githubLink" className="flex flex-col">
            <span className="text-gray-700">Github link</span>
            <input
              type="url"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={formData.githubLink}
              onChange={(e) =>
                setFormData({ ...formData, githubLink: e.target.value })
              }
              placeholder="Enter GitHub link"
              required
            />
          </label>

          <label htmlFor="completeTime" className="flex flex-col">
            <span className="text-gray-700">Complete time</span>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={formData.completeTime}
              onChange={(e) =>
                setFormData({ ...formData, completeTime: e.target.value })
              }
              placeholder="Enter complete time"
              required
            />
          </label>

          <label htmlFor="projectImage" className="flex flex-col">
            <span className="text-gray-700">Choose project image</span>
            <input
              type="file"
              className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, projectImage: e.target.files[0] })
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
        </form>
      )}

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
                Xác nhận xóa dự án?
              </p>
              <div className="flex gap-4 justify-center mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                  onClick={async () => {
                    await handleDeleteProject(
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

      <p className="w-full p-6 font-bold text-xl mt-4 text-white">
        DANH SÁCH CÁC DỰ ÁN
      </p>

      <div className="w-full min-w-[1070px] px-2 sm:px-6 overflow-x-auto">
        <table className="w-full bg-white border border-[#33A1E0]/20 rounded-md shadow-xl">
          <thead className="border-b-[2px]">
            <tr className="text-[#1178b3] text-sm leading-normal">
              <th className="py-6 px-4 text-center">Số Thứ Tự</th>
              <th className="py-6 px-4 text-left">Tên Dự Án</th>
              <th className="py-6 px-4 text-left">Demo Link</th>
              <th className="py-6 px-4 text-left">Github Link</th>
              <th className="py-6 px-4 text-left">Ảnh Dự Án</th>
              <th className="py-6 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="text-black text-sm">
            {projects?.map((item, index) => (
              <tr className="hover:bg-[#33A1E0]/10 transition-all" key={index}>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10 font-bold text-center">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                  {item.projectName}
                </td>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                  <a
                    href={item.demoLink}
                    className="text-[#33A1E0] hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem Demo
                  </a>
                </td>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                  <a
                    href={item.githubLink}
                    className="text-[#33A1E0] hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem Github
                  </a>
                </td>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                  <img
                    src={item.projectImage}
                    alt={item.imageName}
                    className="w-10 h-10 rounded-md border border-[#33A1E0]/20"
                  />
                </td>
                <td className="flex flex-col sm:flex-row justify-center items-center gap-2 py-3 px-4 border-b border-[#33A1E0]/10">
                  <button
                    onClick={() => {
                      setProjectId({ pId: item.id, show: true });
                    }}
                    className=" font-bold py-2 px-4 rounded-lg transition duration-200 text-slate-600 flex items-center gap-x-2 border-slate-600 border"
                  >
                    <FaPencilAlt />
                    Update
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        show: true,
                        id: item.id,
                        imgName: item.projectImgName,
                      })
                    }
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
  );
};

export default ManipulateOnProjects;
