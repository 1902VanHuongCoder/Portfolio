import { useState, useEffect } from "react";
import { db, storage } from "../../firebase_setup/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const PersonalInfo = () => {
  const [form, setForm] = useState({
    avatar: "",
    name: "",
    email: "",
    phone: "",
    facebook: "",
    youtube: "",
    role: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      const docRef = doc(db, "personalInfo", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      }
    };
    fetchPersonalInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setForm((f) => ({ ...f, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let avatarUrl = form.avatar;
    if (avatarFile) {
      // delete old avatar
      const oldAvatarPath = form.avatar.split("/o/")[1].split("?")[0];
      const oldAvatarRef = storageRef(storage, oldAvatarPath);
      await deleteObject(oldAvatarRef);
      
      const storagePath = `personal-info/avatar-${Date.now()}-${avatarFile.name}`;
      const storageReference = storageRef(storage, storagePath);
      await uploadBytes(storageReference, avatarFile);
      avatarUrl = await getDownloadURL(storageReference);
    }
    await setDoc(doc(db, "personalInfo", "main"), {
      ...form,
      avatar: avatarUrl,
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Personal Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <label className="font-semibold">Avatar</label>
          {form.avatar && (
            <img
              src={form.avatar}
              alt="avatar preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          name="facebook"
          value={form.facebook}
          onChange={handleChange}
          placeholder="Facebook Link"
          className="w-full p-2 border rounded"
        />
        <input
          name="youtube"
          value={form.youtube}
          onChange={handleChange}
          placeholder="YouTube Link"
          className="w-full p-2 border rounded"
        />
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded font-bold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Info"}
        </button>
        {success && <div className="text-green-600 text-center">Saved!</div>}
      </form>
    </div>
  );
};

export default PersonalInfo;
