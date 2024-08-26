import { FaRegSquareFull } from "react-icons/fa6";
import SubmitButton from "./partials/SubmitButton";
const Contact = () => {
  return (
    <div id="contact" className="relative h-screen bg-[#2E236C] w-full px-4 py-8 flex justify-center items-center">
      <div className="absolute top-[-7px] left-0 w-full flex gap-x-2 justify-center text-white">
        <span>
          <FaRegSquareFull />
        </span>
        <span>
          <FaRegSquareFull />
        </span>
        <span>
          <FaRegSquareFull />
        </span>
      </div>
      <div className="p-4 w-full">
        <div className="text-center">
          <p className="text-xl text-white font-bold">
            Get In <span className="text-[#C8ACD6]">Touch</span>
          </p>
          <p className="text-4xl text-white pt-4">Contact Me</p>
        </div>
        <div className="mt-10 flex flex-col items-start w-full gap-y-5 sm:max-w-[700px] sm:mx-auto">
         <div className="flex flex-col sm:flex-row gap-x-6 w-full gap-y-6">
         <input
            className="bg-[rgba(0,0,0,.25)] placeholder:text-white font-normal p-4 rounded-[6px] text-white outline-none w-full focus:bg-[rgba(0,0,0,.5)]"
            type="text"
            autoComplete="true"
            placeholder="Enter your email"
            name="email"
            id="email"
          />
          <input
            className="bg-[rgba(0,0,0,.25)] placeholder:text-white font-normal p-4 rounded-[6px] text-white w-full outline-none focus:bg-[rgba(0,0,0,.5)]"
            type="text"
            autoComplete="true"
            placeholder="Enter your name"
            name="name"
            id="name"
          />
         </div>
          <textarea
            rows={5}
            className="bg-[rgba(0,0,0,.25)] font-normal p-4 rounded-[6px] text-white w-full outline-none focus:bg-[rgba(0,0,0,.5)]"
          >
            Enter your comment
          </textarea>
          <SubmitButton title="Submit" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
