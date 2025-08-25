import PropTypes from 'prop-types';

const SubmitButton= (props) => {  
  const {title} = props; 
  return (
    <button
      type="submit"
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#154D71] to-[#33A1E0] text-white font-bold shadow hover:scale-105 transition-transform`}
    >
      {title}
    </button>
  );
}

// Validate parameter's value 
SubmitButton.propTypes = {
    title: PropTypes.string,
}
export default SubmitButton