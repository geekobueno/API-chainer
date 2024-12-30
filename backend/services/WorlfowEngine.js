// services/WorkflowEngine.js
const RED = require('node-red');
const axios = require('axios');
const ExecutionLog = require('../models/Execution');

class WorkflowEngine {
  constructor() {
    this.nodeTypes = {
      api: this.createApiNode,
      condition: this.createConditionNode,
      transform: this.createTransformNode
    };
  }

  async executeWorkflow(workflow, inputData = {}) {
    const executionId = new mongoose.Types.ObjectId();
    
    try {
      const flow = this.generateFlow(workflow, executionId);
      await this.deployToNodeRed(flow);
      
      const result = await this.triggerFlow(executionId, inputData);
      await this.logExecution(executionId, workflow._id, 'completed', result);
      
      return { executionId, result };
    } catch (error) {
      await this.logExecution(executionId, workflow._id, 'failed', null, error);
      throw error;
    }
  }

  generateFlow(workflow, executionId) {
    const nodes = workflow.nodes.map(node => 
      this.nodeTypes[node.type](node, executionId)
    );

    const edges = workflow.edges.map(edge => ({
      id: `${edge.source}_${edge.target}`,
      type: 'link',
      source: edge.source,
      target: edge.target,
      wires: [[edge.target]]
    }));

    return [...nodes, ...edges];
  }

  createApiNode(node, executionId) {
    return {
      id: node.id,
      type: 'http request',
      name: `API Request: ${node.config.url}`,
      method: node.config.method,
      url: node.config.url,
      headers: node.config.headers,
      payload: node.config.body,
      wires: [],
      executionId
    };
  }

  createConditionNode(node, executionId) {
    return {
      id: node.id,
      type: 'switch',
      name: 'Condition',
      conditions: node.config.conditions.map(c => ({
        type: c.operator,
        value: c.value,
        valueType: typeof c.value
      })),
      wires: [],
      executionId
    };
  }

  createTransformNode(node, executionId) {
    return {
      id: node.id,
      type: 'function',
      name: 'Transform',
      func: this.generateTransformFunction(node.config.transformations),
      wires: [],
      executionId
    };
  }

  generateTransformFunction(transformations) {
    return `
      module.exports = function(msg) {
        const result = {};
        ${transformations.map(t => `
          result.${t.target} = msg.payload.${t.source};
        `).join('\n')}
        msg.payload = result;
        return msg;
      }
    `;
  }

  async deployToNodeRed(flow) {
    return new Promise((resolve, reject) => {
      RED.nodes.addFlow(flow)
        .then(flowId => {
          RED.nodes.enableFlow(flowId);
          resolve(flowId);
        })
        .catch(reject);
    });
  }

  async triggerFlow(executionId, inputData) {
    // Implement flow triggering logic using Node-RED runtime API
    return new Promise((resolve, reject) => {
      // Logic to trigger flow and collect results
    });
  }

  async logExecution(executionId, workflowId, status, result, error = null) {
    await ExecutionLog.create({
      executionId,
      workflowId,
      status,
      result,
      error: error?.message,
      timestamp: new Date()
    });
  }
}

module.exports = new WorkflowEngine();