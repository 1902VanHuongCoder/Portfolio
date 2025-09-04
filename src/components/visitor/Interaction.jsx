import  { useState, } from 'react';
import { db } from '../../firebase_setup/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { FaThumbsUp } from 'react-icons/fa';
import { useLoading } from '../../lib/loading-context';
import useToast from '../../hooks/toast-hook';

const LikeButton = () => {
  // Loading context
  const { showLoading, hideLoading } = useLoading();

  // Toast context
  const { showToast } = useToast(); 
  
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!isLiked) {
      setIsLiked(true);
      showLoading();
      const likeRef = doc(db, "likes", "likeDocument");

      try {
        await updateDoc(likeRef, {
          count: increment(1),
        });
        hideLoading();
        showToast("success", "Thank you for your like!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error updating like count: ", error);
        setIsLiked(false); // Revert state if update fails
      }
    } else {
      console.log("Already liked");
    }
  };

  return (
    <div className=" w-fit gap-y-3 px-3 sm:px-0">
      <button
        onClick={handleLike}
        disabled={isLiked}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[#154D71] border border-[#33A1E0] font-bold shadow hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>Give me a like</span>
        <FaThumbsUp className="text-xl" />
      </button>
    </div>
  );
};


export default LikeButton;
