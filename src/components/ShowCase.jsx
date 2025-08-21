import paultoavatar from "../assets/paultoavatar1.jpg";
import Button from "./partials/Button";
import { motion } from "framer-motion";
const ShowCase = () => {
  return (
    <div
      id="home"
      className="w-full h-fit sm:h-screen px-2 flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-x-10 gap-y-6 pb-10 mt-14 md:mt-0"
    >
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
        <div className="w-full h-full flex justify-center items-center">
          <div className="relative rounded-full border-4 border-[#33A1E0] shadow-xl overflow-hidden w-[300px] sm:w-[400px] sm:h-[400px] bg-white/80 flex items-center justify-center transition-transform duration-300">
            <img
              className="object-cover w-full h-full z-2"
              src={paultoavatar}
              alt="paul to avatar"
            />
          </div>
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
          className="text-2xl sm:text-4xl font-semibold"
        >
          <span className="text-[#154D71]">Hello, </span>
          <span className="text-[#33A1E0] font-bold">I&apos;m</span>
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
          className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text drop-shadow-xl"
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
          className="text-[#154D71] text-2xl sm:text-4xl font-bold"
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
          className="text-[#33A1E0] sm:text-lg opacity-90 max-w-[400px] font-medium"
        >
          I have a passion for{" "}
          <span className="text-[#154D71] font-bold">website development</span>{" "}
          as well as <span className="text-[#154D71] font-bold">UI/UX</span>
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
          <Button
            onClick={() => window.scrollTo({ bottom: 0, behavior: 'smooth' })}
            title="Contact"
            className=" font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ShowCase;
