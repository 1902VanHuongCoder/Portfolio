import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// Context shape: { show: boolean, text: string }
const LoadingContext = createContext();
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({ show: false, text: "Loading..." });

  // Show loading overlay
  const showLoading = useCallback((text = "Loading...") => {
    setLoading({ show: true, text });
  }, []);

  // Hide loading overlay
  const hideLoading = useCallback(() => {
    setLoading((l) => ({ ...l, show: false }));
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useLoading = () => useContext(LoadingContext);
