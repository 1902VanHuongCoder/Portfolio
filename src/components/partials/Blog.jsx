import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Blog = ({ imageUrl, title, date, blogId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/detail/${blogId}`);
  };

  return (
    <div 
      className="relative overflow-hidden shadow-lg border-b-[1px] border-b-solid border-b-[rgba(255,255,255,.2)] cursor-pointer"
      onClick={handleClick}
    >
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 hover:opacity-80 transition-opacity">
        <h3 className="text-white text-left text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center text-white text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
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
