import mongoose from 'mongoose';
import userModel from './models/userModel.js'; // Adjust the path as needed

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

const migrateFields = async () => {
    try {
        // Connect to the database
        await connectDB();

        // Update documents to use new field names
        const result = await userModel.updateMany(
            { resetPasswordToken: { $exists: true }, resetPasswordExpire: { $exists: true } },
            {
                $rename: {
                    'resetPasswordToken': 'passwordResetToken',
                    'resetPasswordExpire': 'passwordResetExpires',
                },
            }
        );

        console.log('Migration complete:', result.modifiedCount, 'documents updated');

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Migration error:', error);
        mongoose.connection.close();
    }
};

// Run the migration
migrateFields();
