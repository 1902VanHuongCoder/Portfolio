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
    <div className="flex items-start space-x-2 mt-10 flex-col w-full gap-y-3 px-3 pb-5">
      <span className='text-white'>Create motivation by giving me a like</span>
      <button 
        onClick={handleLike}
        className={`p-2 border-2 border-blue-500 rounded-full transition-colors duration-200 ${isLiked ? 'bg-blue-500 text-white' : 'text-blue-500'} text-4xl`}
      >
        <FaThumbsUp />
      </button>
    </div>
  );
};

export default LikeButton;
