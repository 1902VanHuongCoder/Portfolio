import { createContext,  useState, useCallback } from "react";
import PropTypes from "prop-types";

// Toast context shape: { show: boolean, type: 'success' | 'error' | 'info' | 'warning', content: string }
export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, type: "info", content: "Thanks for accessing my portfolio!" });

  // Show toast with type and content
  const showToast = useCallback((type, content) => {
    setToast({ show: true, type, content });
    // Auto-hide after 3s
    // setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  // Hide toast manually
  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
