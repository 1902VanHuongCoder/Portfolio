import PropTypes from 'prop-types';

const Button= (props) => {  
  const {title} = props; 
  return (
    <div className={`bg-white shadow-lg px-4 py-3 inline rounded-sm uppercase font-bold text-[#221A51] hover:scale-110 transition-transform cursor-pointer`}>{title}</div>
  )
}

// Validate parameter's value 
Button.propTypes = {
    title: PropTypes.string,
}
export default Button