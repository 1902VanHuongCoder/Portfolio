import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const ShowCertificateContext = createContext(false);

export default function ShowCertificateProvider({ children }) {
  const [zoomCertificate, setzoomCertificate] = useState(false);
  const [certificate, setCertificate] = useState("");
  return (
    <ShowCertificateContext.Provider
      value={{
        zoomCertificate: zoomCertificate,
        func: setzoomCertificate,
        certificate: certificate,
        setCertificate: setCertificate,
      }}
    >
      {children}
    </ShowCertificateContext.Provider>
  );
}

// Validate parameter's value
ShowCertificateProvider.propTypes = {
  children: PropTypes.node,
};
