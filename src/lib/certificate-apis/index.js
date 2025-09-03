// Include all certificate-related API functions 

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

// 1. Get all certificates
export const getAllCertificates = async () => {
  const querySnapshot = await getDocs(collection(db, "cers"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 2. Get a certificate by ID
export const getCertificateById = async (id) => {
  const docRef = doc(db, "cers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
    return null;
  }
};
