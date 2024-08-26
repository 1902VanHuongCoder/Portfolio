import paultoavatar from "../assets/paultoavatar1.png";
import Button from "./partials/Button";
import { motion } from "framer-motion";
const ShowCase = () => {
  return (
    <div id="home" className="w-full h-fit sm:h-screen px-2 flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-x-10  gap-y-6 pb-10 ">
      <motion.div
        initial={{
          opacity: 0,
          x: -200,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative"
      >
        <div className="absolute bottom-[-10px] sm:bottom-[50px] left-0 w-full h-[100px] bg-gradient-to-t from-[#2E236C] from-10%  to-[rgba(46, 35, 108, .1)] to-30% z-20"></div>
        <div className="absolute top-0 left-0 w-full h-[150px] flex sm:hidden justify-center items-center">
          <p className="italic font-medium text-xl text-white uppercase drop-shadow-2xl">
            <span className="text-[#C8ACD6] font-bold text-2xl">Challenge</span> is an opportunity
          </p>
        </div>
        <div className="w-full h-full">
          <img className="sm:-translate-y-16" src={paultoavatar} alt="paul to avatar" />
        </div>
      </motion.div>
      <motion.div className="p-6 flex flex-col items-start gap-y-6">
        <motion.p
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-4xl"
        >
          <span className="text-white">Hello, </span>
          <span className="text-[#C8ACD6]">I&apos;m</span>
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-7xl sm:text-9xl text-[#C8ACD6] drop-shadow-xl"
        >
          Paul To
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-white text-2xl sm:text-4xl"
        >
          Web Developer
        </motion.p>

        <motion.p
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-[#C8ACD6] sm:text-lg opacity-80 max-w-[400px]"
        >
          I have a passion for website development as well as UI/UX
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Button title="Contact" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ShowCase;
