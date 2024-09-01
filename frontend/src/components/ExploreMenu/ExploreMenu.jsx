import React, { useRef } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ExploreMenu = ({ category, setCategory }) => {
  const listRef = useRef(null);

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: -150, // Adjust scroll distance
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 150, // Adjust scroll distance
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and satisfy your cravings and elevate your dining experience, one delicious meal at a time.
      </p>
      <hr />
      <div className="explore-menu-container">
        <button className="scroll-button left" onClick={scrollLeft}><FaArrowLeft style={{ color: 'white', height: '20px', width: '20px' }} /></button>
        <div className="explore-menu-list" ref={listRef}>
          {menu_list.map((item, index) => (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
              className='explore-menu-list-item' 
              key={index}
            >
              <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}><FaArrowRight style={{ color: 'white', height: '20px', width: '20px' }} /></button>
      </div>
      <hr />
    </div>
  );
}

export default ExploreMenu;
