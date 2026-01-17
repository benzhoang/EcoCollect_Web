import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Citizen/HomePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
