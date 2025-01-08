const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { protect } = require("../middlewares/auth");

// CRUD Operations for Users

// Register User
router.post("/register", userController.registerUser);

// Login User with Email and Password
router.post("/loginMail", userController.loginUserWithMail);

// Login User with Username and Password
router.post("/loginName", userController.loginUserWithName);

// Get All Users (Protected Route)
router.get("/getAll", protect, userController.getAllUser);

// Get Single User (Protected Route)
router.get("/getOne/:id", protect, userController.getSingleUser);

// Update User (Protected Route)
router.put("/update/:id", protect, userController.updateUser);

// Delete User (Protected Route)
router.delete("/delete/:id", protect, userController.deleteUser);

module.exports = router;
