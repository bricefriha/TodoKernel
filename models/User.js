// Import mongoose
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { 
        type: String,
        unique: true,
        required: true 
    },
    email: { 
        type: String,
        unique: true,
        required: true 
    },
    hash: { 
        type: String, 
        required: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    recoveryCode: { 
        type: String,
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    todolists: [{
        type: Schema.Types.ObjectId,
        ref: 'TodoList'
    }]
});

//
const User = mongoose.model('User', userSchema);

module.exports = User;