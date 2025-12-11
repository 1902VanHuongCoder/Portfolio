import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ManipulateOnProjects from "./components/admin/Projects";
import ManipulateOnSkills from "./components/admin/Skills";
import ManipulateOnCertificates from "./components/admin/Certificates";
import BlogsList from "./components/visitor/BlogsList";
import BlogDetail from "./components/visitor/BlogDetail";
import { AnimatePresence } from "framer-motion";
import SideBarBlogList from "./components/partials/SideBarBlogList";
import { useContext } from "react";
import { SideBarBlogListContext } from "./contexts/SideBarBlogListContext";
import AdminLayout from "./components/admin/AdminLayout";
import ManipulateOnBlogs from "./components/admin/Blogs";
import SourceCodeAdmin from "./components/admin/Source";
import ExChangeSource from "./components/visitor/ExChangeSource";
import ViewSourceDetail from "./components/visitor/ViewSourceDetail";
import UpdateBlog from "./components/admin/UpdateBlog";
import PersonalInfo from "./components/admin/PersonalInfo";
import EditSourceCodeAdmin from "./components/admin/EditSource";
import Comments from "./components/admin/Comments";
import Media from "./components/admin/Media";
import Theme from "./components/admin/Theme";
import RemoveBackground from "./components/visitor/RemoveBackground";

function App() {
  const { isShow } = useContext(SideBarBlogListContext);
  
  return (
    <div className="w-full h-full">
      <BrowserRouter future={{ v7_startStransition: true }}>
        <AnimatePresence>{isShow && <SideBarBlogList />}</AnimatePresence>
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
          
          <Route path="/remove-bg-tool" element={<RemoveBackground />} />
          
          
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
            <Route path="comments" element={<Comments />} />
            <Route path="media" element={<Media />} />
            <Route
              path="edit/source-code/:id"
              element={<EditSourceCodeAdmin />}
            />
            <Route path="themes" element={<Theme />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
