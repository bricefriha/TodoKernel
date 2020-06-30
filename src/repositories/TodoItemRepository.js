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

    // Get all todos of a user
    async findByTodolist (todolistId, userId) {
        return TodoItem.find({todolist: todolistId, user: userId}).sort( { order: 1 } );
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
    // Update item
    async rename (id, userId, object) {
        // Query to get the selected item
        const selectedItem = await TodoItem.findOne({_id: id, user: userId});
        
        // Verify is the item is found
        if (selectedItem) {
            // copy parameters properties to the item
            Object.assign(selectedItem, {name: object.name});
        } else {
            throw 'item not found';
        }

        // update the todolist with the new name
        return await selectedItem.save();
    }
    // Update item update an item
    async check (id, userId) {
        // Query to get the selected item
        const selectedItem = await TodoItem.findOne({_id: id, user: userId});
        
         if (selectedItem) {
            const newVal = !selectedItem.done;

            // Check or uncheck the item
            Object.assign(selectedItem, {done: newVal});
         } else {
             throw 'item not found';
         }
 
         // update the todolist with the new name
         return await selectedItem.save();
    }
    async move (itemId, todolistId, newPosition, userId) {
        // Query to get the selected item
        const selectedItem = await TodoItem.findOne({_id: itemId, user: userId});

        const condition = {todolist: todolistId, user: userId};
        
        // If the item is moved out from his todolist
        if (todolistId !== selectedItem.todolist) {
             // Get all items below the old position
             var itemsBelowOldPosition = TodoItem.find({todolist: selectedItem.todolist, user: userId}).where('order').gt(selectedItem.order-1);
            // Loop into this list
            (await itemsBelowOldPosition).forEach((item, index, arr) =>{
                // Check or uncheck the item
                Object.assign(arr[index], {order: item.order - 1});
                 arr[index].save();
            });
        }
        // Get items which get a position
        var todoItemsOnTop = TodoItem.find(condition).where('order').gt(selectedItem.order-1).lt(newPosition);

        // Get all items below this one
        var todoItemsBelow = TodoItem.find(condition).where('order').gt(newPosition-1);

        // Loop into this list
        (await todoItemsBelow).forEach((item, index, arr) =>{
            // Check or uncheck the item
            Object.assign(arr[index], {order: item.order + 1});
            // update the todolist with the new name
             arr[index].save();
        });
        // Loop into this list
        (await todoItemsOnTop).forEach((item, index, arr) =>{
            // Check or uncheck the item
            Object.assign(arr[index], {order: item.order - 1});
             arr[index].save();
        });

        // Give to the item its new position 
        Object.assign(selectedItem, {order: newPosition});
        
        // Save and return the item I just moved
        return await selectedItem.save();
    }
    
    

}

module.exports = new TodoItemRepository (TodoItem);


