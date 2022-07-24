import mongoose from 'mongoose';
const { Schema } = mongoose;

const contestantSchema = new Schema({
    fname: {
        type: String,
        trim: true,
        required: true
    },
    lname: {
        type: String,
        trim: true,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    vote: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'active']
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model("Contestant", contestantSchema);