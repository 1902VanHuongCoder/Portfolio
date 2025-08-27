// import { IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react";
import Certificate from "./partials/Certificate";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../firebase_setup/firebase";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cers"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCertificates(usersData);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        // Optionally, you can set an error state here to show to the user
      }
    };

    fetchData();

    // Cleanup function to unsubscribe from any listeners if needed
    return () => {
      // Add any cleanup code here if necessary
    };
  }, []);
  return (
    <section
      id="certificates"
      className="relative w-full min-h-screen px-8 pt-12 pb-16 flex flex-col items-center justify-center border-t-[2px] border-dashed border-t-[#e0e7ef]"
    >
      {/* Decorative gradient ring */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text drop-shadow-xl mb-2 text-left w-full">
          Certificates
        </h2>
        <p className="text-[#154D71] text-lg sm:text-2xl font-semibold opacity-80 mb-8 text-left w-full">
          My achievements and certifications in web development and technology.
        </p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          {certificates.map((item, index) => (
            <div key={index} className="flex items-center justify-center">
              <Certificate
                certificate={item.certificate}
                certificateContent={item.certificateContent}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
