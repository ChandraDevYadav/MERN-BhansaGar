import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food', // Assuming you have a Product model
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
