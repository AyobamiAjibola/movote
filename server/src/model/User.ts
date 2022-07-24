import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    isAdmin: {
        type: String,
        required: true,
        enum: ["admin", "user", "userMul", "userFree"]
    },
    company: {
        type: String,
        required: true
    },
    contestName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model("User", userSchema);