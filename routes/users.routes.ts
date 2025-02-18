import express from "express";
import { register, userLogin, getAllUsers, updateUserCredit, getUserCredit, updateUserCryptoStatus, updateUserTransactionStatus } from "../controllers/userController.js";
import { verifyAuthToken } from "../middleware/verifyAuthToken.js";
const router = express.Router();

router.get("yourlink", verifyAuthToken, getAllUsers);
router.post("yourlink", register);
router.post("yourlink", userLogin);
router.post("yourlink", updateUserCredit);
router.post("yourlink", getUserCredit);
router.post("/yourlink", updateUserCryptoStatus);
router.post("/yourlink", updateUserTransactionStatus);


export default router;