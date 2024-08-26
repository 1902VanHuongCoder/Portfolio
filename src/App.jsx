import { useContext } from "react";
import "./App.css";
import NavigationBar from "./components/partials/NavigationBar";
import SideBar from "./components/SideBar";
import { SidebarContext } from "./contexts/SidebarContext";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import ShowCase from "./components/ShowCase";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  const { isSidebar } = useContext(SidebarContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <div className="relative bg-[#2E236C] min-h-screen max-w-screen overflow-hidden font-test">
      <motion.div className="fixed h-[10px] w-full top-0 left-0 origin-left bg-[#C8ACD6] shadow-lg shadow-[#C8ACD6]/50 z-50" style={{ scaleX }} />
      <NavigationBar />
      <AnimatePresence>{isSidebar && <SideBar />}</AnimatePresence>
      <ShowCase />
      <Projects />
      <Skills />
    </div>
  );
}

export default App;
