import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Blog = ({ imageUrl, title, date, blogId }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/blog/detail/${blogId}`);
  };
  

  return (
    <div
      className="relative h-fit cursor-pointer space-y-4"
      onClick={handleClick}
    >
      <div className='relative h-fit w-full translate-y-9 px-2 shadow-lg hover:translate-y-3 hover:rotate-6 transition-transform duration-300'>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-md"
        />
      </div>
      <div className="relative bg-white px-4 py-3 rounded-tr-lg rounded-tl-lg z-5 shadow-xl rounded-b-md">
        <h3 className="text-[#33A1E0] text-left text-lg font-semibold mb-2">
          {title}
        </h3>
        <div className="flex items-center text-black text-sm">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          {date}
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  blogId: PropTypes.string.isRequired,
};

export default Blog;
