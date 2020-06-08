// Import Todo model
const TodoItem = require('../models/TodoItem');
const Todolist = require('../models/TodoList');

class TodoItemRepository {

    constructor (model) {
        this.model = model;
    }

    // Create a todo
    async create (name, todoListId, userId) {

        const newTodo = { name,  done: false, todolist: todoListId, user: userId};
        const item = new TodoItem(newTodo);
        
        return item.save();
    } 

    // Get all todos
    findAll () {
        return this.model.find();
    }

    // Get all todos of a user
    async findByTodolist (todolistId, userId) {
        return TodoItem.find({todolist: todolistId, user: userId});
    }

    // Find a specific todo
    findById (id) {
        return this.model.findById(id);
    }

    // Delete a specific item
    async delete (id, userId) {
        return this.model.deleteOne({_id: id, user: userId});
    }
    // Delete every items of a todolist
    async deleteByTodolist (todolistId) {
        // Delete all items from a specific todolist
        return TodoItem.deleteMany({"todolist":  todolistId});
    }
    
    // Delete every items of a todolist
    async deleteByUser (userId) {
        // Delete all items from a specific user
        return TodoItem.deleteMany({"user":  userId});
    }
    // Update todo
    async rename (id, userId, object) {
        // Query to get the selected item
        const query = {_id: id, user: userId};

        // update the Item with the new name
        return this.model.findOneAndUpdate(query, { $set: {name: object.name}});
    }
    async check (id, userId) {
        const query = {_id: id, user: userId};

        // Get the actual state of the item
        const item = await TodoItem.findOne(query);

        // Check or uncheck the item
        return this.model.findOneAndUpdate(query, { $set: { done: !item.done}});
    }
    
    

}

module.exports = new TodoItemRepository (TodoItem);


