import { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@supabase/supabase-js";

function Login() {
  const { login, error, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [loginText, setLoginText] = useState({
    login_welcome_text: "Welcome back",
    login_username_label: "Username",
    login_password_label: "Password",
    login_button_text: "Sign In",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase configuration is missing");
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const fetchLoginText = async () => {
      try {
        const { data } = await supabase
          .from("global_settings")
          .select("setting_name, setting_value")
          .in("setting_name", [
            "login_welcome_text",
            "login_username_label",
            "login_password_label",
            "login_button_text",
          ]);

        const textSettings = data.reduce((acc, item) => {
          acc[item.setting_name] = item.setting_value;
          return acc;
        }, {});

        setLoginText(textSettings);
      } catch (error) {
        console.error("Error fetching login text:", error);
      }
    };

    fetchLoginText();

    const subscription = supabase
      .channel("global_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "global_settings",
        },
        (payload) => {
          if (payload.new) {
            setLoginText((prev) => ({
              ...prev,
              [payload.new.setting_name]: payload.new.setting_value,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants

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

  // Add animation variants for text transitions
  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
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
          {/* Decorative elements */}

          <div className="absolute -top-10 -left-10 w-20 h-20 border border-[#43D277]/20 rounded-full" />

          <div className="absolute -bottom-8 -right-8 w-16 h-16 border border-[#43D277]/20 rounded-full" />

          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-4xl font-bold text-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={loginText.login_welcome_text}
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-gradient-to-r from-[#43D277] via-white to-[#43D277] bg-clip-text text-transparent"
                >
                  {loginText.login_welcome_text}
                </motion.span>
              </AnimatePresence>
            </h2>

            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-[#43D277] to-[#38b366] mx-auto mt-4 rounded-full"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <motion.label
                whileHover={{ x: 5 }}
                className="block text-[#43D277] text-sm font-medium mb-2"
                htmlFor="username"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loginText.login_username_label}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {loginText.login_username_label}
                  </motion.span>
                </AnimatePresence>
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
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.label
                whileHover={{ x: 5 }}
                className="block text-[#43D277] text-sm font-medium mb-2"
                htmlFor="password"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loginText.login_password_label}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {loginText.login_password_label}
                  </motion.span>
                </AnimatePresence>
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
                placeholder="Enter your password"
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
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isLoading ? "loading" : loginText.login_button_text}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative z-10"
                  >
                    {isLoading ? "Signing in..." : loginText.login_button_text}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
