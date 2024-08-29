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

const ManipulateOnCertificates = () => {
  const [cers, setCers] = useState();
  const [cerId, setCerId] = useState({ show: false, cId: "" });
  const [formData, setFormData] = useState({
    certificateContent: "",
    certificateImgName: "",
    certificate: "",
  });

  const [dataToUpdate, setDataToUpdate] = useState({
    certificateContent: "",
    certificateImgName: "",
    certificate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataToUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDataToUpdate((prev) => ({ ...prev, certificate: e.target.files[0] }));
  };

  const checkIfFile = (value) => {
    return value && typeof value === "object";
  };

//   Done 
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Handle submit run....");

    if (checkIfFile(dataToUpdate.certificate)) {
      console.log("If chay");

      const desertRef = ref(storage, `cers/${dataToUpdate.certificateImgName}`);

      try {
        // Delete the existing file
        await deleteObject(desertRef);
        console.log(`${dataToUpdate.certificateImgName} deleted successfully.`);

        const storageRef = ref(
          storage,
          `cers/${dataToUpdate.certificate.name}`
        );

        // Upload the new file
        await uploadBytes(storageRef, dataToUpdate.certificate);
        console.log("File uploaded successfully.");

        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Preparing data to save to Firebase
        const dataToSaveToFirebase = {
          certificateContent: dataToUpdate.certificateContent,
          certificate: downloadURL,
          certificateImgName: dataToUpdate.certificate.name, // Make sure to use the name from the uploaded image
        };

        // Update Firestore document
        const docRef = doc(db, "cers", cerId.cId);
        await updateDoc(docRef, dataToSaveToFirebase);

        alert("Certificate updated successfully!");
      } catch (error) {
        console.log("Error" + error);
        // console.error("Error during delete/upload/update process", error);
      }
    } else {
      // If no new project image, just update the other fields

      console.log("else chay");
      const dataToSaveToFirebase = {
        certificateContent: dataToUpdate.certificateContent,
      };

      try {
        const docRef = doc(db, "cers", cerId.cId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Certificate updated successfully!");
      } catch (error) {
        console.error("Error updating project without new image: ", error);
      }
    }
  };

  //   Done
  const uploadImageToFirebase = async (e) => {
    e.preventDefault();
    if (formData.certificate) {
      const storageRef = ref(storage, `cers/${formData.certificate.name}`);
      try {
        await uploadBytes(storageRef, formData.certificate);
        const downloadURL = await getDownloadURL(storageRef);
        const dataToSaveToFirebase = {
          certificateContent: formData.certificateContent,
          certificate: downloadURL,
          certificateImgName: formData.certificate.name,
        };
        try {
          await addDoc(collection(db, "cers"), dataToSaveToFirebase);
          window.location.reload();
        } catch (error) {
          alert("Thêm chứng chỉ không thành công do lỗi tham số!");
          console.error("Error adding document: ", error);
        }
      } catch (error) {
        alert("Thêm chứng chỉ không thành công do upload hình ảnh!");
        console.error("Error uploading file: ", error);
      }
    } else {
      alert("Chưa thêm ảnh chứng chỉ em ơi!");
    }
  };

  const handleDeleteCer = async (id, projectImgName) => {
    try {
      // Step 1: Delete the Firestore document
      await deleteDoc(doc(db, "cers", id));
      console.log(`Document with ID ${id} deleted successfully.`);

      // Step 2: Create a reference to the image in Firebase Storage
      const desertRef = ref(storage, `cers/${projectImgName}`);

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
      const querySnapshot = await getDocs(collection(db, "cers"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCers(usersData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cerId.cId !== "") {
      const fetchProject = async () => {
        const docRef = doc(db, "cers", cerId.cId);
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
  }, [cerId.cId]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <AnimatePresence>
        {cerId.show && (
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
                    setCerId({ cId: "", show: false });
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
                name="certificateContent"
                value={dataToUpdate.certificateContent}
                onChange={handleChange}
                placeholder="Project name"
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
                Update Certificate
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className="w-full text-4xl text-center p-4">
        CÁC THAO TÁC VỚI CERTIFICATES
      </h1>
      <p className="w-full px-6 font-bold text-xl">1. Thêm chứng chỉ:</p>
      {/* Done  */}
      <form
        onSubmit={uploadImageToFirebase}
        className="flex flex-col gap-y-4 p-6 bg-white"
      >
        {/* Done  */}
        <label htmlFor="certificateContent" className="flex flex-col">
          <span className="text-gray-700">Certificate content</span>
          <input
            type="text"
            className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            value={formData.certificateContent}
            onChange={(e) =>
              setFormData({ ...formData, certificateContent: e.target.value })
            }
            placeholder="Enter certificate content"
            required
          />
        </label>

        {/* Done  */}
        <label htmlFor="certificate" className="flex flex-col">
          <span className="text-gray-700">Choose project image</span>
          <input
            type="file"
            className="mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, certificate: e.target.files[0] })
            }
            required
          />
        </label>

        <button
          className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          type="submit"
        >
          Submit
        </button>
      </form>

      <p className="w-full p-6 font-bold text-xl mt-10">
        2. Danh sách các chứng chỉ:
      </p>

      <div className="w-screen px-6 overflow-x-scroll">
        <table className="w-[600px] sm:w-full  bg-white border border-gray-300 px-6">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Số thứ tự</th>
              <th className="py-3 px-4 text-left">Tên chứng chỉ</th>
              <th className="py-3 px-4 text-left">Ảnh chứng chỉ</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm">
            {/* Done  */}
            {cers?.map((item, index) => (
              <tr className="hover:bg-gray-100" key={index}>
                <td className="py-3 px-4 border-b border-gray-300">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  {item.certificateContent}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <img
                    src={item.certificate}
                    alt={item.certificateContent}
                    className="w-16 h-16 rounded"
                  />
                </td>

                <td className="flex justify-center items-cente flex-col gap-y-2 gap-x-2">
                  <button
                    onClick={() => {
                      setCerId({ cId: item.id, show: true });
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition duration-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteCer(item.id, item.certificateImgName)
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

export default ManipulateOnCertificates;
