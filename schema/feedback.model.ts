import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    creation_date: { type: String, required: true },
    email: { type: String, required: true },
    feedback: { type: String, required: true },
});

const FeedbackInfo = mongoose.model('feedback', feedbackSchema);

export default FeedbackInfo;