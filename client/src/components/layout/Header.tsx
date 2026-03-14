import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, LogOut, ArrowRight, Sparkles } from "lucide-react";

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
      className="fixed top-0 left-0 right-0 z-50 bg-surface/40 backdrop-blur-2xl border-b border-white/[0.08]"
    >
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center
              group-hover:from-primary-400 group-hover:to-accent-purple transition-all duration-500 shadow-glow-sm group-hover:shadow-glow-md ring-1 ring-white/10">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-300 transition-colors duration-300">ResumeAI</span>
              <span className="hidden md:inline text-[10px] tracking-[0.18em] uppercase text-gray-500 mt-1">Career Intelligence Suite</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {!isHome && isLoggedIn && (
              <Link
                to="/upload"
                className="text-sm font-semibold text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                New Analysis
              </Link>
            )}
            {!isLoggedIn && (
              <Link
                to="/#features"
                className="hidden md:inline text-sm font-semibold text-gray-400 hover:text-white transition-all duration-300"
              >
                Learn More
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-primary-300" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
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
