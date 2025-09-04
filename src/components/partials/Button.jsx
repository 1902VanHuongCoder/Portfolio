import PropTypes from 'prop-types';

const Button= (props) => {  
  const {title} = props; 
  return (
    <a 
      href="#contact"
      className={`bg-[#33A1E0] hover:scale-105 text-white shadow-lg px-4 py-3 inline uppercase font-bold rounded-full transition-transform cursor-pointer`}
    >
      {title}
    </a>
  );
}

// Validate parameter's value 
Button.propTypes = {
    title: PropTypes.string,
}
export default Button