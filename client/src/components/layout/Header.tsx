import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, LogOut } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/" || location.pathname === "/upload";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setUserName(localStorage.getItem("userName") || "");
  }, [location]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-surface/40 backdrop-blur-2xl border-b border-white/[0.06]"
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center
              group-hover:from-primary-400 group-hover:to-accent-purple transition-all duration-500 shadow-glow-sm group-hover:shadow-glow-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-300 transition-colors duration-300">ResumeAI</span>
          </Link>

          <nav className="flex items-center gap-6">
            {!isHome && (
              <Link
                to="/upload"
                className="text-sm font-semibold text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                New Analysis
              </Link>
            )}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center text-white text-xs font-bold shadow-glow-sm">
                    {getInitials(userName)}
                  </div>
                  {userName && (
                    <span className="text-sm font-semibold text-white hidden md:block">
                      {userName}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-400 hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
