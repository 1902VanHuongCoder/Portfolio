import Project from "./partials/Project";

const testData = [
  {
    demoLink: "test",
    githubLink: "test",
    projectName: "Template test",
    completeTime: "10-02-2024",
    projectImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ3TcXkewZLHgGYq9U0wQS9ohbXR67mr_RmA&s",
  },
  {
    demoLink: "test",
    githubLink: "test",
    projectName: "Template test",
    completeTime: "10-02-2024",
    projectImage:
      "https://hips.hearstapps.com/hmg-prod/images/tuna-animals-to-follow-on-instagram-1568322831.jpg",
  },
  {
    demoLink: "test",
    githubLink: "test",
    projectName: "Template test",
    completeTime: "10-02-2024",
    projectImage:
      "https://i.natgeofe.com/k/c022030e-f1aa-4ab3-ad56-fdcdd4a1d08b/125-animals-tiger.jpg",
  },
  {
    demoLink: "test",
    githubLink: "test",
    projectName: "Template test",
    completeTime: "10-02-2024",
    projectImage:
      "https://www.rainforest-alliance.org/wp-content/uploads/2021/06/capybara-square-1.jpg.optimal.jpg",
  },
];

const Projects = () => {
  return (
    <div className="relative h-fit bg-[#221A51] w-full px-4 py-8">
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
        {testData.map((item, index) => (
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
  );
};

export default Projects;
