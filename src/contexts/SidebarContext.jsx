import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const SidebarContext = createContext(false);

export default function SidebarProvider({ children }) {
  const [isSidebar, setIsSidebar] = useState(false);
  return (
    <SidebarContext.Provider value={{ isSidebar: isSidebar, func: setIsSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Validate parameter's value 
SidebarProvider.propTypes = {
    children: PropTypes.node,
}