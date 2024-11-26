import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AdminLogin() {
  const { adminLogin, error, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await adminLogin(username, password);
      if (success) {
        navigate("/admin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="absolute inset-0 min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#43D277]/10 to-[#38b366]/10 rounded-full mix-blend-overlay filter blur-3xl"
          animate={{
            x: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            y: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md p-8 mx-4"
      >
        <div className="relative backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 border border-[#43D277]/20 bg-black/30">
          {/* Admin badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#43D277] to-[#38b366] px-4 py-1 rounded-full"
          >
            <span className="text-black text-sm font-medium">Admin Portal</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8 mt-4">
            <h2 className="text-4xl font-bold text-center">
              <span className="bg-gradient-to-r from-[#43D277] via-white to-[#43D277] bg-clip-text text-transparent">
                Administrator Access
              </span>
            </h2>
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-[#43D277] to-[#38b366] mx-auto mt-4 rounded-full"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <motion.label
                whileHover={{ x: 5 }}
                className="block text-[#43D277] text-sm font-medium mb-2"
                htmlFor="username"
              >
                Admin Username
              </motion.label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[#43D277]/20 text-white
                          placeholder-[#43D277]/30 focus:outline-none focus:ring-2 focus:ring-[#43D277]/30
                          transition-all duration-300 hover:bg-black/40"
                placeholder="Enter admin username"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.label
                whileHover={{ x: 5 }}
                className="block text-[#43D277] text-sm font-medium mb-2"
                htmlFor="password"
              >
                Admin Password
              </motion.label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[#43D277]/20 text-white
                          placeholder-[#43D277]/30 focus:outline-none focus:ring-2 focus:ring-[#43D277]/30
                          transition-all duration-300 hover:bg-black/40"
                placeholder="Enter admin password"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 px-6 rounded-xl overflow-hidden
                         font-medium text-white shadow-lg transition-all duration-300
                         disabled:opacity-70 disabled:cursor-not-allowed
                         bg-gradient-to-r from-[#43D277] to-[#38b366]
                         hover:shadow-[#43D277]/25 active:shadow-[#43D277]/15"
              >
                <motion.span
                  className="relative z-10"
                  animate={isLoading ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isLoading ? "Authenticating..." : "Access Admin Panel"}
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Back to user login link */}
            <motion.div variants={itemVariants} className="text-center mt-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/login"
                className="text-sm text-[#43D277]/80 hover:text-[#43D277] transition-colors"
              >
                ← Back to User Login
              </motion.a>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
