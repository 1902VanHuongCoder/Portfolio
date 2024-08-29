import { useEffect, useState } from "react";
import SkillCard from "./partials/SkillCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";

const Skills = () => {
  const [skills, setSkills] = useState([]);
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
  return (
    <div
      id="skills"
      className="relative min-h-fit bg-[] w-full px-4 pt-8 pb-20"
    >
      <div className="flex items-center gap-x-2 pl-4">
        <span className="h-[50px] w-[6px] bg-[#C8ACD6]"></span>
        <p className="text-white text-2xl">Skills</p>
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {skills.map((item, index) => (
          <SkillCard
            tech={item.tech}
            logoTechLink={item.logoTechLink}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
