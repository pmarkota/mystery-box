import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Navbar";

import { useAuth } from "../context/AuthContext";

import { fetchBoxes, submitBoxes, getBoxColor } from "../services/boxService";

import Particles from "./Particles";

function Home() {
  const { user, token, refreshUserData } = useAuth();

  const [boxes, setBoxes] = useState([]);

  const [selectedBoxes, setSelectedBoxes] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const [particleEffects, setParticleEffects] = useState([]);

  const [selectionMessage, setSelectionMessage] = useState("");

  const [successToast, setSuccessToast] = useState(null);

  const [boxColor, setBoxColor] = useState("green");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [boxesData, colorData] = await Promise.all([
          loadBoxes(),
          getBoxColor(token),
        ]);
        setBoxColor(colorData);
      } catch (err) {
        setError("Failed to load initial data");
      }
    };

    loadInitialData();
  }, [token]);

  const loadBoxes = async () => {
    try {
      const data = await fetchBoxes(token);

      setBoxes(data);
    } catch (err) {
      setError("Failed to load mystery boxes");
    }
  };

  const handleBoxSelect = (boxId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const originX = rect.left + rect.width / 2;

    const originY = rect.top + rect.height / 2;

    const requiredSelections = user?.credits || 0;

    if (selectedBoxes.includes(boxId)) {
      setSelectedBoxes(selectedBoxes.filter((id) => id !== boxId));

      setSelectionMessage(
        `Please select ${
          requiredSelections - (selectedBoxes.length - 1)
        } more boxes`
      );
    } else if (selectedBoxes.length < requiredSelections) {
      setSelectedBoxes([...selectedBoxes, boxId]);

      const remainingSelections =
        requiredSelections - (selectedBoxes.length + 1);

      if (remainingSelections > 0) {
        setSelectionMessage(
          `Please select ${remainingSelections} more ${
            remainingSelections === 1 ? "box" : "boxes"
          }`
        );
      } else {
        setSelectionMessage("All boxes selected! You can now submit.");
      }

      const newEffect = {
        id: Date.now(),

        x: originX,

        y: originY,
      };

      setParticleEffects((prev) => [...prev, newEffect]);

      setTimeout(() => {
        setParticleEffects((prev) =>
          prev.filter((effect) => effect.id !== newEffect.id)
        );
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    const requiredSelections = user?.credits || 0;

    if (selectedBoxes.length !== requiredSelections) {
      setError(
        `Please select exactly ${requiredSelections} boxes before submitting`
      );

      return;
    }

    setIsLoading(true);

    try {
      await submitBoxes(token, user.id, selectedBoxes);

      await loadBoxes();

      setSelectedBoxes([]);

      await refreshUserData();

      setSelectionMessage("");

      setSuccessToast({
        message: `Successfully submitted ${requiredSelections} boxes! Your remaining credits: ${
          (user?.credits || 0) - requiredSelections
        }`,
        boxes: selectedBoxes,
      });

      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      setError("Failed to submit selection");
    } finally {
      setIsLoading(false);
    }
  };

  const getBoxStyles = (box) => {
    if (box.selected_by) {
      return "bg-black/50 border-gray-700/50 cursor-not-allowed";
    }

    if (selectedBoxes.includes(box.id)) {
      return "bg-[#43D277] border-[#43D277] shadow-lg shadow-[#43D277]/30";
    }

    switch (boxColor) {
      case "green":
        return `relative bg-[#43D277]/90 border-[#43D277] 
                after:absolute after:inset-0 after:rounded-xl
                after:shadow-[0_0_15px_rgba(67,210,119,0.3)]
                hover:after:shadow-[0_0_20px_rgba(67,210,119,0.4)]
                transition-all duration-300`;
      case "black":
        return `relative bg-gradient-to-br from-black to-gray-900
                border-gray-800 shadow-lg shadow-black/50
                hover:shadow-black/70 hover:from-gray-900 hover:to-black
                transition-all duration-300`;
      case "green-black":
        return `relative bg-gradient-to-br from-[#43D277]/80 to-black
                border-[#43D277]/50 shadow-lg shadow-[#43D277]/20
                hover:shadow-[#43D277]/30
                transition-all duration-300`;
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      <div className="container px-4 mx-auto pt-36">
        {/* Status Cards */}

        <div className="grid max-w-4xl grid-cols-1 gap-4 pt-24 mx-auto mb-8 md:grid-cols-3">
          {/* Available Credits Card */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border bg-black/50 backdrop-blur-md rounded-2xl border-[#43D277]/20"
          >
            <p className="mb-2 text-sm text-[#43D277]/80">Available Credits</p>

            <p className="text-4xl font-bold text-[#43D277]">
              {user?.credits || 0}
            </p>
          </motion.div>

          {/* Selected Boxes Card */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border bg-black/50 backdrop-blur-md rounded-2xl border-[#43D277]/20"
          >
            <p className="mb-2 text-sm text-[#43D277]/80">Selected Boxes</p>

            <p className="text-4xl font-bold text-[#43D277]">
              {selectedBoxes.length}
            </p>
          </motion.div>

          {/* Progress Card */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border bg-black/50 backdrop-blur-md rounded-2xl border-[#43D277]/20"
          >
            <div className="h-2 mb-4 overflow-hidden rounded-full bg-black/50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#43D277] to-[#38b366]"
                initial={{ width: "0%" }}
                animate={{
                  width: `${
                    (selectedBoxes.length / (user?.credits || 1)) * 100
                  }%`,
                }}
              />
            </div>

            <p className="text-sm text-[#43D277]/80">
              {selectionMessage ||
                `Select ${
                  (user?.credits || 0) - selectedBoxes.length
                } more boxes`}
            </p>
          </motion.div>
        </div>

        {/* Mystery Boxes Grid */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl p-8 mx-auto border bg-black/50 backdrop-blur-md rounded-3xl border-[#43D277]/20"
        >
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
            {[...boxes]
              .sort((a, b) => a.id - b.id)
              .map((box, index) => (
                <motion.button
                  key={box.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={(e) => handleBoxSelect(box.id, e)}
                  disabled={
                    box.selected_by ||
                    (selectedBoxes.length >= (user?.credits || 0) &&
                      !selectedBoxes.includes(box.id))
                  }
                  className={`
                    relative aspect-square rounded-xl transition-colors duration-300
                    ${getBoxStyles(box)}
                    border-2
                    overflow-hidden
                  `}
                >
                  {/* Box Content */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-2xl ${
                        box.selected_by ? "opacity-50" : ""
                      }`}
                      whileHover={{
                        scale: 1.2,
                        transition: { duration: 0.2 },
                      }}
                    >
                      {box.selected_by
                        ? "🔒"
                        : selectedBoxes.includes(box.id)
                        ? "✨"
                        : "🎁"}
                    </motion.span>
                    <motion.span
                      className={`text-sm mt-2
                        ${
                          box.selected_by
                            ? "text-gray-500"
                            : selectedBoxes.includes(box.id)
                            ? "text-white"
                            : boxColor === "black"
                            ? "text-gray-300"
                            : "text-white"
                        }`}
                      whileHover={{
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                    >
                      #{box.id}
                    </motion.span>
                  </div>

                  {/* Add hover glow effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 pointer-events-none bg-white/5"
                  />

                  {/* Selection Indicator */}
                  {selectedBoxes.includes(box.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute z-20 w-6 h-6 -top-2 -right-2"
                    >
                      <div className="absolute inset-0 rounded-full bg-[#43D277]">
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                          ✓
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
          </div>

          {/* Submit Button */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={
              selectedBoxes.length !== (user?.credits || 0) || isLoading
            }
            className={`mt-8 px-8 py-3 rounded-xl font-medium relative overflow-hidden
              ${
                selectedBoxes.length === (user?.credits || 0)
                  ? "bg-gradient-to-r from-[#43D277] to-[#38b366]"
                  : "bg-black/50"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 w-full max-w-md mx-auto block
              border border-[#43D277]/20 hover:border-[#43D277]/40
              text-white shadow-lg hover:shadow-[#43D277]/20`}
          >
            <span className="relative text-white">
              {isLoading ? "Submitting..." : "Confirm Selection"}
            </span>
          </motion.button>

          {/* Error Display */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed max-w-md p-4 text-sm text-red-200 border top-4 right-4 rounded-xl bg-red-500/10 backdrop-blur-md border-red-500/30"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Particle Effects */}

      <div className="fixed inset-0 pointer-events-none">
        {particleEffects.map((effect) => (
          <Particles key={effect.id} originX={effect.x} originY={effect.y} />
        ))}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-4 right-4 p-6 pt-20 border shadow-lg bg-black/50 backdrop-blur-md border-[#43D277]/20 rounded-xl shadow-[#43D277]/10 max-w-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#43D277] to-[#38b366] flex items-center justify-center">
                <span className="text-lg text-white">✓</span>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-medium text-[#43D277]">
                  Submission Successful!
                </h3>
                <p className="text-sm text-[#43D277]/80">
                  {successToast.message}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {successToast.boxes.map((boxId) => (
                    <span
                      key={boxId}
                      className="px-2 py-1 text-xs text-[#43D277] border rounded-full bg-black/50 border-[#43D277]/20"
                    >
                      Box #{boxId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
