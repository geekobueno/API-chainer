const ApiConfig = require("../models/apiConfig.model");
const bcrypt = require("bcrypt");

const createConfig = async (req, res) => {
  try {
    const config = await ApiConfig.create(req.body);
    res.status(201).json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllConfig = async (req, res) => {
  try {
    const configs = await ApiConfig.find();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleConfig = async (req, res) => {
  try {
    const config = await ApiConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ error: "Configuration not found" });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateConfig = async (req, res) => {
  try {
    if (req.body.credentials.password) {
      const salt = bcrypt.genSalt(10);
      req.body.credentials.password = await bcrypt.hash(
        req.body.credentials.password,
        salt
      );
    }

    const config = await ApiConfig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!config) return res.status(404).json({error: "Configuration not found"});
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConfig = async (req,res) => {
    try{
        const config = await ApiConfig.findByIdAndDelete(req.params.id);
        if(!config) return res.status(404).json({error: "Configuration not found"});
        res.json({message: "Configuration deleted successfully"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createConfig,
    getAllConfig,
    getSingleConfig,
    updateConfig,
    deleteConfig,
}