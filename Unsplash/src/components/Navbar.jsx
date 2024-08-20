import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onCategoryClick }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-white text-lg font-semibold">Image Search App</a>
        <div>
          <a href="#" onClick={() => onCategoryClick('')} className="text-gray-300 hover:text-white mx-4">Home</a>
          <a href="#" onClick={() => onCategoryClick('waterfall')} className="text-gray-300 hover:text-white mx-4">Waterfalls</a>
          <a href="#" onClick={() => onCategoryClick('nature')} className="text-gray-300 hover:text-white mx-4">Nature</a>
          <a href="#" onClick={() => onCategoryClick('animals')} className="text-gray-300 hover:text-white mx-4">Animals</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
