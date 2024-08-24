import './App.css'
import Button from './components/partials/Button'
import Project from './components/partials/Project'
import SubmitButton from './components/partials/SubmitButton'
import SkillCard from './components/SkillCard'

function App() {
  return (
    <div className='bg-[#2E236C] min-h-screen w-screen flex flex-col justify-center items-center font-test'>

        <Button title="Contact"/>
        <SubmitButton title="Submit"/>
        <div className='flex flex-col gap-y-5 items-center'>
        <Project projectName="Beach Website TailwindCSS ReactJS" githubLink="https://github.com/1902VanHuongCoder?tab=repositories" demoLink="https://beach-traveling-homepage-tw-rjs-demo.netlify.app" completeTime="10-09-2023"/>
        <Project projectName="Beach Website TailwindCSS ReactJS" githubLink="https://github.com/1902VanHuongCoder?tab=repositories" demoLink="https://beach-traveling-homepage-tw-rjs-demo.netlify.app" completeTime="10-09-2023"/>
        <SkillCard tech="ReactJS" logoTechLink="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGmKtrnxElpqw3AExKXPWWBulcwjlvDJa1Q&s" />
        <SkillCard tech="ReactJS" logoTechLink="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGmKtrnxElpqw3AExKXPWWBulcwjlvDJa1Q&s" />
        <SkillCard tech="TailwindCSS" logoTechLink="https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_167923.png" />
        </div>
    </div>
  )
}

export default App
