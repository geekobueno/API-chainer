const RED = require('node-red');
const { Execution } = require('../models/execution.model');
const EventEmitter = require('events');

class WorkflowEngine {
  constructor() {
    // Event emitter for workflow execution events
    this.eventEmitter = new EventEmitter();
    
    // Map of node type to creation function
    this.nodeTypes = {
      api: this.createApiNode,
      condition: this.createConditionNode,
      transform: this.createTransformNode
    };
  }

  /**
   * Main entry point for workflow execution
   * @param {Object} workflow - Workflow definition from database
   * @param {Object} inputData - Initial input data for workflow
   */
  async executeWorkflow(workflow, inputData = {}) {
    // Create execution record
    const execution = await Execution.create({
      workflowId: workflow._id,
      status: 'running',
      input: inputData,
      startTime: new Date()
    });

    try {
      // Convert workflow definition to Node-RED flow
      const flow = this.generateFlow(workflow, execution._id);
      
      // Deploy flow to Node-RED
      const flowId = await this.deployToNodeRed(flow);
      
      // Trigger flow execution and wait for completion
      const result = await this.triggerFlow(flowId, execution._id, inputData);
      
      // Update execution record
      await Execution.findByIdAndUpdate(execution._id, {
        status: 'completed',
        output: result,
        endTime: new Date()
      });

      return { executionId: execution._id, result };
    } catch (error) {
      // Log error and update execution status
      await Execution.findByIdAndUpdate(execution._id, {
        status: 'failed',
        error: error.message,
        endTime: new Date()
      });
      throw error;
    }
  }

  /**
   * Convert workflow definition to Node-RED flow
   * @param {Object} workflow - Workflow definition
   * @param {String} executionId - Execution ID for tracking
   */
  generateFlow(workflow, executionId) {
    // Convert nodes to Node-RED format
    const nodes = workflow.nodes.map(node => 
      this.nodeTypes[node.type](node, executionId)
    );

    // Create edges between nodes
    const edges = workflow.edges.map(edge => ({
      id: `${edge.source}_${edge.target}`,
      type: 'link',
      source: edge.source,
      target: edge.target,
      wires: [[edge.target]]
    }));

    return [...nodes, ...edges];
  }

  /**
   * Create Node-RED node for API requests
   */
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

  /**
   * Create Node-RED node for conditional logic
   */
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

  /**
   * Create Node-RED node for data transformation
   */
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

  /**
   * Generate JavaScript function for data transformation
   */
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

  /**
   * Deploy flow to Node-RED runtime
   */
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

  /**
   * Trigger flow execution and collect results
   * @param {String} flowId - Node-RED flow ID
   * @param {String} executionId - Execution tracking ID
   * @param {Object} inputData - Initial input data
   */
  async triggerFlow(flowId, executionId, inputData) {
    return new Promise((resolve, reject) => {
      // Set up event listeners for flow completion
      const timeout = setTimeout(() => {
        reject(new Error('Flow execution timeout'));
      }, 30000); // 30 second timeout

      // Listen for node completion events
      this.eventEmitter.once(`flow.${executionId}.complete`, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

      this.eventEmitter.once(`flow.${executionId}.error`, (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      // Start flow execution
      RED.nodes.getFlow(flowId).then(flow => {
        const startNode = flow.nodes.find(n => !n.wires.length);
        if (!startNode) {
          reject(new Error('No start node found'));
          return;
        }

        // Inject input data into first node
        RED.nodes.getNode(startNode.id).receive({
          payload: inputData,
          executionId
        });
      });
    });
  }

  /**
   * Log node execution progress
   */
  async logNodeExecution(executionId, nodeId, status, data) {
    await Execution.findByIdAndUpdate(executionId, {
      $push: {
        logs: {
          nodeId,
          timestamp: new Date(),
          type: status,
          data
        }
      }
    });
  }
}

module.exports = new WorkflowEngine();