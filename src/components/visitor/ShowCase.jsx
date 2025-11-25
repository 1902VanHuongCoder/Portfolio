import { useContext, useEffect, useState } from "react";
import paultoavatar from "../../assets/paultoavatar1.jpg";
import Button from "../partials/Button";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import { FaImage } from "react-icons/fa";
import ThemeCanvas from "../partials/ThemeCanvas";
import { ThemeContext } from "../../contexts/ThemeContext";

import christmasGift from "../../assets/christmas-gift.png";

const ShowCase = () => {
  // Personal info
  const [personalInfo, setPersonalInfo] = useState({});

  const { theme } = useContext(ThemeContext);

  // Fetch personal information to show in the form
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      const docRef = doc(db, "personalInfo", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPersonalInfo(docSnap.data());
      }
    };
    fetchPersonalInfo();
  }, []);

  const styleBasedOnTheme = () => {
    if (theme?.themeSlug === "christmas") {
      return {
        primaryColor: "text-white",
        secondaryColor: "text-white/80",
        gradientColor: "bg-gradient-to-r from-white via-gray-200 to-white",
      };
    } else if (theme?.themeSlug === "new-year") {
      return {
        primaryColor: "text-[#EEBF17]",
        secondaryColor: "text-[#F17B00]",
        gradientColor:
          "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600",
        borderColor: "border-[#EEBF17]",
        contactButton: "bg-white text-[#ec7402]",
        heroTitleBackground: "backdrop-blur-2xl bg-white/10 lg:backdrop-blur-none lg:bg-transparent",
      };
    } else {
      return {
        primaryColor: "text-[#154D71]",
        secondaryColor: "text-[#33A1E0]",
        gradientColor:
          "bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71]",
      };
    }
  };
  const primaryColor = styleBasedOnTheme().primaryColor;
  const secondaryColor = styleBasedOnTheme().secondaryColor;
  const gradientColor = styleBasedOnTheme().gradientColor;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Canvas background animation */}
      <ThemeCanvas />
      <div
        id="home"
        className="relative w-full h-fit lg:h-screen px-2 flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-x-10 gap-y-6 pb-10 mt-14 lg:mt-0"
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
            <div className="relative">
              <div
                className={`relative rounded-full border-4 ${
                  styleBasedOnTheme().borderColor
                    ? styleBasedOnTheme().borderColor
                    : "border-[#33A1E0]"
                } shadow-xl overflow-hidden w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-white/80 flex items-center justify-center transition-transform duration-300`}
              >
                {personalInfo.avatar ? (
                  <img
                    src={
                      personalInfo.avatar ? personalInfo.avatar : paultoavatar
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-[#33A1E0] font-bold">
                    <FaImage />
                  </div>
                )}
              </div>
              <div className="absolute bottom-[-6%] right-[-5%] sm:bottom-[-8%] sm:right-[-10%] drop-shadow-2xl">
                {/* Using christmas scene here */}
                {theme?.themeSlug === "christmas" && (
                  <img
                    src={christmasGift}
                    alt="Christmas Gift"
                    className="w-32 h-32 sm:w-44 sm:h-44"
                  />
                )}
              </div>
            </div>

            {/* <div className="absolute bottom-0 right-10 md:right-[30%] lg:right-[10%] w-14 h-14">
              {personalInfo.smallAvatar ? (
                <img
                  src={personalInfo.smallAvatar}
                  alt="Small avatar next to main avatar"
                  className={`w-full h-full rounded-full object-cover border-2 ${
                    styleBasedOnTheme().borderColor
                      ? styleBasedOnTheme().borderColor
                      : "border-[#33A1E0]"
                  } shadow bg-white absolute bottom-2 right-2`}
                />
              ) : (
                <span className="text-[#33A1E0] text-2xl">&#128515;</span>
              )}
            </div> */}
          </div>
        </motion.div>
        <motion.div
          className={`p-6 flex flex-col items-start gap-y-6 ${
            styleBasedOnTheme().heroTitleBackground
              ? styleBasedOnTheme().heroTitleBackground
              : ""
          } rounded-2xl backdrop-blur-md bg-white/10 md:backdrop-blur-none md:bg-transparent transition-all duration-300`}
        >
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
            <span className={primaryColor}>Hello, </span>
            <span className={`${secondaryColor} font-bold`}>I&apos;m</span>
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
            className={`text-7xl sm:text-8xl font-extrabold ${gradientColor} text-transparent bg-clip-text drop-shadow-xl pb-2`}
          >
            {personalInfo.name ? personalInfo.name : "Paul To"}
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
            className={`${primaryColor} text-2xl sm:text-4xl font-bold`}
          >
            {personalInfo.role ? personalInfo.role : "IT Helpdesk"}
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
            className={`${secondaryColor} sm:text-lg w-full text-justify opacity-90 lg:max-w-[600px] font-medium`}
          >
            I have a passion for creating efficient and user-friendly IT
            solutions that enhance productivity and streamline operations.
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
              title="Contact"
              className={`font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 ${
                styleBasedOnTheme().contactButton
                  ? styleBasedOnTheme().contactButton
                  : "bg-[#33A1E0] text-white hover:bg-[#154D71]"
              }`}
              link="#contact"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShowCase;
