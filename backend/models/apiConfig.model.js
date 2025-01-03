const mongoose = require('mongoose');

const apiConfigSchema = new mongoose.Schema({
    name: { type: String, required: true },
    baseUrl: { type: String, required: true },
    auth: {
      type: {
        type: String,
        enum: ['none', 'basic', 'bearer', 'oauth2'],
        default: 'none'
      },
      credentials: {
        username: String,
        password: String,
        token: String,
        clientId: String,
        clientSecret: String
      }
    },
    headers: Map,
    timeout: Number,
    retryConfig: {
      maxRetries: Number,
      retryDelay: Number
    }
  }, { timestamps: true });
  

  module.exports = mongoose.model('ApiConfig', apiConfigSchema)