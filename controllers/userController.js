const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
exports.registerUser = async (req, res) => {
        const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } =
        req.body;
    try {
    const user = await User.create({
        firstName,
        lastName,
        NIDNumber,
        phoneNumber,
        password,
        bloodGroup,
    });
        res.status(201).json({ user, token: generateToken(user._id) });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true }).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Single User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(404).json({ message: "User not found" });
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
    });
    res.json(user);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
