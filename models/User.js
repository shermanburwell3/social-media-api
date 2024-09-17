const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ // This regex ensures that the email is in a valid format
  },
  thoughts: [{
    type: Schema.Types.ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Create a virtual property for friendCount
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;