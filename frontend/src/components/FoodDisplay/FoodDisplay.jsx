import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>
      Excited {category === "All" ? "dishes" : category} Packages
      </h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id} // Corrected the key prop to use item._id
                id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
                ratings={item.ratings} // Ensure this is an array
              />
            );
          }
          return null; // Add this to avoid returning undefined from the map function
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
