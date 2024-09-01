import Review from '../models/reviewModel.js';
import Food from '../models/foodModel.js';
import Grocery from '../models/groceryModel.js';

// Add a new review
export const addReview = async (req, res) => {
    const { itemId, rating, comment, itemType } = req.body;

    try {
        const review = new Review({
            user: req.body.userId,
            item: itemId,
            rating,
            comment
        });

        await review.save();

        let item;
        if (itemType === 'food') {
            item = await Food.findById(itemId);
        } else if (itemType === 'grocery') {
            item = await Grocery.findById(itemId);
        }

        if (item) {
            item.reviews.push(review._id);
            item.numReviews = item.reviews.length;
            item.rating = item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.numReviews;

            await item.save();
        }

        res.status(201).json({ success: true, message: 'Review added successfully', review });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, message: 'Error adding review' });
    }
};

// Get all reviews for a food or grocery item
export const getItemReviews = async (req, res) => {
    try {
        const { itemId, itemType } = req.params;
        let reviews;

        if (itemType === 'food' || itemType === 'grocery') {
            reviews = await Review.find({ item: itemId }).populate('user', 'name');
        }

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews' });
    }
};
