import { IoIosStar } from "react-icons/io";
import SkillCard from "./partials/SkillCard";

const testData = [
  {
    tech: "ReactJS",
    logoTechLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGmKtrnxElpqw3AExKXPWWBulcwjlvDJa1Q&s",
  },
  {
    tech: "TailwindCSS",
    logoTechLink:
      "https://w7.pngwing.com/pngs/293/485/png-transparent-tailwind-css-hd-logo.png",
  },
  {
    tech: "Javascript",
    logoTechLink:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlKso-FiHbcar_gMR70gMghvAD3mub8z8UmQ&s",
  },
  {
    tech: "CSS",
    logoTechLink: "https://banner2.cleanpng.com/20180421/vdq/avee3ca8b.webp",
  },
];

const Skills = () => {
  return (
    <div className="relative h-fit bg-[#C8ACD6] w-full px-4 py-8">
      <div className="absolute top-[-8px] left-0 w-full flex gap-x-2 justify-center text-white">
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
      </div>
      <div className="flex items-center gap-x-2 pl-4">
        <span className="h-[50px] w-[6px] bg-[#2E236C]"></span>
        <p className="text-white text-2xl">Skills</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {testData.map((item, index) => (
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
