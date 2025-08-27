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
    <section
      id="skills"
      className="relative w-full min-h-fit px-8 pt-12 pb-16 flex flex-col items-center justify-center border-t-[2px] border-dashed border-t-[#e0e7ef]"
    >
      {/* Decorative gradient ring */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text drop-shadow-xl mb-2 text-left w-full">
          Skills
        </h2>
        <p className="text-[#154D71] text-lg sm:text-2xl font-semibold opacity-80 mb-8 w-full text-left">
          Technologies and tools I use to build beautiful and functional web
          experiences.
        </p>
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 ">
          {skills.map((item, index) => (
            <div key={index} className="flex items-center justify-center">
              <SkillCard tech={item.tech} logoTechLink={item.logoTechLink} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
