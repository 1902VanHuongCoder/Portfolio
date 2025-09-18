import { useEffect, useRef, useState } from "react";
import paultoavatar from "../../assets/paultoavatar1.jpg";
import Button from "../partials/Button";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";
import { FaImage } from "react-icons/fa";

const ShowCase = () => {
  // Personal info
  const [personalInfo, setPersonalInfo] = useState({});
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


  // Draw a plus sign at (x, y) with given size and color
  function drawPlus(ctx, x, y, size, color, alpha = 0.5, angle = 0) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.18;
    ctx.beginPath();
    ctx.moveTo(-size / 2, 0);
    ctx.lineTo(size / 2, 0);
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(0, size / 2);
    ctx.stroke();
    ctx.restore();
  }


const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let animationFrameId;
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Generate plus signs
  const NUM_PLUS = 28;
  const pluses = Array.from({ length: NUM_PLUS }).map(() => {
    const size = Math.random() * 20; // 18-50px
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      color: Math.random() > 0.5 ? '#33A1E0' : '#154D71',
      alpha: Math.random() * 0.4 + 0.3, // 0.3-0.7
      angle: Math.random() * Math.PI,
      speedX: (Math.random() - 0.5) * 0.7, // -0.35 to 0.35
      speedY: (Math.random() - 0.5) * 0.7, // -0.35 to 0.35
      spin: (Math.random() - 0.5) * 0.01, // -0.005 to 0.005
    };
  });

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of pluses) {
      // Move
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.spin;
      // Wrap around
      if (p.x < -p.size) p.x = width + p.size;
      if (p.x > width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = height + p.size;
      if (p.y > height + p.size) p.y = -p.size;
      drawPlus(ctx, p.x, p.y, p.size, p.color, p.alpha, p.angle);
    }
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", resizeCanvas);
  };
}, []);
  
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Canvas background animation */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
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
            <div className="relative rounded-full border-4 border-[#33A1E0] shadow-xl overflow-hidden w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-white/80 flex items-center justify-center transition-transform duration-300">
              {personalInfo.avatar ? (
                <img
                  src={personalInfo.avatar ? personalInfo.avatar : paultoavatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-[#33A1E0] font-bold">
                  <FaImage />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-10 md:right-[30%] lg:right-[10%] w-14 h-14">
              {personalInfo.smallAvatar ? (
                <img
                  src={personalInfo.smallAvatar}
                  alt="Small avatar next to main avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-[#33A1E0] shadow bg-white absolute bottom-2 right-2"
                />
              ) : (
                <span className="text-[#33A1E0] text-2xl">&#128515;</span>
              )}
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
            className="text-7xl sm:text-8xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text drop-shadow-xl pb-2"
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
            className="text-[#154D71] text-2xl sm:text-4xl font-bold"
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
            className="text-[#33A1E0] sm:text-lg opacity-90 lg:max-w-[400px] font-medium"
          >
            I have a passion for{" "}
            <span className="text-[#154D71] font-bold">
              website development
            </span>{" "}
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
              title="Contact"
              className=" font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShowCase;
