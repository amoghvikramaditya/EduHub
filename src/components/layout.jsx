import { Link } from "react-router-dom";
import { Search, Home, BookOpen, MessageSquare } from "lucide-react";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <div className="w-60 border-r flex-shrink-0 p-6 flex flex-col gap-6">
        <Link to="/" className="text-2xl font-bold">
          EduHub
        </Link>
        <nav className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>
          <Link
            to="/forum"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <MessageSquare size={20} />
            <span>Forum</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <Search size={20} />
            <span>Search</span>
          </Link>
        </nav>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
