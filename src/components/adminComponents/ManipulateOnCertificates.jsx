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
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { AnimatePresence, motion } from "framer-motion";

const ManipulateOnCertificates = () => {
  const [cers, setCers] = useState();
  const [cerId, setCerId] = useState({ show: false, cId: "" });
  const [formData, setFormData] = useState({
    certificateContent: "",
    certificateImgName: "",
    certificate: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
    imgName: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkIfFile(dataToUpdate.certificate)) {
      const desertRef = ref(storage, `cers/${dataToUpdate.certificateImgName}`);
      try {
        await deleteObject(desertRef);
        const storageRef = ref(
          storage,
          `cers/${dataToUpdate.certificate.name}`
        );
        await uploadBytes(storageRef, dataToUpdate.certificate);
        const downloadURL = await getDownloadURL(storageRef);
        const dataToSaveToFirebase = {
          certificateContent: dataToUpdate.certificateContent,
          certificate: downloadURL,
          certificateImgName: dataToUpdate.certificate.name,
        };
        const docRef = doc(db, "cers", cerId.cId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Certificate updated successfully!");
      } catch (error) {
        console.log("Error" + error);
      }
    } else {
      const dataToSaveToFirebase = {
        certificateContent: dataToUpdate.certificateContent,
      };
      try {
        const docRef = doc(db, "cers", cerId.cId);
        await updateDoc(docRef, dataToSaveToFirebase);
        alert("Certificate updated successfully!");
      } catch (error) {
        console.error("Error updating certificate", error);
      }
    }
  };

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
      alert("Chưa thêm ảnh chứng chỉ!");
    }
  };

  const handleDeleteCer = async (id, projectImgName) => {
    try {
      await deleteDoc(doc(db, "cers", id));
      const desertRef = ref(storage, `cers/${projectImgName}`);
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] py-8">
      {/* Update Modal */}
      <AnimatePresence>
        {cerId.show && (
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
                onClick={() => setCerId({ cId: "", show: false })}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-2 text-[#154D71]">
                Update Certificate
              </h2>
              <input
                type="text"
                name="certificateContent"
                value={dataToUpdate.certificateContent}
                onChange={handleChange}
                placeholder="Certificate name"
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
                Update Certificate
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
                Xác nhận xóa chứng chỉ?
              </p>
              <div className="flex gap-4 justify-center mt-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                  onClick={async () => {
                    await handleDeleteCer(
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

      <h1 className="w-full text-4xl text-center p-4 font-extrabold text-white drop-shadow-xl">
        CÁC THAO TÁC VỚI CERTIFICATES
      </h1>
      <div className="flex flex-col items-center w-full">
        <form
          onSubmit={uploadImageToFirebase}
          className="flex flex-col gap-y-4 p-6 bg-white/80 shadow-xl w-full border border-[#33A1E0]/20 mt-2 mx-auto max-w-2xl rounded-md backdrop-blur-md"
        >
          <p className="text-xl font-semibold text-[#154D71]">
            Add New Certificate
          </p>
          <label htmlFor="certificateContent" className="flex flex-col">
            <span className="text-gray-700">Certificate content</span>
            <input
              type="text"
              className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
              value={formData.certificateContent}
              onChange={(e) =>
                setFormData({ ...formData, certificateContent: e.target.value })
              }
              placeholder="Enter certificate content"
              required
            />
          </label>
          <label htmlFor="certificate" className="flex flex-col">
            <span className="text-gray-700">Choose certificate image</span>
            <input
              type="file"
              className="mt-1 border border-[#33A1E0]/30 rounded-md p-2 focus:outline-none focus:border-[#33A1E0]"
              onChange={(e) =>
                setFormData({ ...formData, certificate: e.target.files[0] })
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
      </div>

      <p className="w-full p-6 font-bold text-xl mt-10 text-white">
        DANH SÁCH CÁC CHỨNG CHỈ
      </p>

      <div className="w-full min-w-[600px] px-2 sm:px-6 overflow-x-auto">
        <table className="w-full bg-white/90 border border-[#33A1E0]/20 rounded-md shadow-xl">
          <thead className="border-b-[2px]">
            <tr className="text-[#1178b3] text-sm leading-normal">
              <th className="py-6 px-4 text-center">Số Thứ Tự</th>
              <th className="py-6 px-4 text-left">Tên chứng chỉ</th>
              <th className="py-6 px-4 text-left">Ảnh chứng chỉ</th>
              <th className="py-6 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="text-black text-sm">
            {cers?.map((item, index) => (
              <tr className="hover:bg-[#33A1E0]/10 transition-all" key={index}>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10 font-bold text-center">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                  {item.certificateContent}
                </td>
                <td className="py-3 px-4 border-b border-[#33A1E0]/10">
                  <img
                    src={item.certificate}
                    alt={item.certificateContent}
                    className="w-12 h-12 rounded border border-[#33A1E0]/20 mx-auto"
                  />
                </td>
                <td className="flex flex-col sm:flex-row justify-center items-center gap-2 py-3 px-4 border-b border-[#33A1E0]/10">
                  <button
                    onClick={() => {
                      setCerId({ cId: item.id, show: true });
                    }}
                    className="font-bold py-2 px-4 rounded-lg transition duration-200 text-slate-600 flex items-center gap-x-2 border-slate-600 border"
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        show: true,
                        id: item.id,
                        imgName: item.certificateImgName,
                      })
                    }
                    className="flex items-center justify-center gap-x-2 text-red-500 font-bold py-2 px-4 rounded-lg transition duration-200 border-red-500 border"
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

export default ManipulateOnCertificates;
