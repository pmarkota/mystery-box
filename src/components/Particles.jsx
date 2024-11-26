import { motion } from "framer-motion";

const Particles = ({ originX, originY }) => {
  return (
    <div className="absolute" style={{ left: originX, top: originY }}>
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-purple-400/80 rounded-full"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * 40,
              y: Math.sin(angle) * 40,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default Particles;
