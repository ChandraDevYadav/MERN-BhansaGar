import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Add food item
export const addFood = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// All food list
export const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food item
export const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Rate food item
export const rateFood = async (req, res) => {
    try {
        const { foodId, rating } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Add the rating to the ratings array
        food.ratings.push(rating);
        await food.save();

        res.status(200).json({ message: 'Rating submitted successfully', food });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get user rating for a food item
export const getUserRating = async (req, res) => {
    try {
        const { foodId } = req.params;

        if (!foodId) {
            return res.status(400).json({ message: 'Food ID is required' });
        }

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Assuming ratings are stored as an array
        res.status(200).json({ ratings: food.ratings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get food details by ID
export const getFoodById = async (req, res) => {
    try {
        const { foodId } = req.params; // Extract the foodId from the request parameters

        const food = await foodModel.findById(foodId); // Find the food item by ID in the database
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json(food); // Send the food item data as a response
    } catch (error) {
        console.error("Error fetching food item:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const listFoodByCategory = async (req, res) => {
    try {
      const category = req.query.category;
      if (!category) {
        return res.status(400).json({ success: false, message: "Category is required" });
      }
      const foods = await foodModel.find({ category });
      res.json(foods);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  