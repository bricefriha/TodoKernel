// Import mongoose
const mongoose = require('mongoose');
const TodoItem = require('../models/TodoItem');

const { Schema } = mongoose;

// Define schema for todo items
const todoListSchema = new Schema ({
    title: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    items: [{
        type: Schema.Types.ObjectId,
        ref: 'TodoItem'
    }]
});
// On delete cascade
// todoListSchema.post("delete", document => {
//     const itemId = document._id;
//     TodoItem.deleteMany({"todolist":  document._id });
//     // TodoList.find({ items: { $in: [itemId] } }).then(todolists => {
//     //   Promise.all(
//     //     todolists.map(todolist =>
//     //         TodoList.findOneAndUpdate(
//     //             todolist._id,
//     //         { $pull: { items: itemId } },
//     //         { new: true }
//     //       )
//     //     )
//     //   );
//     // });
//   });
const TodoList = mongoose.model('TodoList', todoListSchema);

module.exports = TodoList;