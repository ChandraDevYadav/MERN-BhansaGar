import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes for type checking
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const FoodItem = ({ id, name, price, description, image, ratings = [] }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  // State to manage whether to show the full description
  const [showFullDescription, setShowFullDescription] = useState(false);

  // State to manage the selected rating
  const [selectedRating, setSelectedRating] = useState(0);

  // State to manage if the user has already rated
  const [hasRated, setHasRated] = useState(false);

  // Calculate the average rating
  const averageRating = ratings.length
    ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
    : 0;

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `http://localhost:4000/api/food/${id}/user-rating`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Check if ratings exist and update state
          if (data.ratings && data.ratings.length > 0) {
            // Assuming you want to get the user's rating from the list
            // Implement logic to get the current user's rating here
            const userRating = data.ratings[0]; // Example logic, update as needed
            setSelectedRating(userRating);
            setHasRated(true);
          } else {
            console.log("No rating data found");
          }
        } else {
          console.error("Error fetching user rating:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [id]);

  // Toggle the state for description
  const toggleDescription = () => {
    setShowFullDescription((prevState) => !prevState);
  };

  // Truncate description to 15 words
  const truncatedDescription =
    description.split(" ").slice(0, 15).join(" ") + "...";

  // Handle rating selection and submission
  const handleRatingClick = async (rating) => {
    if (hasRated) return; // Prevent rating if the user has already rated

    // Update the UI immediately
    setSelectedRating(rating);
    setHasRated(true);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      if (!token) {
        console.warn("User is not authenticated");
        setHasRated(false);
        setSelectedRating(0);
        return;
      }

      const response = await fetch("http://localhost:4000/api/food/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers if required
        },
        body: JSON.stringify({ foodId: id, rating }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Rating submitted:", data);
      } else {
        console.error("Error submitting rating:", data.message);
        // Optionally, reset the rating in case of an error
        setSelectedRating(0);
        setHasRated(false);
      }
    } catch (error) {
      console.error("Server error:", error);
      // Optionally, reset the rating in case of an error
      setSelectedRating(0);
      setHasRated(false);
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt={name}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
            style={{ cursor: "pointer" }}
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove from cart"
              style={{ cursor: "pointer" }}
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add to cart"
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="food-item-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`star-icon ${hasRated ? "rated" : ""}`}
                style={{ cursor: hasRated ? "default" : "pointer" }}
              >
                {selectedRating >= star ? (
                  <FaStar color="#ffc107" />
                ) : (
                  <FaRegStar color="#ffc107" />
                )}
              </span>
            ))}
            <span className="average-rating"> ({ratings.length})</span>
          </div>
        </div>
        <p className="food-item-desc">
          {showFullDescription ? description : truncatedDescription}
          {description.split(" ").length > 15 && (
            <span
              className="toggle-description"
              onClick={toggleDescription}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {showFullDescription ? " See Less" : "... See More"}
            </span>
          )}
        </p>
        <p className="food-item-price">Rs {price}</p>
        <Link to={`/product/${id}`}>
          <button className="view-details-button">View Details</button>
        </Link>
      </div>
    </div>
  );
};

// Define PropTypes for type checking
FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.number),
};

export default FoodItem;
