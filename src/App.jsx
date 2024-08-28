import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ManipulateOnProjects from "./components/adminComponents/ManipulateOnProjects";
import Admin from "./components/adminComponents/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
           <Home />
          }
        ></Route>
        <Route path="/projects" element={<ManipulateOnProjects />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
