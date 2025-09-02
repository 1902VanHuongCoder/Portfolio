// File includes all project-related API calls

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

// 1. Get all projects
async function getAllProjects() {
  const projectCollection = collection(db, "projects");
  const snapshot = await getDocs(projectCollection);
  const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return projects;
}

// 2. Create a new document into projects collection
async function createNewProject(projectData) {
  const projectCollection = collection(db, "projects");
  const docRef = await addDoc(projectCollection, projectData);
  return docRef.id;
}

// 3. Delete a project document
async function deleteProject(projectID) {
  const projectDoc = doc(db, "projects", projectID);
  await deleteDoc(projectDoc);
}


// 4. Get 1 document from collection 
async function getProjectById(projectID) {
  const projectDoc = doc(db, "projects", projectID);
  const docSnap = await getDoc(projectDoc);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
    return null;
  }
}


// 5. Update a document
async function updateProject(projectID, projectData) {
  const projectDoc = doc(db, "projects", projectID);
  await updateDoc(projectDoc, projectData);
}

export { getAllProjects, createNewProject, deleteProject, getProjectById, updateProject };
