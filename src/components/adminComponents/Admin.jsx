import { Link } from "react-router-dom"

const Admin = () => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-y-20">
      <h1>Admin</h1>
      <Link to="/projects">Projects</Link>
    </div>
  )
}

export default Admin