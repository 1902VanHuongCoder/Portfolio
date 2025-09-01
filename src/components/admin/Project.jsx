import { useEffect, useState } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
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
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
    imgName: null,
  });
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
      console.log(usersData);
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

  // Filtering state and logic
  const [filterName, setFilterName] = useState("");

  const filteredProjects = projects
    ? projects.filter((item) => {
        const nameMatch = item.projectName
          .toLowerCase()
          .includes(filterName.toLowerCase());
        return nameMatch;
      })
    : [];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0]">
      <h1 className="w-full text-2xl p-6 pt-6 pb-2 font-extrabold text-white drop-shadow-xl">
        MY PROJECTS
      </h1>
      <p className="w-full text-sm px-6 pb-6 font-medium text-white/80 drop-shadow-xl border-b-[1px] border-b-white/20">
        Here you can manage your projects, add new ones, and update existing
        ones.
      </p>
      <AnimatePresence>
        {projectId.show && (
          <motion.div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-4 bg-white shadow-xl w-full border border-[#33A1E0]/20 mt-2 mx-auto max-w-4xl rounded-md relative"
            >
              <div className="border-b border-gray-300 pb-4 p-6">
                <p className="text-xl font-semibold">Update Project</p>
                <p className="text-gray-600">
                  Edit the fields below to update your project
                </p>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <label
                    htmlFor="updateProjectName"
                    className="flex flex-col w-full"
                  >
                    <span className="text-gray-700">Project name</span>
                    <input
                      id="updateProjectName"
                      type="text"
                      name="projectName"
                      className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                      value={dataToUpdate.projectName}
                      onChange={handleChange}
                      placeholder="Enter project name"
                      required
                    />
                  </label>
                  <label
                    htmlFor="updateDemoLink"
                    className="flex flex-col w-full"
                  >
                    <span className="text-gray-700">Demo link</span>
                    <input
                      id="updateDemoLink"
                      type="url"
                      name="demoLink"
                      className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                      value={dataToUpdate.demoLink}
                      onChange={handleChange}
                      placeholder="Enter demo link"
                      required
                    />
                  </label>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <label
                    htmlFor="updateGithubLink"
                    className="flex flex-col w-full"
                  >
                    <span className="text-gray-700">Github link</span>
                    <input
                      id="updateGithubLink"
                      type="url"
                      name="githubLink"
                      className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                      value={dataToUpdate.githubLink}
                      onChange={handleChange}
                      placeholder="Enter GitHub link"
                      required
                    />
                  </label>
                  <label
                    htmlFor="updateCompleteTime"
                    className="flex flex-col w-full"
                  >
                    <span className="text-gray-700">Complete time</span>
                    <input
                      id="updateCompleteTime"
                      type="date"
                      name="completeTime"
                      className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                      value={dataToUpdate.completeTime}
                      onChange={handleChange}
                      placeholder="Enter complete time"
                      required
                    />
                  </label>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-700 mb-1">
                    Choose project image
                  </span>
                  <div
                    className="mt-1 border border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-blue-50 transition min-h-[100px]"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setDataToUpdate((prev) => ({
                          ...prev,
                          projectImage: file,
                        }));
                      }
                    }}
                    onClick={() =>
                      document.getElementById("updateProjectImageInput").click()
                    }
                  >
                    {dataToUpdate.projectImage &&
                    typeof dataToUpdate.projectImage === "object" ? (
                      <span className="text-green-600 font-semibold">
                        {dataToUpdate.projectImage.name}
                      </span>
                    ) : dataToUpdate.projectImgName ? (
                      <span className="text-blue-600 font-semibold">
                        {dataToUpdate.projectImgName}
                      </span>
                    ) : (
                      <span className="flex gap-x-2 items-center text-gray-400">
                        <span>
                          <FaRegImage />
                        </span>
                        <span className="text-gray-400">
                          Drag & drop or click to select image
                        </span>
                      </span>
                    )}
                    <input
                      id="updateProjectImageInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setDataToUpdate((prev) => ({
                            ...prev,
                            projectImage: file,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-x-2">
                  <button
                    className="text-red-500 border-red-500 border py-2 px-4 rounded-md transition duration-200"
                    type="button"
                    onClick={() => setProjectId({ pId: "", show: false })}
                  >
                    Close
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold py-2 px-4 rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200"
                    type="submit"
                  >
                    Update Project
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      {showAddForm && (
        <div className="fixed w-full h-full top-0 left-0 bg-black/30 flex justify-center items-center z-10">
          <form
            onSubmit={uploadImageToFirebase}
            className="flex flex-col gap-y-4 bg-white shadow-xl w-full border border-[#33A1E0]/20 mt-2 mx-auto max-w-4xl  rounded-md"
          >
            <div className="border-b border-gray-300 pb-4 p-6">
              <p className="text-xl font-semibold">Add New Project</p>
              <p className="text-gray-600">
                Fill in all input fields to create a new project
              </p>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <label htmlFor="projectName" className="flex flex-col w-full">
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

                <label htmlFor="demoLink" className="flex flex-col w-full">
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
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <label htmlFor="githubLink" className="flex flex-col w-full">
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

                <label htmlFor="completeTime" className="flex flex-col w-full">
                  <span className="text-gray-700">Complete time</span>
                  <input
                    type="date"
                    className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                    value={formData.completeTime}
                    onChange={(e) =>
                      setFormData({ ...formData, completeTime: e.target.value })
                    }
                    placeholder="Enter complete time"
                    required
                  />
                </label>
              </div>

              <div className="flex flex-col">
                <span className="text-gray-700 mb-1">Choose project image</span>
                <div
                  className="mt-1 border border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-blue-50 transition min-h-[100px]"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      setFormData({ ...formData, projectImage: file });
                    }
                  }}
                  onClick={() =>
                    document.getElementById("projectImageInput").click()
                  }
                >
                  {formData.projectImage ? (
                    <span className="text-green-600 font-semibold">
                      {formData.projectImage.name}
                    </span>
                  ) : (
                    <span className="flex gap-x-2 items-center text-gray-400">
                      <span>
                        <FaRegImage />
                      </span>
                      <span className="text-gray-400">
                        Drag & drop or click to select image
                      </span>
                    </span>
                  )}
                  <input
                    id="projectImageInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, projectImage: file });
                      }
                    }}
                    required
                  />
                </div>
              </div>
              {/* Close form button */}
              <div className="flex justify-end gap-x-2">
                <button
                  className=" text-red-500 border-red-500 border py-2 px-4 rounded-md transition duration-200"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                >
                  Close
                </button>
                <button
                  className=" bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold py-2 px-4 rounded-lg shadow hover:from-[#33A1E0] hover:to-[#154D71] transition duration-200"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
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
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
                  className="bg-gray-200 text-[#154D71] px-4 py-2 rounded hover:bg-gray-300"
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

      <p className="w-full p-6 px-6 font-semibold text-white flex justify-between items-center">
        <span className="text-xl"> Projects</span>
        <button
          className="bg-white text-[#33A1E0] px-4 py-2 gap-x-2 rounded-md flex justify-center items-center border border-[#33A1E0]/40 shadow hover:bg-[#33A1E0]/30 hover:text-white transition"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          <FaPlus /> Add Project
        </button>
      </p>

      {/* Filtering Controls */}
      <div className="flex flex-col sm:flex-row gap-4 px-6 mb-4">
        <input
          type="text"
          placeholder="Filter by project name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="py-2 px-4 border-[#33A1E0]/40 border-[2px] bg-transparent focus:outline-none rounded-md text-white"
        />
      </div>

      <div className="w-full max-w-full px-6 mb-10 overflow-x-auto ">
        <table className="w-full bg-white/10 backdrop-blur-sm border shadow-xl font-sans border-[#33A1E0]/20 rounded-md overflow-hidden">
          <thead className="">
            <tr className="text-white text-sm leading-normal border-b border-[#33A1E0]/20 bg-[#002b5b]">
              <th className="py-6 px-4 text-center">Order</th>
              <th className="py-6 px-4 text-left">Project Name</th>
              <th className="py-6 px-4 text-left">Demo Link</th>
              <th className="py-6 px-4 text-left">Github Link</th>
              <th className="py-6 px-4 text-center">Project Image</th>
              <th className="py-6 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm">
            {filteredProjects.map((item, index) => (
              <tr
                className="hover:bg-[#33A1E0]/10 transition-all border-b border-[#33A1E0]/20"
                key={index}
              >
                <td className="py-3 px-4 text-center">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </td>
                <td className="py-3 px-4 max-w-[200px] truncate">
                  {item.projectName}
                </td>
                <td className="py-3 px-4">
                  <a
                    href={item.demoLink}
                    className="text-blue-100 hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem Demo
                  </a>
                </td>
                <td className="py-3 px-4">
                  <a
                    href={item.githubLink}
                    className="text-blue-100 hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem Github
                  </a>
                </td>
                <td className="py-3 px-4">
                  <img
                    src={item.projectImage}
                    alt={item.imageName}
                    className="w-10 h-10 rounded-md border border-[#33A1E0]/20 mx-auto"
                  />
                </td>
                <td className="flex flex-col justify-center sm:flex-row items-center gap-2 py-3">
                  <button
                    onClick={() => {
                      setProjectId({ pId: item.id, show: true });
                    }}
                    className=" font-bold p-2 rounded-lg transition duration-200 text-white flex items-center gap-x-2 hover:bg-white hover:text-yellow-500"
                  >
                    <FaPencilAlt />
                    {/* Update */}
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        show: true,
                        id: item.id,
                        imgName: item.projectImgName,
                      })
                    }
                    className="flex items-center justify-center gap-x-2 text-red-50 font-bold p-2 rounded-lg transition duration-200 hover:bg-white hover:text-red-500"
                  >
                    <FaRegTrashAlt />
                    {/* Delete */}
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
