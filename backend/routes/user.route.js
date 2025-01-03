const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// CRUD Operations for Users

// Create User
router.post("/", userController.createUser);

// Get All Users
router.get("/", userController.getAllUser);

// Get Single User
router.get("/:id", userController.getSingleUser);

// Update User
router.put("/:id", userController.updateUser);

// Delete User
router.delete("/:id", userController.deleteUser);

module.exports = router
