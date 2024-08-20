import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ImageSearch from './components/ImageSearch';
import Navbar from './components/Navbar';
import Logout from './components/Logout';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [query, setQuery] = useState('');

  const handleCategoryClick = (category) => {
    setQuery(category); // Set query to the selected category
  };

  return (
    <Router>
      {isLoggedIn && <Navbar onCategoryClick={handleCategoryClick} />}
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/images" element={isLoggedIn ? <ImageSearch query={query} /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
