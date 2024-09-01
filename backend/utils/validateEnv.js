import dotenv from "dotenv";

const validateEnv = () => {
    dotenv.config();
    if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
        throw new Error("Please define all required environment variables in the .env file");
    }
};

export default validateEnv;
