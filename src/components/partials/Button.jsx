import PropTypes from 'prop-types';

const Button= (props) => {  
  const {title, className, link} = props; 
  return (
    <a 
      href={link}
      className={`hover:scale-105 shadow-lg px-4 py-3 inline uppercase font-bold rounded-full transition-transform cursor-pointer ${className}`}
    >
      {title}
    </a>
  );
}

// Validate parameter's value 
Button.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    link: PropTypes.string,
}
export default Button