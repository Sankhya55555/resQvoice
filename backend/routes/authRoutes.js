

const express = require("express");

const {
  registerUser,
  loginUser,
  sendPasswordResetOtp,
  verifyOtpAndResetPassword,
} = require("../controllers/authController");

const { validateRegister, validateLogin } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/forgot-password", sendPasswordResetOtp);
router.post("/send-otp", sendPasswordResetOtp);
router.post("/reset-password", verifyOtpAndResetPassword);
router.post("/verify-otp", verifyOtpAndResetPassword);

module.exports = router;
