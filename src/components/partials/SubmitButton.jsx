import PropTypes from 'prop-types';

const SubmitButton= (props) => {  
  const {title} = props; 
  return (
    <button type='submit' className={`bg-[#C8ACD6] shadow-lg px-4 py-3 inline rounded-sm uppercase font-bold text-[#221A51] hover:scale-110 transition-transform cursor-pointer`}>{title}</button>
  )
}

// Validate parameter's value 
SubmitButton.propTypes = {
    title: PropTypes.string,
}
export default SubmitButton