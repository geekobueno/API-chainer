const express = require("express");
const router = express.Router();
const elementController = require("../controller/element.controller");

router.post("/workflow", elementController.createWorkflow);

router.get("/workflow", elementController.getAllWorkflow);

router.get("/workflow/:id", elementController.getSingleWorkflow);

router.put("/workflow/:id", elementController.updateWorkflow);

router.delete("/workflow/:id", elementController.deleteWorkflow);

router.post("/node", elementController.createNode);

router.get("/node", elementController.getAllNode);

router.get("/node/:id", elementController.getSingleNode);

router.put("/node/:id", elementController.updateNode);

router.delete("/node/:id", elementController.deleteNode);

module.exports = router;
