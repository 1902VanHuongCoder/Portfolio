import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ManipulateOnProjects from "./components/adminComponents/ManipulateOnProjects";
import Admin from "./components/adminComponents/Admin";
import ManipulateOnSkills from "./components/adminComponents/ManipulateOnSkills";
import ManipulateOnCertificates from "./components/adminComponents/ManipulateOnCertificates";
import AddBlogPost from "./components/adminComponents/ManipulateOnBlogs";
import BlogsList from "./components/BlogsList";
import BlogDetail from "./components/BlogDetail";
import { AnimatePresence } from "framer-motion";
import SideBarBlogList from "./components/partials/SideBarBlogList";
import { useContext } from "react";
import { SideBarBlogListContext } from "./contexts/SideBarBlogListContext";

function App() {
  const { isShow } = useContext(SideBarBlogListContext);
  return (
    <div className="w-full h-full">
      <AnimatePresence>{isShow && <SideBarBlogList />}</AnimatePresence>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/projects" element={<ManipulateOnProjects />}></Route>
          <Route path="/skills" element={<ManipulateOnSkills />}></Route>
          <Route
            path="/certificates"
            element={<ManipulateOnCertificates />}
          ></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/add/blogs" element={<AddBlogPost />}></Route>
          <Route path="/blogs" element={<BlogsList />}></Route>
          <Route path="/blog/detail/:id" element={<BlogDetail />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
