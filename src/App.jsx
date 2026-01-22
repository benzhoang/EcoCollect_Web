import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Citizen/HomePage';
import Contact from './pages/Citizen/Contact';
import Report from './pages/Citizen/Report';
import ScorePage from './pages/Citizen/ScorePage';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/Admin/DashboardPage';
import './App.css';

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);

    // Intercept link clicks
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const newPath = new URL(link.href).pathname;
        window.history.pushState({}, '', newPath);
        setPathname(newPath);
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const renderContent = () => {
    switch (pathname) {
      case '/signin':
        return <Signin />;
      case '/signup':
        return <Signup />;
      case '/contact':
        return (
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        );
      case '/report':
        return (
          <>
            <Navbar />
            <Report />
            <Footer />
          </>
        );
      case '/score':
        return (
          <>
            <Navbar />
            <ScorePage />
            <Footer />
          </>
        );
      case '/admin/dashboard':
        return (
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        );
      case '/':
      default:
        return (
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        );
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        {renderContent()}
      </div>
    </BrowserRouter>
  );
}

export default App;
