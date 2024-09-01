import mongoose from "mongoose";

const grocerySchema = new mongoose.Schema({
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
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    numReviews: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
});

const groceryModel = mongoose.model('Grocery', grocerySchema);

export default groceryModel;
