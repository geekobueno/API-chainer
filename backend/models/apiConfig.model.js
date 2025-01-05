const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

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

  apiConfigSchema.pre("save", async function (next) {
    if (!this.isModified("credentials")) {
      return next();
    }

    try {
      const salt = await bcrypt.genSalt(10);
      this.credentials.password = await bcrypt.hash(this.credentials.password, salt);
      next();
    }catch(error) {
      next(error);
    }
  })
  

  module.exports = mongoose.model('ApiConfig', apiConfigSchema)