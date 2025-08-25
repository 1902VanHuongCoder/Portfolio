import  { useState, } from 'react';
import { db } from '../firebase_setup/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { FaThumbsUp } from 'react-icons/fa';

const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);
  

  const handleLike = async () => {
    console.log("hello");
    if (!isLiked) {
      setIsLiked(true);
      
      const likeRef = doc(db, 'likes', 'likeDocument');
      
      try {
        await updateDoc(likeRef, {
          count: increment(1)
        });
        console.log("Like count updated successfully");
      } catch (error) {
        console.error("Error updating like count: ", error);
        setIsLiked(false); // Revert state if update fails
      }
    } else {
      console.log("Already liked");
    }
  };

  return (
    <div className="flex items-start flex-col w-full gap-y-3 px-3 sm:px-0 pb-5">
      <span className="text-[#154D71]">
        Create motivation by giving me a like!
      </span>
      <button
        onClick={handleLike}
        disabled={isLiked}
        className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold shadow hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>Like</span>
        <FaThumbsUp className="text-xl" />
      </button>
    </div>
  );
};

export default LikeButton;
