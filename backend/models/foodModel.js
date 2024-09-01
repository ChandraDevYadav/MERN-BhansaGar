import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: { 
        type: String,
        required: true,
    },
    ratings: {
        type: [Number], // Store an array of ratings
        default: []
    },
});

const foodModel = mongoose.model('Food', foodSchema);

export default foodModel;


// const foodModel = mongoose.models.food || mongoose.model("food",foodSchema);