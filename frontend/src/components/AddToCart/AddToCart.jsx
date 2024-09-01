import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets'; // Import assets

const AddToCart = ({ productId }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    !cartItems[productId] ? (
      <img
        className='add'
        onClick={() => addToCart(productId)}
        src={assets.add_icon_white}
        alt='Add to cart'
        style={{ cursor: 'pointer' }}
      />
    ) : (
      <div className='food-item-counter'>
        <img
          onClick={() => removeFromCart(productId)}
          src={assets.remove_icon_red}
          alt='Remove from cart'
          style={{ cursor: 'pointer' }}
        />
        <p>{cartItems[productId]}</p>
        <img
          onClick={() => addToCart(productId)}
          src={assets.add_icon_green}
          alt='Add to cart'
          style={{ cursor: 'pointer' }}
        />
      </div>
    )
  );
};

export default AddToCart;
