import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './RelatedProducts.css';
import { assets } from '../../assets/assets';

const RelatedProducts = ({ category, currentProductId, url }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null); // State to track expanded product
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/food?category=${category}`);
        const data = await response.json();
        console.log("Related products fetched:", data);

        if (response.ok) {
          const related = data.filter((item) => item._id !== currentProductId);
          setRelatedProducts(related);
        } else {
          console.error('Error fetching related products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (category) {
      fetchRelatedProducts();
    }
  }, [category, currentProductId]);

  // Toggle description visibility
  const toggleDescription = (id) => {
    setExpandedProductId((prevId) => (prevId === id ? null : id));
  };

  if (relatedProducts.length === 0) return <p>No related products found.</p>;

  return (
    <div className='related-products'>
      <h2>Related Products</h2>
      <div className='related-products-list'>
        {relatedProducts.map((related) => (
          <div key={related._id} className='related-product-item'>
            <img src={`${url}/images/${related.image}`} alt={related.name} />
            <p>{related.name}</p>
            <p className='related-product-description'>
              {expandedProductId === related._id ? related.description : related.description.split(' ').slice(0, 15).join(' ') + '...'}
              {related.description.split(' ').length > 15 && (
                <span
                  className='toggle-description'
                  onClick={() => toggleDescription(related._id)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  {expandedProductId === related._id ? ' View Less' : ' View More'}
                </span>
              )}
            </p>
            <p className="product-price">Price: Rs {related.price}</p>
            {!cartItems[related._id] ? (
              <img
                className='add'
                onClick={() => addToCart(related._id)}
                src={assets.add_icon_white}
                alt='Add to cart'
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div className='food-item-counter'>
                <img
                  onClick={() => removeFromCart(related._id)}
                  src={assets.remove_icon_red}
                  alt='Remove from cart'
                  style={{ cursor: 'pointer' }}
                />
                <p>{cartItems[related._id]}</p>
                <img
                  onClick={() => addToCart(related._id)}
                  src={assets.add_icon_green}
                  alt='Add to cart'
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
            <Link to={`/product/${related._id}`}>
              <button className='view-details-button'>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
