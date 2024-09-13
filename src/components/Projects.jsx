import { useEffect, useState } from "react";
import Project from "./partials/Project";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
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
    <>
      <div
        id="projects"
        className="relative h-fit bg-[#221A51] w-full px-4 py-8 pb-20 sm:pb-20"
      >
        <div className="absolute top-[-7px] left-0 w-full flex gap-x-2 justify-center">
          <span className="w-[15px] h-[15px] rounded-full bg-[rgba(255,255,255,.5)]"></span>
          <span className="w-[15px] h-[15px] rounded-full bg-[rgba(255,255,255,.5)]"></span>
          <span className="w-[15px] h-[15px] rounded-full bg-[rgba(255,255,255,.5)]"></span>
        </div>
        <div className="flex items-center gap-x-2 pl-4">
          <span className="h-[50px] w-[6px] bg-[#C8ACD6]"></span>
          <p className="text-white text-2xl">Projects</p>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 items-center gap-y-6 mt-6 gap-x-6">
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
    </>
  );
};

export default Projects;
