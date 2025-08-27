import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="relative flex min-h-screen">
    {/* Sidebar */}
    <aside className="w-64 fixed top-0 left-0 h-screen bg-[#1075b4] text-white flex flex-col py-8 px-4 border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-8">Administrator</h2>
        <nav className="flex flex-col gap-4">
            <Link
                to="/admin/dashboard/projects"
                className="hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2"
            >
                {/* Project Icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/></svg>
                Projects
            </Link>
            <Link
                to="/admin/dashboard/skills"
                className="hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2"
            >
                {/* Skills Icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
                Skills
            </Link>
            <Link
                to="/admin/dashboard/certificates"
                className="hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2"
            >
                {/* Certificate Icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="2" fill="currentColor"/><path d="M8 20l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Certificates
            </Link>
            <Link
                to="/admin/dashboard/add/blogs"
                className="hover:bg-[#33A1E0] rounded px-3 py-2 flex items-center gap-2"
            >
                {/* Blog Icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Add Blog
            </Link>
        </nav>
    </aside>
    {/* Content */}
    <main className="ml-64 bg-gray-50 w-full">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
