import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 p-10 gap-y-5 flex-wrap">
      <h1 className="text-4xl font-bold text-indigo-600">Admin Dashboard</h1>
      <div className="mt-5 flex flex-col sm:flex-row gap-y-6 sm:gap-x-6">
        <Link 
          to="/projects" 
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition duration-200"
        >
          Go to Projects
        </Link>
        <Link 
          to="/skills" 
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition duration-200"
        >
          Go to Skills
        </Link>

        <Link 
          to="/certificates" 
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition duration-200"
        >
          Go to Certificates
        </Link>
        <Link 
          to="/add/blogs" 
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition duration-200"
        >
          Add blog
        </Link>
      </div>
    </div>
  );
}

export default Admin;