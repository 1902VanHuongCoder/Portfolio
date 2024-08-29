// import { IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react";
import Certificate from "./partials/Certificate";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "cers"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCertificates(usersData);
    };
    fetchData();
  }, []);
  console.log(certificates);
  return (
    <div
      id="certificates"
      className="relative min-h-screen bg-[#2E236C] w-full px-4  pb-20"
    >
      <div className="flex items-center gap-x-2 pl-4">
        <span className="h-[50px] w-[6px] bg-[#C8ACD6]"></span>
        <p className="text-white text-2xl">Certificates</p>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {certificates.map((item, index) => (
          <Certificate
            key={index}
            certificate={item.certificate}
            certificateContent={item.certificateContent}
          />
        ))}
      </div>
    </div>
  );
};

export default Certificates;
