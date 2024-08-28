import { useContext } from "react";
import "./App.css";
import NavigationBar from "./components/partials/NavigationBar";
import SideBar from "./components/SideBar";
import { SidebarContext } from "./contexts/SidebarContext";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import ShowCase from "./components/ShowCase";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certificates from "./components/Certificates";
import DetailedCertificate from "./components/partials/DetailedCertificate";
import { ShowCertificateContext } from "./contexts/ShowCertificateContext";
import Contact from "./components/Contact";
import ToTop from "./components/partials/ToTop";
import ParallaxText from "./components/ParallaxText";
const Home = () => {
  const { isSidebar } = useContext(SidebarContext);
  const { zoomCertificate, certificate } = useContext(ShowCertificateContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <div
      id="top"
      className="relative bg-[#2E236C] min-h-screen max-w-screen overflow-hidden font-test"
    >
      <motion.div
        className="fixed h-[10px] w-full top-0 left-0 origin-left bg-[#C8ACD6] shadow-lg shadow-[#C8ACD6]/50 z-50"
        style={{ scaleX }}
      />
      <NavigationBar />
      <AnimatePresence>{isSidebar && <SideBar />}</AnimatePresence>
      <ShowCase />
      <Projects />
      <Skills />
      <section className="h-[200px]">
        <ParallaxText baseVelocity={-5}>Paul To</ParallaxText>
        <ParallaxText baseVelocity={5}>LOVE CHALLENGE</ParallaxText>
      </section>
      <Certificates />s
      <AnimatePresence>
        {zoomCertificate && certificate !== "" && <DetailedCertificate />}
      </AnimatePresence>
      <Contact />
      <ToTop />
    </div>
  );
};

export default Home;
