import { useContext, useEffect } from "react";
import "./App.css";
import NavigationBar from "./components/partials/NavigationBar";
import SideBar from "./components/visitor/SideBar";
import { SidebarContext } from "./contexts/SidebarContext";
import { AnimatePresence } from "framer-motion";
import ShowCase from "./components/visitor/ShowCase";
import Projects from "./components/visitor/Projects";
import Skills from "./components/visitor/Skills";
import Certificates from "./components/visitor/Certificates";
import DetailedCertificate from "./components/partials/DetailedCertificate";
import { ShowCertificateContext } from "./contexts/ShowCertificateContext";
import Contact from "./components/visitor/Contact";
import ToTop from "./components/partials/ToTop";
import Tools from "./components/visitor/Tools";
import useToast from "./hooks/toast-hook";
import { useLoading } from "./lib/loading-context";
import Toast from "./components/partials/Toast";
import AdminLoading from "./components/partials/AdminLoading";
import { ThemeContext } from "./contexts/ThemeContext";
import { trackPageView } from "./lib/analytics-apis";

const Home = () => {
  const { isSidebar } = useContext(SidebarContext);
  const { zoomCertificate, certificate } = useContext(ShowCertificateContext);
  const { theme } = useContext(ThemeContext);
  const { toast } = useToast();
  const { loading } = useLoading();

  // Track page view
  useEffect(() => {
    trackPageView("Home", window.location.pathname);
  }, []);

  const colorBasedOnTheme = {
    "christmas": "bg-[rgba(0,0,0,.9)] text-white",
    "default": "bg-white",
    "new-year": "bg-[#9F0D18] text-white",
    "dark-mode": "bg-[rgba(0,0,0,.9)]",
  };
  return (
    <div
      id="top"
      className={`relative ${colorBasedOnTheme[theme?.themeSlug] || colorBasedOnTheme["default"]}  min-h-screen max-w-screen overflow-hidden font-test`}
    >
      {/* Toast */}
      <AnimatePresence>{toast.show && <Toast />}</AnimatePresence>

      {/* Loading Spinner */}
      {loading.show && <AdminLoading text={loading.text} />}
      {/* <motion.div
        className="fixed h-[12px] w-full top-0 left-0 origin-left z-50 rounded-b-xl shadow-lg"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #33A1E0 0%, #154D71 100%)",
          boxShadow: "0 2px 16px 0 rgba(51,161,224,0.15)",
          backdropFilter: "blur(2px)",
        }}
      /> */}
      <NavigationBar />
      <AnimatePresence>{isSidebar && <SideBar />}</AnimatePresence>
      <ShowCase />
      <Projects />
      <Skills />
      <Tools />
      <Certificates />
      <AnimatePresence>
        {zoomCertificate && certificate !== "" && <DetailedCertificate />}
      </AnimatePresence>
      <Contact />
      <ToTop />
    </div>
  );
};

export default Home;
