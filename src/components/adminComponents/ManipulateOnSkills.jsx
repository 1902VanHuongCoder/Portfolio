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

const ManipulateOnSkills = () => {
  const [skills, setSkills] = useState();
  const [skill, setSkill] = useState({ show: false, sId: "" });
  const [formData, setFormData] = useState({
    tech: "",
    logoTechLink: "",
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

    console.log("Handle submit run....");

    if (checkIfFile(dataToUpdate.logoTechLink)) {
      console.log("If chay");

      const desertRef = ref(storage, `skills/${dataToUpdate.techLogoName}`);

      try {
        // Delete the existing file
        await deleteObject(desertRef);
        console.log(`${dataToUpdate.techLogoName} deleted successfully.`);

        const storageRef = ref(
          storage,
          `skills/${dataToUpdate.logoTechLink.name}`
        );

        // Upload the new file
        await uploadBytes(storageRef, dataToUpdate.logoTechLink);
        console.log("File uploaded successfully.");

        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Preparing data to save to Firebase
        const dataToSaveToFirebase = {
          tech: dataToUpdate.tech,
          logoTechLink: downloadURL,
          techLogoName: dataToUpdate.techLogoName,
        };

        // Update Firestore document
        const docRef = doc(db, "skills", skill.sId);
        await updateDoc(docRef, dataToSaveToFirebase);

        alert("Cập nhật skills thành công nhe!");
      } catch (error) {
        console.log("Error" + error);
      }
    } else {
      // If no new project image, just update the other fields

      console.log("else chay");
      const dataToSaveToFirebase = {
        tech: dataToUpdate.tech,
      };

      try {
        const docRef = doc(db, "skills", skill.sId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Cập nhật skill thành công nhe!!!");
      } catch (error) {
        console.error("Cập nhật không thành công rồi uh-oh", error);
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
          alert(
            "Thêm skills hong thành công rồi bây ơi! Lỗi phần form dữ liệu form á!"
          );
          console.error("Error adding document: ", error);
        }
      } catch (error) {
        alert("Thêm dự án không thành công do lỗi upload hình ảnh!");
        console.error("Error uploading file: ", error);
      }
    } else {
      alert("Chưa thêm hình mày ơi!");
    }
  };

  const handleDeleteSkill = async (id, techLogoName) => {
    try {
      // Step 1: Delete the Firestore document
      await deleteDoc(doc(db, "skills", id));
      console.log(`Document with ID ${id} deleted successfully.`);

      // Step 2: Create a reference to the image in Firebase Storage
      const desertRef = ref(storage, `skills/${techLogoName}`);

      try {
        // Step 3: Delete the image file from Firebase Storage
        await deleteObject(desertRef);
        console.log(`${techLogoName} deleted successfully.`);
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
    <div className="min-h-screen w-full overflow-x-hidden">
      <AnimatePresence>
        {skill.show && (
          <motion.div className="fixed top-0 left-0  w-full h-full bg-[rgba(0,0,0,.2)] flex justify-center items-center">
            <motion.form
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
              }}
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4"
            >
              <div className="flex justify-between p-4 items-center">
                <h2 className="text-xl font-bold mb-4">Update Project</h2>
                <div
                  onClick={() => {
                    setSkill({ pId: "", show: false });
                  }}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9.293l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05A1 1 0 015.05 3.636L10 8.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <input
                type="text"
                name="tech"
                value={dataToUpdate.tech}
                onChange={handleChange}
                placeholder="technology"
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Update Project
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="w-full text-4xl text-center p-4">
        CÁC THAO TÁC VỚI SKILLS
      </h1>
      <p className="w-full px-6 font-bold text-xl">1. Thêm skill:</p>
      <form
        onSubmit={uploadImageToFirebase}
        className="flex flex-col gap-y-4 p-6 bg-white"
      >
        <label htmlFor="tech" className="flex flex-col">
          <span className="text-gray-700">Technology</span>
          <input
            type="text"
            className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            value={formData.tech}
            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
            placeholder="Enter techology"
            required
          />
        </label>

        <label htmlFor="logoTechLink" className="flex flex-col">
          <span className="text-gray-700">Choose project image</span>
          <input
            type="file"
            className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, logoTechLink: e.target.files[0] })
            }
            required
          />
        </label>
        <button
          className
          
          ="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          type="submit"
        >
          Submit
        </button>
      </form>

      <p className="w-full p-6 font-bold text-xl mt-10">
        2. Danh sách các dự án:
      </p>

      <div className="w-screen px-6 overflow-x-scroll">
        <table className="w-[600px] sm:w-full  bg-white border border-gray-300 px-6">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Số thứ tự</th>
              <th className="py-3 px-4 text-left">Technology</th>
              <th className="py-3 px-4 text-left">Logo technology link</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm">
            {skills?.map((item, index) => (
              <tr className="hover:bg-gray-100" key={index}>
                <td className="py-3 px-4 border-b border-gray-300">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  {item.tech}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <img
                    src={item.logoTechLink}
                    alt={item.tech}
                    className="w-16 h-16 rounded"
                  />
                </td>

                <td className="flex justify-center items-cente flex-col gap-y-2 gap-x-2">
                  <button
                    onClick={() => {
                      setSkill({ sId: item.id, show: true });
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition duration-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteSkill(item.id, item.techLogoName)
                    }
                    className="flex items-center justify-center bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 2a1 1 0 00-1 1v1H4a1 1 0 000 2h12a1 1 0 000-2h-1V3a1 1 0 00-1-1H6zm0 4h8v12a1 1 0 01-1 1H7a1 1 0 01-1-1V6z" />
                    </svg>
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

export default ManipulateOnSkills;
