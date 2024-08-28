import { useEffect, useState } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "./firebaseConfig";

const ManipulateOnProjects = () => {
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const querySnapshot = await getDocs(collection(db, "users"));
  //       const usersData = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setUsers(usersData);
  //     };
  //     fetchData();
  //   }, []);

  const uploadImageToFirebase = async () => {
    if (!formData.projectImage) return;

    const storageRef = ref(storage, `projects/${formData.projectImage.name}`);

    try {
      // Upload the file
      await uploadBytes(storageRef, formData.projectImage);
      // Get the download URL
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
        // await setDoc(doc(db, "projects", "hello"), dataToSaveToFirebase);

        alert("User added successfully!");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const handleAddAProject = (e) => {
    e.preventDefault();
    console.log("Test");
    uploadImageToFirebase();
  };

  const [formData, setFormData] = useState({
    projectName: "",
    demoLink: "",
    githubLink: "",
    completeTime: "",
    projectImage: "",
  });
  return (
    <div>
      <form onSubmit={handleAddAProject} className="flex flex-col gap-y-4">
        <label htmlFor="projectName">
          Project name{" "}
          <input
            className="border-[1px] border-solid border-black"
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            placeholder="Enter project name"
            required
          />
        </label>
        <label htmlFor="projectName">
          Demo link{" "}
          <input
            className="border-[1px] border-solid border-black"
            value={formData.demoLink}
            onChange={(e) =>
              setFormData({ ...formData, demoLink: e.target.value })
            }
            placeholder="Enter demo link"
            required
          />
        </label>
        <label htmlFor="projectName">
          Github link{" "}
          <input
            className="border-[1px] border-solid border-black"
            value={formData.githubLink}
            onChange={(e) =>
              setFormData({ ...formData, githubLink: e.target.value })
            }
            placeholder="Enter github link"
            required
          />
        </label>
        <label htmlFor="projectName">
          Complete time{" "}
          <input
            className="border-[1px] border-solid border-black"
            value={formData.completeTime}
            onChange={(e) =>
              setFormData({ ...formData, completeTime: e.target.value })
            }
            placeholder="Enter complete time"
            required
          />
        </label>
        <label htmlFor="projectName">
          Chose project image{" "}
          <input
            className="border-[1px] border-solid border-black"
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, projectImage: e.target.files[0] })
            }
            required
          />
        </label>
        <button className="" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ManipulateOnProjects;
