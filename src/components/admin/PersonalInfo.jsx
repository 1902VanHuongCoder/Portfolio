  import { useState, useEffect } from "react";
  import { db } from "../../firebase_setup/firebase";
  import { doc, setDoc, getDoc } from "firebase/firestore";
  import useToast from "../../hooks/toast-hook";
  import { useLoading } from "../../lib/loading-context";
  import { uploadImage } from "../../lib/cloundinary";

  const PersonalInfo = () => {
    // Toast context
    const { showToast } = useToast();

    // Loading context
    const { showLoading, hideLoading } = useLoading();


    // Form state to manage personal information
    const [form, setForm] = useState({
      avatar: "",
      smallAvatar: "",
      name: "",
      email: "",
      phone: "",
      facebook: "",
      youtube: "",
      role: "",
    });

    // Store avatar file is uploaded from local
    const [avatarFile, setAvatarFile] = useState(null);
    // Store small avatar file
    const [smallAvatarFile, setSmallAvatarFile] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((f) => ({ ...f, [name]: value }));
    };


    // Change current avatar file and create local avatar url to allow preview image
    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAvatarFile(file);
        setForm((f) => ({ ...f, avatar: URL.createObjectURL(file) }));
      }
    };

    // Change current small avatar file and create local url for preview
    const handleSmallAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSmallAvatarFile(file);
        setForm((f) => ({ ...f, smallAvatar: URL.createObjectURL(file) }));
      }
    };



    const handleChangePersonalInfo = async (e) => {
      e.preventDefault();
      showLoading();

      let avatarUrl = form.avatar;
      let avatarPublicId = "";
      if (avatarFile) {
        const { secure_url, public_id } = await uploadImage(avatarFile);
        avatarUrl = secure_url;
        avatarPublicId = public_id;
      }

      let smallAvatarUrl = form.smallAvatar;
      let smallAvatarPublicId = "";
      if (smallAvatarFile) {
        const { secure_url, public_id } = await uploadImage(smallAvatarFile);
        smallAvatarUrl = secure_url;
        smallAvatarPublicId = public_id;
      }

      await setDoc(doc(db, "personalInfo", "main"), {
        ...form,
        avatar: avatarUrl,
        publicId: avatarPublicId,
        smallAvatar: smallAvatarUrl,
        smallAvatarPublicId: smallAvatarPublicId,
      });
      hideLoading();
      showToast("success","Personal information updated successfully!");
    };

    // Fetch personal information to show in the form
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

    return (
      <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#2E236C] via-[#154D71] to-[#33A1E0] flex items-center justify-center py-12">
        <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-[#33A1E0]/20">
          <h2 className="text-3xl font-extrabold mb-2 text-[#2E236C] drop-shadow">Personal Info</h2>
          <p className="mb-6 text-[#154D71] text-sm font-medium">Update your personal information for your portfolio profile.</p>
          <form onSubmit={handleChangePersonalInfo} className="space-y-5">
            <div className="flex flex-col items-center gap-3 mb-4">
              <label className="font-semibold text-[#154D71]">Avatar</label>
              <div className="flex flex-row items-center gap-6">
                <div className="relative">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="avatar preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#33A1E0] shadow-lg bg-white"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-[#33A1E0]/10 border-4 border-[#33A1E0] flex items-center justify-center text-4xl text-[#33A1E0] font-bold shadow-lg">
                      ?
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                    title="Change avatar"
                  />
                </div>
                {/* Small avatar preview and upload */}
                <div className="relative">
                  {form.smallAvatar ? (
                    <img
                      src={form.smallAvatar}
                      alt="small avatar preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#33A1E0] shadow bg-white"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#33A1E0]/10 border-2 border-[#33A1E0] flex items-center justify-center text-2xl text-[#33A1E0] font-bold shadow">
                      ?
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSmallAvatarChange}
                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                    title="Change small avatar"
                  />
                </div>
              </div>
              <span className="text-xs text-[#154D71]">Main avatar (left), Small avatar (right)</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-[#2E236C] bg-white"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-[#2E236C] bg-white"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-[#2E236C] bg-white"
              />
              <input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Facebook Link"
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-[#2E236C] bg-white"
              />
              <input
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                placeholder="YouTube Link"
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-[#2E236C] bg-white"
              />
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Role"
                className="w-full px-3 py-2 border-[2px] border-[#33A1E0]/30 rounded focus:outline-none focus:border-[#33A1E0] text-[#2E236C] bg-white"
              />
            </div>
            {/* Add a field to allow upload an image for small avatar next to main avatar */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#33A1E0] to-[#2E236C] text-white rounded-xl font-bold text-lg shadow hover:from-[#154D71] hover:to-[#33A1E0] transition"
            >
              Save Info
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default PersonalInfo;
