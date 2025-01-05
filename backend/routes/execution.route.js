const express = require("express");
const router = express.Router();
const executionController = require("../controller/execution.controller");

router.post("/", executionController.createLog);

router.get("/", executionController.getAllLog);

router.get("/:id", executionController.getSingleLog);

router.put("/:id", executionController.updateLog);

router.delete("/:id", executionController.deleteLog);

module.exports = router;
