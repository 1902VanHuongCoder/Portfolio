import { useEffect, useState } from "react";
import Project from "../partials/Project";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import Loading from "./Loading";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(usersData);
      };
      fetchData();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <section
      id="projects"
      className="relative w-full min-h-screen px-8 pt-12 pb-16 flex flex-col items-center justify-center border-t-[2px] border-dashed border-t-[#e0e7ef]"
    >
      {/* Decorative gradient ring */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#33A1E0]/30 via-[#154D71]/10 to-transparent rounded-full blur-3xl z-0"></div>
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 className="text-4xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text drop-shadow-xl mb-2 !text-left w-full">
          Projects
        </h2>
        <p className="text-[#154D71] text-lg sm:text-2xl font-semibold opacity-80 mb-8 text-left w-full">
          Includes personal projects and real-world projects that have been
          completed up to the present.
        </p>
        <div className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center justify-center">
          {projects.map((item, index) => (
            <Project
              completeTime={item.completeTime}
              demoLink={item.demoLink}
              githubLink={item.githubLink}
              projectImage={item.projectImage}
              projectName={item.projectName}
              key={index}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
