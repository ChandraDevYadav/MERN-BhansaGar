import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js"; // Ensure this import is correct
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { getNewOrderNotifications } from "./controllers/orderController.js";
import groceryRouter from "./routes/groceryRoute.js";
import { esewaFailure, esewaSuccess, initiateEsewaPayment } from "./controllers/esewaController.js";
import adminRoute from './routes/adminRoute.js';
import { resetPassword } from "./controllers/userController.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/api/grocery", groceryRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter); // Ensure this route is correctly used
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.get('/api/order/new-order-notifications', getNewOrderNotifications);
app.post('/api/payment/esewa/initiate', initiateEsewaPayment);
app.get('/api/payment/esewa/success', esewaSuccess);
app.get('/api/payment/esewa/failure', esewaFailure);
app.use('/api/admin', adminRoute);
app.patch('/api/user/reset-password/:token', resetPassword);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
