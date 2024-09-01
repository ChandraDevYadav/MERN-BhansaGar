import React, { useState } from 'react';
import './SearchBar.css'; // Import the updated CSS
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const SearchBar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value); // Pass the query to parent or handle search logic here
  };

  return (
    <div className="search-bar">
      <div className="search-icon-container">
        <button className={`search-icon ${isOpen ? 'open' : ''}`} onClick={toggleSearch}>
          <FaSearch style={{width:'25px', height:'25px'}}/>
        </button>
        <input
          type="text"
          className={`search-input ${isOpen ? 'open' : ''}`}
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          onFocus={() => setIsOpen(true)} // Automatically open input when focused
        />
      </div>
    </div>
  );
};

export default SearchBar;
