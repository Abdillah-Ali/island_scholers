import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Notification from '../common/Notification';
import { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const MainLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const { notifications } = useNotifications();

  const displayNotification = (type, message) => {
    setNotificationContent({ type, message });
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification component */}
        {showNotification && (
          <Notification
            type={notificationContent.type}
            message={notificationContent.message}
            onClose={() => setShowNotification(false)}
          />
        )}
        
        {/* Main content */}
        <Outlet context={{ displayNotification }} />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;