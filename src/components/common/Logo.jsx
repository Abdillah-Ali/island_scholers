import { motion } from 'framer-motion';

const Logo = ({ className = "", showText = true, variant = "default" }) => {
  const textColors = {
    default: "#0066cc", // Bootstrap primary
    white: "#FFFFFF",
    dark: "#0066cc"
  };

  const textColor = textColors[variant];

  return (
    <div className={`d-flex align-items-center ${className}`}>
      <motion.img
        src="/logo.png"
        alt="Island Scholars Logo"
        className="me-3"
        style={{ height: '48px', width: '48px' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {showText && (
        <motion.div
          className="d-flex flex-column"
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span 
            className="fs-4 fw-bold lh-1"
            style={{ color: textColor, letterSpacing: '-0.5px' }}
          >
            Island Scholars
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default Logo;