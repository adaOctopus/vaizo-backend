import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
    creation_date: { type: String, required: true },
    update_date: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    credits: { type: Number, required: false, default: 1 },
    paid: { type: Boolean, required: false, default: false },
    initiatedCryptoPay: { type: Boolean, required: false, default: false },
    hasSubmitProof: { type: Boolean, required: false, default: false },
    transactionHashProof: { type: String, required: false, default: null },
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

export default UserInfo;