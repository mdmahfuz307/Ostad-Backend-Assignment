const express = require("express");
const {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers,
    updateProfile,
    deleteUser,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/all", protect, getAllUsers);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteUser);

module.exports = router;
