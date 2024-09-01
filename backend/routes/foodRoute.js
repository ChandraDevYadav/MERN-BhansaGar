import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood, rateFood, getUserRating, getFoodById, listFoodByCategory } from '../controllers/foodController.js';

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Define routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post('/rate', rateFood);
foodRouter.get('/:foodId/user-rating', getUserRating);
foodRouter.get('/:foodId', getFoodById); // Route to get food details by ID
foodRouter.get('/', listFoodByCategory); // Route to get food by category

export default foodRouter;
