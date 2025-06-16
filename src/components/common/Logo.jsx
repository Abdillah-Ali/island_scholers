import { motion } from 'framer-motion';

const Logo = ({ className = "h-8 w-auto", showText = true, variant = "default" }) => {
  const textColors = {
    default: "#065F46", // Dark green
    white: "#FFFFFF",
    dark: "#065F46"
  };

  const textColor = textColors[variant];

  return (
    <div className={`flex items-center ${className}`}>
      <motion.img
        src="/logo.png"
        alt="Island Scholars Logo"
        className="h-12 w-12 mr-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span 
            className="text-2xl font-bold leading-tight tracking-tight"
            style={{ color: textColor }}
          >
            Island Scholars
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default Logo;