import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SidebarProvider from "./contexts/SidebarContext.jsx";
import ShowCertificateProvider from "./contexts/ShowCertificateContext.jsx";
import SideBarBlogListProvider from "./contexts/SideBarBlogListContext.jsx";
import { ToastProvider } from "./lib/toast-context.jsx";
import { LoadingProvider } from "./lib/loading-context.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <ShowCertificateProvider>
        <SideBarBlogListProvider>
          <ToastProvider>
            <LoadingProvider>
            <HelmetProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
            </HelmetProvider>
            </LoadingProvider>
          </ToastProvider>
        </SideBarBlogListProvider>
      </ShowCertificateProvider>
    </SidebarProvider>
  </StrictMode>
);
