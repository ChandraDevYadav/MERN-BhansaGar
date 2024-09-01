import groceryModel from "../models/groceryModel.js";
import fs from 'fs'


//add food item

const addGrocery = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }

    let image_filename = `${req.file.filename}`;

    const grocery = new groceryModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await grocery.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// all food list
const listGrocery = async (req,res) => {
    try {
        const grocerys = await groceryModel.find({});
        res.json({success:true,data:grocerys})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove food item

const removeGrocery = async (req,res) =>{
    try {
        const grocery = await groceryModel.findById(req.body.id);
        fs.unlink(`uploads/${grocery.image}`,()=>{})

        await groceryModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export {addGrocery,listGrocery,removeGrocery}