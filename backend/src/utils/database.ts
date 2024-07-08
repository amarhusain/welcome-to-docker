import mongoose from "mongoose";
import { config } from "../common/config";
import logger from "../common/logger";

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoConnUri);
        console.log('Connected to MongoDB');
        logger.info(`[DATABASE]: Connected with mongodb database.`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit on connection failure
    }
};