import SubmitButton from "./partials/SubmitButton";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import LikeButton from "./Interaction";
const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    yourName: "",
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "comments"), formData);
      window.location.reload();
    } catch (error) {
      alert("Lỗi rồi mày ơi!" + error);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full px-2 py-12 flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#c7d2fe]"
    >
      {/* Decorative gradient ring */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[#33A1E0]/30 via-[#154D71]/10 to-transparent rounded-full blur-3xl z-0"></div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <p className="text-xl font-bold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text">
            Get In Touch
          </p>
          <h2 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-[#154D71] via-[#33A1E0] to-[#154D71] text-transparent bg-clip-text drop-shadow-xl pt-2">
            Contact Me
          </h2>
        </div>
        <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-[#e0e7ef]">
          <form
            onSubmit={handleSubmitContact}
            className="flex flex-col items-start w-full gap-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-x-6 w-full gap-y-6">
              <input
                className="bg-white/70 placeholder:text-[#154D71] font-normal p-4 rounded-xl text-[#154D71] outline-none w-full border border-[#33A1E0]/30 focus:bg-white/90 focus:border-[#33A1E0] transition"
                type="text"
                autoComplete="true"
                placeholder="Enter your email"
                name="email"
                id="email"
                onChange={handleChange}
                value={formData.email}
              />
              <input
                className="bg-white/70 placeholder:text-[#154D71] font-normal p-4 rounded-xl text-[#154D71] w-full outline-none border border-[#33A1E0]/30 focus:bg-white/90 focus:border-[#33A1E0] transition"
                type="text"
                autoComplete="true"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.yourName}
                name="yourName"
                id="yourName"
              />
            </div>
            <textarea
              rows={5}
              name="comment"
              onChange={handleChange}
              value={formData.comment}
              id="comment"
              className="bg-white/70 font-normal p-4 rounded-xl text-[#154D71] w-full outline-none border border-[#33A1E0]/30 focus:bg-white/90 focus:border-[#33A1E0] transition placeholder:text-[#154D71]"
              placeholder="Enter your comment"
            />
            <div className="flex justify-end w-full gap-x-2">
              <LikeButton />
              <SubmitButton title="Submit" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
