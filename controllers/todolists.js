// Import express
const express = require('express');

// Call the config file
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const app = express.Router();
// Import the ItemRepo
const TodoListRepo = require('../repositories/TodoListRepository');
const UserRepo = require('../repositories/UserRepository');
const ItemRepo = require('../repositories/TodoItemRepository');

// Get every todolist of a user 
app.get('/', (req, res) => {

    // Get every todolist and return them in Json format
    UserRepo.getTodolists(req.user.sub).then((todolists) => {
       
        // Return this one in Json format
        res.status(200).json(todolists);

    }).catch((error) => res.status(500).json(error));
});
// Add a todo todolist
app.post('/create', (req, res) => {

    // Get, from the body, the title as well as the userId
    const { title } = req.body;

    // get user's id
    const userId = req.user.sub;
    
    // Add the item to the selected todolist passing the userid and the title
    TodoListRepo.create(title, userId).then((todolist) => {
        // asign this new todolist to the user 
        UserRepo.addTodolist(todolist._id, userId);

        // Return this one in Json format
        res.status(200).json(todolist);

    }).catch((error) => res.status(500).json(error));
});

// Add a todo todolist
app.delete('/:id', (req, res) => {

    // Get, from the body, the title as well as the userId
    const todolistId  = req.params.id;

    // Delete todolist (with use the userId to be sure that the action is made by a user who own this todolist)
    TodoListRepo.delete(todolistId, req.user.sub).then((todolist) => {
        // If an element as been deleted
        if (todolist.ok && todolist.deletedCount>0) {
            // ToDo: this would be cool to have a proper "on delete cascade" statement on the todolist model 
            // Delete all its items as well 
            ItemRepo.deleteByTodolist(todolistId);
            
            
            res.status(200).json({status: "OK", result:  "Deleted"});

            
        } else {
            // Return this one in Json format
            res.status(500).json({status: "Error", result: "you cannot delete this todolist", detail: todolist});
        }

        

    }).catch((error) => res.status(500).json(error));
});
// Rename a todolist
app.put('/rename/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // update it
    TodoListRepo.rename(id, req.user.sub, req.body.title)
        .then(result => result ? res.status(200).json(result) : res.status(400).json({ message: 'todolist not found' }))
        .catch(error => res.status(500).json(error));
});

module.exports = app;