const { Workflow, Node } = require("../models/workflow.model");

const createNode = async (req, res) => {
  try {
    const node = await Node.create(req.body);
    res.status(201).json(node);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNode = async (req, res) => {
  try {
    const nodes = await Node.find();
    res.json(nodes)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleNode = async (req, res) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) return res.status(404).json({ error: "Node not found" });
    res.json(node)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNode = async (req, res) => {
  try {
    const node = await Node.findByIdAndUpdate(req.params.id, reqNode.body, {
      new: true,
      runValidators: true,
    });
    if (!node) return res.status(404).json({ error: "Node not found" });

    res.json(node);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNode = async (req, res) => {
  try {
    const node = await Node.findByIdAndDelete(req.params.id);
    if (!node) return res.status(404).json({ error: "Node not found" });
    res.json({ message: "Node deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.create(req.body);
    res.status(201).json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllWorkflow = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    res.json(workflow)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!workflow) return res.status(404).json({ error: "Workflow not found" });

    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow) return res.status(404).json({ error: "workflow not found" });
    res.json({ message: "Workflow deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    createNode,
    getAllNode,
    getSingleNode,
    updateNode,
    deleteNode,
    createWorkflow,
    getAllWorkflow,
    getSingleWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };