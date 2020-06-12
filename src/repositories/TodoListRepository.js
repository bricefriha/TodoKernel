// Import Todo model
const TodoList = require('../models/TodoList');
const TodoItem = require('../models/TodoItem');

const TodoitemRepo = require('../repositories/TodoItemRepository');



class TodoListRepository {

    constructor (model) {
        this.model = model;
    }
    // Create a todolist
    async create (titleParam, userId) {
        console.log(userId);

        const newTodoList = { title: titleParam, user: userId};
        const todoList = new TodoList(newTodoList);
        
        // Save into the db
        return todoList.save();
    } 
    // Get all todolist of a user
    async findByUser (userId) {
        return this.model.find({user: userId});
    }
    // Delete a specific todo list
    async delete (id, userId) {
        // Delete the selected todolist
        return await TodoList.deleteOne({"user": userId, "_id": id});
    }
    // Delete all todolists of a user
    async deleteByUser(userId) {

        // Delete all items from a specific user
        await TodoitemRepo.deleteByUser(userId);

        // Delete all todolist from a specific user
        return TodoList.deleteMany({"user":  userId});
    }
    // Add a todolist to a user
    async addItem (itemId, id) {
        // Get the todolist
        const todolist = await TodoList.findById(id);

        // Add the new item to the todo list
        todolist.items.push(itemId);

        // Save the change
        todolist.save();
    }
    // Rename a todolist
    async rename (id, userId, newTitle) {
        // Get the selected todolist
        const selectedTodolist = await TodoList.findOne({_id: id, user: userId});

        // copy userParam properties to user
        Object.assign(selectedTodolist, {title: newTitle});

        // update the todolist with the new name
        return await selectedTodolist.save();
    }
}

module.exports = new TodoListRepository (TodoItem);