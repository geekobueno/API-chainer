const express = require("express");
const router = express.Router();
const apiConfigController = require("../controller/apiConfig.controller")

router.post("/", apiConfigController.createConfig);

router.get("/",  apiConfigController.getAllConfig);

router.get("/:id",  apiConfigController.getSingleConfig);

router.put("/:id",  apiConfigController.updateConfig);

router.delete("/:id",  apiConfigController.deleteConfig)

module.exports = router