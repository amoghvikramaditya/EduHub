import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between p-4 w-full px-[20%] mx-auto bg-white border-b">
      <Link
        to={isAuthenticated ? "/dashboard" : "/"}
        className="text-2xl font-bold"
      >
        EduHub
      </Link>
      <div className="flex items-center gap-6">
        <a
          href="#features"
          className="text-sm text-black font-medium hover:underline"
        >
          Features
        </a>
        {isAuthenticated ? (
          <>
            <Button>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline">
              <Link to="/sign-up">Sign Up</Link>
            </Button>
            <Button>
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
