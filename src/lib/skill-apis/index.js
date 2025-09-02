// Include all skill-related API functions here 

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

// 1. Get all skills
export const getAllSkills = async () => {
  const querySnapshot = await getDocs(collection(db, "skills"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 2. Create a new skill
export const createSkill = async (skillData) => {
  try {
    const docRef = await addDoc(collection(db, "skills"), skillData);
    return { id: docRef.id, ...skillData };
  } catch (error) {
    console.error("Error creating skill: ", error);
    throw new Error("Error creating skill");
  }
};


// 3. Update an existing skill
export const updateSkill = async (id, skillData) => {
  try {
    const docRef = doc(db, "skills", id);
    await updateDoc(docRef, skillData);
    return { id, ...skillData };
  } catch (error) {
    console.error("Error updating skill: ", error);
    throw new Error("Error updating skill");
  }
};

// 4. Delete a skill
export const deleteSkill = async (id) => {
  try {
    const docRef = doc(db, "skills", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting skill: ", error);
    throw new Error("Error deleting skill");
  }
};

// 5. Get a document by doc ID
export const getSkillById = async (id) => {
  try {
    const docRef = doc(db, "skills", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Skill not found");
    }
  } catch (error) {
    console.error("Error fetching skill: ", error);
    throw new Error("Error fetching skill");
  }
};