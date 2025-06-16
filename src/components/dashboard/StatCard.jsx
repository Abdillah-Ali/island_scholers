import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = 'primary', subtitle = null }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50',
          iconBg: 'bg-primary-100',
          iconColor: 'text-primary-600',
          borderColor: 'border-primary-200'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-50',
          iconBg: 'bg-secondary-100',
          iconColor: 'text-secondary-600',
          borderColor: 'border-secondary-200'
        };
      case 'accent':
        return {
          bg: 'bg-accent-50',
          iconBg: 'bg-accent-100',
          iconColor: 'text-accent-600',
          borderColor: 'border-accent-200'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${colors.bg} rounded-lg p-6 border ${colors.borderColor}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${colors.iconBg} p-3 rounded-full`}>
          <span className={`${colors.iconColor}`}>{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;