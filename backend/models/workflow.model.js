const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['api', 'condition', 'transform', 'trigger'],
    required: true
  },
  name: { type: String, required: true },
  config: {
    method: String,
    url: String,
    headers: Map,
    body: mongoose.Schema.Types.Mixed,
    conditions: [{
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed
    }],
    transformations: [{
      source: String,
      target: String,
      operation: String
    }]
  },
  position: {
    x: Number,
    y: Number
  }
},  { timestamps: true }
);

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  nodes: [nodeSchema],
  edges: [{
    source: String,
    target: String,
    condition: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['draft', 'active', 'disabled'],
    default: 'draft'
  }
}, { timestamps: true });

module.exports ={
 Workflow : mongoose.model('Workflow', workflowSchema),
 Node : mongoose.model('Node', nodeSchema)
} 