const ExecutionLog = require("../models/execution.model");

const createLog = async (req,res) => {
    try {
        const log = await ExecutionLog.create(req.body);
        res.status(201).json(log);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const getAllLog = async (req,res) => {
    try {
        const logs = await ExecutionLog.find();
        res.json(logs);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const getSingleLog = async (req,res) => {
    try {
        const log = await ExecutionLog.findById(req.params.id);
        if(!log) return res.status(404).json({error: "Execution logs not found"})
        res.json(log);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const updateLog = async (req, res) => {
    try{
        const log = await ExecutionLog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!log) return res.status(404).json({error: "Execution logs not found"});
        res.json(log)
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const deleteLog = async (req,res) => {
    try{
        const log = await ExecutionLog.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({error: "Execution logs not found"});
        res.json({message: "Logs deleted succesfully"})
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createLog,
    getAllLog,
    getSingleLog,
    updateLog,
    deleteLog,
}