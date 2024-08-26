import PropTypes from 'prop-types';

const SkillCard= (props) => {  
  const {tech, logoTechLink} = props; 
  return (
    <div className='bg-[#221A51] w-[100%] rounded-[6px] flex flex-col items-center justify-between gap-y-2 py-4'>
        <div className='w-[50px] h-[50px] overflow-hidden rounded-full border-[3px] border-solid border-white shadow-inner'>
            <img className='w-full h-full object-cover' src={logoTechLink} />
        </div>
        <div className='text-white'>
            {tech}
        </div>
    </div>
  )
}

// Validate parameter's value 
SkillCard.propTypes = {
    tech: PropTypes.string,
    logoTechLink: PropTypes.string,
}
export default SkillCard