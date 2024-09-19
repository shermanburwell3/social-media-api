const mongoose = require('mongoose');
const { Schema } = mongoose;

// Reaction schema for nested documents
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280 // Maximum length of 280 characters
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => {
      return new Date(timestamp).toLocaleString(); // Format the timestamp
    }
  }
});

// Thought schema
const thoughtSchema = new Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => {
        return new Date(timestamp).toLocaleString();
      }
    },
    username: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true 
    },
    reactions: [reactionSchema] // Array of nested documents using the reactionSchema
  });

// Create a virtual property for reactionCount
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Create the Thought model
const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;