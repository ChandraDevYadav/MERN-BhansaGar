import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://resturantapp:9805912060@cluster0.azf1e.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}