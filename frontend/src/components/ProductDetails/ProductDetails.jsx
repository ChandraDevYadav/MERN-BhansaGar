import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./ProductDetails.css";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import { assets } from '../../assets/assets'; // Import assets

const ProductDetails = () => {
  const { id } = useParams();
  const { url, cartItems, addToCart, removeFromCart } = useContext(StoreContext); // Access cartItems, addToCart, removeFromCart
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/food/${id}`);
        const foodDetails = await response.json();
        console.log("Product details fetched:", foodDetails);

        if (response.ok) {
          setProduct(foodDetails);
        } else {
          console.error("Error fetching product details:", foodDetails.message);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
        <h2>All about <span>{product.name}</span></h2>
      <div className="product-info">
        <img className="product_img" src={`${url}/images/${product.image}`} alt={product.name} />
        <div className="product-info-container">
          <h1>Name : {product.name}</h1>
          <p>Description : {product.description}</p>
          <p>Price: Rs {product.price}</p>
          <p>Category : {product.category}</p>
          <div className="product-reviews">
            <h2>Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review._id} className="review">
                  <p><strong>{review.userName}</strong></p>
                  <p>{review.rating} / 5</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <img src={'/rating_starts.png'} />
            )}
          </div>

          {!cartItems[product._id] ? (
            <img
              className='add' 
              onClick={() => addToCart(product._id)}
              src={assets.add_icon_white}
              alt='Add to cart'
              style={{ cursor: 'pointer', width: '30px', height: '30px', marginTop: '15px' }}
            />
          ) : (
            <div className='product-detail-cartadd'>
              <img
                onClick={() => removeFromCart(product._id)}
                src={assets.remove_icon_red}
                alt='Remove from cart'
                style={{ cursor: 'pointer' }}
              />
              <p>{cartItems[product._id]}</p>
              <img
                onClick={() => addToCart(product._id)}
                src={assets.add_icon_green}
                alt='Add to cart'
                style={{ cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      </div>
      <hr />
      <RelatedProducts
        category={product.category}
        currentProductId={product._id}
        url={url}
      />
    </div>
  );
};

export default ProductDetails;
