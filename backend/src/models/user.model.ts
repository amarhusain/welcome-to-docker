import mongoose from "mongoose";

export interface IUserDocument extends mongoose.Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    role: string;
    resetNonce: boolean;
}

export interface IUserModel extends mongoose.Model<IUserDocument> { }

const UserSchema: mongoose.Schema<IUserDocument> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, trim: true, required: true, unique: true },
        mobile: { type: String, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        resetNonce: { type: Boolean, required: true },
    }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;