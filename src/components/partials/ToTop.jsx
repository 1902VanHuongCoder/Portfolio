import { FaCircleArrowUp } from "react-icons/fa6";

const ToTop = () => {
  return (
    <a href="#top" className="bottom-4 right-4 fixed w-[60px] h-[60px] flex justify-center items-center text-4xl text-white p-2 bg-[rgba(255,255,255,.2)] rounded-full z-40 hover:bg-[rgba(255,255,255,.5)]">
      <FaCircleArrowUp />
    </a>
  );
};

export default ToTop;
