import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cart, onSearch}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">ShopEase</Link>
      </div>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button onClick={() => onSearch(searchTerm)}>Search</button>
      </div>
      <div className="cart">
        <Link to="/cart">Cart ({cart.length})</Link>
      </div>
    </header>
  );
};

export default Header;