import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SidebarProvider from "./contexts/SidebarContext.jsx";
import ShowCertificateProvider from "./contexts/ShowCertificateContext.jsx";
import SideBarBlogListProvider from "./contexts/SideBarBlogListContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <ShowCertificateProvider>
        <SideBarBlogListProvider>
          <App />
        </SideBarBlogListProvider>
      </ShowCertificateProvider>
    </SidebarProvider>
  </StrictMode>
);
