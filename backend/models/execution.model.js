const mongoose = require('mongoose');

const executionSchema = new mongoose.Schema({
    workflowId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Workflow',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending'
    },
    startTime: Date,
    endTime: Date,
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    error: String,
    logs: [{
      nodeId: String,
      timestamp: Date,
      type: String,
      message: String,
      data: mongoose.Schema.Types.Mixed
    }]
  }, { timestamps: true });

  module.exports = mongoose.model('Execution', executionSchema)