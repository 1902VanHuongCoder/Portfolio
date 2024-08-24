import { useContext } from "react";
import "./App.css";
import NavigationBar from "./components/partials/NavigationBar";
import SideBar from "./components/SideBar";
import { SidebarContext } from "./contexts/SidebarContext";
import { AnimatePresence } from "framer-motion";

function App() {
  const { isSidebar } = useContext(SidebarContext);
  return (
    <div className="relative bg-[#2E236C] min-h-screen w-screen font-test">
      <NavigationBar />
      <AnimatePresence>{isSidebar && <SideBar />}</AnimatePresence>
    </div>
  );
}

export default App;
