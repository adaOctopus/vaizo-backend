import mongoose from "mongoose";

const userSubscriber = new mongoose.Schema({
    email: { type: String, required: true }
});

const UserSubscriber = mongoose.model('UserSubscriber', userSubscriber);

export default UserSubscriber;