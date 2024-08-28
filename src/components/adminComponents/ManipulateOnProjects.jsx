import { useEffect, useState } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const data = [
  {
    id: 1,
    projectName: "Dự án 1",
    demoLink: "https://demo1.example.com",
    githubLink: "https://github.com/user/demo1",
    projectImage: "https://via.placeholder.com/150",
    imageName: "image1.jpg",
  },
  {
    id: 2,
    projectName: "Dự án 2",
    demoLink: "https://demo2.example.com",
    githubLink: "https://github.com/user/demo2",
    projectImage: "https://via.placeholder.com/150",
    imageName: "image2.jpg",
  },
  // Thêm dữ liệu khác nếu cần
];

const ManipulateOnProjects = () => {
  const [projects, setProjects] = useState();
  const [formData, setFormData] = useState({
    projectName: "",
    demoLink: "",
    githubLink: "",
    completeTime: "",
    projectImage: "",
  });

  const uploadImageToFirebase = async (e) => {
    e.preventDefault();
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
  console.log(projects);

  return (
    <div className="min-h-screen w-full overflow-x-auto">
      <h1 className="w-full text-4xl text-center p-4">Projects</h1>
      <form
        onSubmit={uploadImageToFirebase}
        className="flex flex-col gap-y-4 p-6 bg-white rounded-lg shadow-md"
      >
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
          className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          type="submit"
        >
          Submit
        </button>
      </form>

      <h1 className="w-full text-4xl text-center p-4">Project List</h1>

      <table className="min-w-full bg-white border border-gray-300">

<thead>
  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
    <th className="py-3 px-4 text-left">Số thứ tự</th>
    <th className="py-3 px-4 text-left">Tên dự án</th>
    <th className="py-3 px-4 text-left">Demo Link</th>
    <th className="py-3 px-4 text-left">Github Link</th>
    <th className="py-3 px-4 text-left">Ảnh dự án</th>
    <th className="py-3 px-4 text-left">Tên ảnh</th>
  </tr>
</thead>

<tbody className="text-gray-600 text-sm">
  {projects?.map((item, index) => (
    <tr className="hover:bg-gray-100" key={index}>
      <td className="py-3 px-4 border-b border-gray-300">{index + 1}</td>
      <td className="py-3 px-4 border-b border-gray-300">{item.projectName}</td>
      <td className="py-3 px-4 border-b border-gray-300">
        <a href={item.demoLink} className="text-blue-600 hover:underline">Xem Demo</a>
      </td>
      <td className="py-3 px-4 border-b border-gray-300">
        <a href={item.githubLink} className="text-blue-600 hover:underline">Xem Github</a>
      </td>
      <td className="py-3 px-4 border-b border-gray-300">
        <img src={item.projectImage} alt={item.imageName} className="w-16 h-16 rounded" />
      </td>
      <td className="py-3 px-4 border-b border-gray-300">{item.projectImgName}</td>
    </tr>
  ))}
</tbody>

</table>
    </div>
  );
};

export default ManipulateOnProjects;
