import { IoIosStar } from "react-icons/io";

const Certificates = () => {
  return (
    <div className="relative h-fit bg-[#C8ACD6] w-full px-4 py-8">
      <div className="absolute top-[-7px] left-0 w-full flex gap-x-2 justify-center">
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
      <div className="mt-6 grid grid-cols-2 gap-2"></div>
    </div>
  );
};

export default Certificates;
