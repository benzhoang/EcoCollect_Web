import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Citizen/HomePage';
import Contact from './pages/Citizen/Contact';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
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
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;
