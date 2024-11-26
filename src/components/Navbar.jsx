import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-md border-b border-[#43D277]/20"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-[#43D277]">
              Mystery Box
            </span>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Credits Badge */}
            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-[#43D277]/20">
              <span className="text-sm text-[#43D277]/80">Credits: </span>
              <span className="text-[#43D277] font-bold">
                {user?.credits || 0}
              </span>
            </div>

            {/* Username */}
            <span className="text-[#43D277]/80 text-sm hidden sm:block">
              {user?.username}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-[#43D277]/10 hover:bg-[#43D277]/20 text-[#43D277] px-4 py-1.5 rounded-full text-sm transition-all duration-200 border border-[#43D277]/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
