// Import necessary dependencies from React
import { createContext, useState } from "react";
import PropTypes from 'prop-types';

// Create a context for the sidebar blog list
export const SideBarBlogListContext = createContext(false);

// SideBarBlogListProvider component to manage the sidebar state
export default function SideBarBlogListProvider({ children }) {
  // State to control the visibility of the sidebar
  const [isShow, setShow] = useState(false); 

  return (
    // Provide the sidebar state and setter function to child components
    <SideBarBlogListContext.Provider value={{ isShow: isShow, setShow: setShow }}>
      {children}
    </SideBarBlogListContext.Provider>
  );
}

// Validate the children prop
SideBarBlogListProvider.propTypes = {
    children: PropTypes.node,
}