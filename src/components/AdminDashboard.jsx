import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUserCredits,
  searchUsers,
  resetAllBoxes,
  setBoxColor,
  getBoxColor,
} from "../services/adminService";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    credits: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [currentBoxColor, setCurrentBoxColor] = useState("green");
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [usersData, colorData] = await Promise.all([
          getAllUsers(token),
          getBoxColor(token),
        ]);
        setUsers(usersData);
        setCurrentBoxColor(colorData);
      } catch (err) {
        setError("Failed to load initial data");
      }
    };

    loadInitialData();
  }, [token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true);
        try {
          const data = await searchUsers(token, searchTerm);
          setUsers(data);
        } catch (err) {
          setError("Failed to search users");
        } finally {
          setIsSearching(false);
        }
      } else {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUser(token, newUser);
      setSuccessMessage("User created successfully!");
      setShowCreateModal(false);
      setNewUser({ username: "", password: "", email: "", credits: 0 });
      await loadUsers();
    } catch (err) {
      setError("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setIsLoading(true);
    try {
      await deleteUser(token, userId);
      setSuccessMessage("User deleted successfully!");
      await loadUsers();
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCredits = async (userId, credits) => {
    setIsLoading(true);
    try {
      await updateUserCredits(token, userId, credits);
      setSuccessMessage("Credits updated successfully!");
      await loadUsers();
    } catch (err) {
      setError("Failed to update credits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetBoxes = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all boxes? This will remove all selections."
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      await resetAllBoxes(token);
      setSuccessMessage("All boxes have been reset successfully!");
    } catch (err) {
      setError("Failed to reset boxes");
    } finally {
      setIsResetting(false);
    }
  };

  const handleColorChange = async (color) => {
    setIsUpdatingColor(true);
    try {
      await setBoxColor(token, color);
      setCurrentBoxColor(color);
      setSuccessMessage(`Box color updated to ${color}`);
    } catch (err) {
      setError("Failed to update box color");
    } finally {
      setIsUpdatingColor(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-[600px] h-[600px] rounded-full mix-blend-overlay filter blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${
              i % 2 === 0
                ? "rgba(147, 51, 234, 0.15)"
                : "rgba(59, 130, 246, 0.15)"
            } 0%, transparent 70%)`,
          }}
          animate={{
            x: [Math.random() * 100, Math.random() * -100],
            y: [Math.random() * 100, Math.random() * -100],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container relative px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row"
        >
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#43D277] via-white to-[#43D277] bg-clip-text">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-[#43D277]/80">Manage users and credits</p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#43D277] to-[#38b366] rounded-xl 
                       text-white font-medium shadow-lg shadow-[#43D277]/20
                       hover:shadow-[#43D277]/40 transition-all duration-300"
            >
              Create New User
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="px-6 py-3 bg-black/50 border border-[#43D277]/20 rounded-xl 
                       text-[#43D277] font-medium hover:bg-black/70
                       transition-all duration-300"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        <div className="mb-12 max-h-[60vh] overflow-y-auto rounded-xl backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="sticky top-0 z-10 p-4 border-b bg-gray-900/80 backdrop-blur-xl border-white/10">
            <motion.div className="relative max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by username..."
                  className="w-full px-4 py-3 pl-10 text-white transition-all duration-300 border rounded-xl bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 placeholder-purple-200/30"
                />
                <div className="absolute inset-0 transition-all duration-300 pointer-events-none rounded-xl bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5" />

                <div className="absolute -translate-y-1/2 left-3 top-1/2 text-purple-200/50">
                  🔍
                </div>

                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -translate-y-1/2 right-3 top-1/2"
                  >
                    <div className="w-4 h-4 border-2 rounded-full border-purple-500/30 border-t-purple-500 animate-spin" />
                  </motion.div>
                )}
              </div>

              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute mt-2 text-sm text-purple-200/70"
                >
                  {isSearching
                    ? "Searching..."
                    : `Found ${users.length} user${
                        users.length === 1 ? "" : "s"
                      }`}
                </motion.div>
              )}
            </motion.div>
          </div>

          {users.length === 0 && searchTerm && !isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-purple-200/70"
            >
              <p className="mb-2 text-lg">No users found</p>
              <p className="text-sm">Try a different search term</p>
            </motion.div>
          )}

          <div className="p-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 transition-all duration-300 border group rounded-2xl bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="absolute inset-0 transition-all duration-300 rounded-2xl bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-purple-200">
                          {user.username}
                        </h3>
                        <p className="text-sm text-purple-300">{user.email}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-400 transition-colors hover:text-red-300"
                      >
                        🗑️
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="mb-2 text-sm text-[#43D277]/80">
                            Credits
                          </p>
                          <div className="relative">
                            <input
                              type="number"
                              value={user.credits}
                              onChange={(e) =>
                                handleUpdateCredits(user.id, e.target.value)
                              }
                              className="w-full px-4 py-2 text-white transition-all border rounded-lg bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                            />
                            <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5" />
                          </div>
                        </div>
                        <div className="text-sm text-[#43D277]/80">
                          <p>ID: {user.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 pb-10 border backdrop-blur-xl rounded-3xl border-white/10 bg-white/5"
        >
          <h2 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 bg-clip-text">
            Box Management
          </h2>

          <div className="flex items-center justify-between">
            <div className="max-w-lg">
              <p className="mb-2 text-[#43D277]">Reset All Boxes</p>
              <p className="text-sm text-[#43D277]/70">
                This action will remove all user selections from boxes, making
                them available again. Use this feature carefully as it affects
                all users.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetBoxes}
              disabled={isResetting}
              className="relative px-6 py-3 overflow-hidden font-medium text-white 
                         transition-all duration-300 shadow-lg 
                         bg-gradient-to-r from-[#43D277]/80 to-[#38b366]/80 rounded-xl 
                         shadow-[#43D277]/20 hover:shadow-[#43D277]/40 
                         disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="relative z-10">
                {isResetting ? "Resetting..." : "Reset All Boxes"}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#43D277]/0 via-white/20 to-[#43D277]/0"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
              />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 mt-8 border backdrop-blur-xl rounded-3xl border-white/10 bg-white/5"
        >
          <h2 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 bg-clip-text">
            Box Color Management
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                id: "green",
                name: "Ruby Glow",
                style: `bg-gradient-to-br from-red-500 via-red-600 to-red-500 
                        border-yellow-500/50 shadow-red-500/20 hover:shadow-red-500/30`,
                preview: `bg-gradient-to-br from-red-500/30 via-red-600/20 to-red-500/30 
                         border-yellow-500/40`,
                description: "Royal & Bold",
                ribbon: "border-yellow-500",
              },
              {
                id: "black",
                name: "Emerald Shine",
                style: `bg-gradient-to-br from-[#43D277] via-[#43D277]/90 to-[#38b366] 
                        border-[#43D277]/50 shadow-[#43D277]/20 hover:shadow-[#43D277]/30`,
                preview: `bg-gradient-to-br from-[#43D277]/30 via-[#43D277]/20 to-[#38b366]/30 
                         border-[#43D277]/40`,
                description: "Natural & Fresh",
                ribbon: "border-[#43D277]",
              },
              {
                id: "green-black",
                name: "Shadow Emerald",
                style: `bg-gradient-to-br from-[#43D277] via-gray-900 to-black 
                        border-[#43D277]/50 shadow-[#43D277]/20 hover:shadow-[#43D277]/30`,
                preview: `bg-gradient-to-br from-[#43D277]/30 via-gray-900/40 to-black/30 
                         border-[#43D277]/40`,
                description: "Mysterious & Elegant",
                ribbon: "border-[#43D277]",
              },
            ].map((color) => (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleColorChange(color.id)}
                disabled={isUpdatingColor || currentBoxColor === color.id}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all duration-300
                  ${
                    currentBoxColor === color.id
                      ? "border-[#43D277] bg-[#43D277]/20"
                      : "border-white/10 hover:border-[#43D277]/50 bg-white/5"
                  }
                  hover:shadow-lg
                `}
              >
                <div className="mb-6">
                  <div
                    className={`
                    w-24 h-24 mx-auto rounded-2xl border-2 
                    ${color.style}
                    shadow-lg transition-all duration-300
                    relative overflow-hidden group
                  `}
                  >
                    <div
                      className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${color.preview}
                    `}
                    />

                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-white/10 via-transparent to-transparent group-hover:opacity-100" />

                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl transition-transform duration-300 transform group-hover:scale-110">
                        🎁
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-lg font-medium bg-gradient-to-r from-[#43D277] to-[#38b366] bg-clip-text text-transparent">
                    {color.name}
                  </p>
                  <p className="text-sm text-[#43D277]/70">
                    {color.description}
                  </p>
                </div>

                {currentBoxColor === color.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute w-6 h-6 -top-2 -right-2"
                  >
                    <div className="absolute inset-0 bg-[#43D277] rounded-full opacity-50 animate-ping" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#43D277] to-[#38b366]">
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                        ✓
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl hover:opacity-100">
                  <div
                    className={`absolute inset-0 rounded-2xl ${color.preview} blur-xl -z-10`}
                  />
                </div>
              </motion.button>
            ))}
          </div>

          <p className="mt-6 text-sm text-purple-200/70">
            Select a color scheme for all mystery boxes. Each theme provides a
            unique visual experience for users.
          </p>
        </motion.div>

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md p-6 border rounded-2xl bg-gradient-to-br from-black to-gray-900 border-[#43D277]/20"
              >
                <h2 className="mb-6 text-2xl font-bold text-[#43D277]">
                  Create New User
                </h2>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm text-[#43D277]/80">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      className="w-full px-4 py-2 text-white border rounded-xl bg-black/30 border-[#43D277]/20 focus:border-[#43D277]/50 focus:ring-2 focus:ring-[#43D277]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-[#43D277]/80">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="w-full px-4 py-2 text-white border rounded-xl bg-black/30 border-[#43D277]/20 focus:border-[#43D277]/50 focus:ring-2 focus:ring-[#43D277]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-[#43D277]/80">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="w-full px-4 py-2 text-white border rounded-xl bg-black/30 border-[#43D277]/20 focus:border-[#43D277]/50 focus:ring-2 focus:ring-[#43D277]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-[#43D277]/80">
                      Credits
                    </label>
                    <input
                      type="number"
                      value={newUser.credits}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          credits: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 text-white border rounded-xl bg-black/30 border-[#43D277]/20 focus:border-[#43D277]/50 focus:ring-2 focus:ring-[#43D277]/20"
                      required
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 text-[#43D277] border border-[#43D277]/20 rounded-xl hover:bg-[#43D277]/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-[#43D277] to-[#38b366] rounded-xl hover:shadow-lg hover:shadow-[#43D277]/20"
                    >
                      {isLoading ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`fixed top-4 right-4 p-4 rounded-xl ${
                error
                  ? "bg-red-500/10 border-red-500/30 text-red-200"
                  : "bg-green-500/10 border-green-500/30 text-green-200"
              } border backdrop-blur-md shadow-lg max-w-md z-50`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    error ? "bg-red-500/20" : "bg-green-500/20"
                  }`}
                >
                  {error ? "❌" : "✓"}
                </div>
                <div>
                  <p className="font-medium mb-0.5">
                    {error ? "Error" : "Success"}
                  </p>
                  <p className="text-sm opacity-90">
                    {error || successMessage}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (error) setError(null);
                    else setSuccessMessage("");
                  }}
                  className="p-1 ml-auto transition-colors rounded-lg hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminDashboard;
