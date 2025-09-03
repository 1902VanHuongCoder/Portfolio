import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ManipulateOnProjects from "./components/admin/Projects";
import ManipulateOnSkills from "./components/admin/Skills";
import ManipulateOnCertificates from "./components/admin/Certificates";
// import AddBlogPost from "./components/admin/ManipulateOnBlogs";
import BlogsList from "./components/BlogsList";
import BlogDetail from "./components/BlogDetail";
import { AnimatePresence } from "framer-motion";
import SideBarBlogList from "./components/partials/SideBarBlogList";
import { useContext } from "react";
import { SideBarBlogListContext } from "./contexts/SideBarBlogListContext";
import AdminLayout from "./components/admin/AdminLayout";
import ManipulateOnBlogs from "./components/admin/Blogs";
import SourceCodeAdmin from "./components/admin/SourceCodeAdmin";
import EditSourceCodeAdmin from "./components/admin/EditSourceCodeAdmin";
import ExChangeSource from "./components/ExChangeSource";
import ViewSourceDetail from "./components/ViewSourceDetail";
import UpdateBlog from "./components/admin/UpdateBlog";
import PersonalInfo from "./components/admin/PersonalInfo";

function App() {
  const { isShow } = useContext(SideBarBlogListContext);
  return (
    <div className="w-full h-full">
      <AnimatePresence>{isShow && <SideBarBlogList />}</AnimatePresence>
      <BrowserRouter future={{v7_startStransition: true}}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/projects" element={<ManipulateOnProjects />}></Route>
          <Route path="/skills" element={<ManipulateOnSkills />}></Route>
          <Route
            path="/certificates"
            element={<ManipulateOnCertificates />}
          ></Route>
          {/* <Route path="/add/blogs" element={<AddBlogPost />}></Route> */}
          <Route path="/blogs" element={<BlogsList />}></Route>
          <Route path="/blog/detail/:id" element={<BlogDetail />}></Route>
          <Route path="/exchange-source-code" element={<ExChangeSource />} />
          <Route
            path="/exchange-source-code/:id"
            element={<ViewSourceDetail />}
          />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<ManipulateOnProjects />} />
            <Route path="skills" element={<ManipulateOnSkills />} />
            <Route path="certificates" element={<ManipulateOnCertificates />} />
            <Route path="add/blogs" element={<ManipulateOnBlogs />} />
            <Route path="source-code" element={<SourceCodeAdmin />} />
            <Route path="blogs/update/:id" element={<UpdateBlog />} />
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route
              path="edit/source-code/:id"
              element={<EditSourceCodeAdmin />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
