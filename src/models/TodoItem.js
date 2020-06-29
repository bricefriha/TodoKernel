// Import mongoose
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const TodoList = require('../models/TodoList');
const User = require('../models/User');

const { Schema } = mongoose;

autoIncrement.initialize(mongoose);

// Define schema for todo items
const todoItemSchema = new Schema ({
    
    name: {
        type: String,
    },
    done: {
        type: Boolean,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    todolist: {
        type: Schema.Types.ObjectId,
        ref: 'TodoList',
        require: true,
    },
    order: {
        type: Number,
        ref: 'Order',
        
    },
});

// On delete cascade
// todoItemSchema.post("delete", document => {
//     const itemId = document._id;
//     TodoList.find({ items: { $in: [itemId] } }).then(todolists => {
//       Promise.all(
//         todolists.map(todolist =>
//             TodoList.findOneAndUpdate(
//                 todolist._id,
//             { $pull: { items: itemId } },
//             { new: true }
//           )
//         )
//       );
//     });
//   });
todoItemSchema.plugin(autoIncrement.plugin, { model: 'TodoItem', field: 'order' });
const TodoItem = mongoose.model('TodoItem', todoItemSchema);

module.exports = TodoItem;