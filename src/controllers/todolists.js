// Import express
const express = require('express');

// Call the config file
const router = express.Router();
// Import the ItemRepo
const TodoListRepo = require('../repositories/TodoListRepository');
const UserRepo = require('../repositories/UserRepository');
const ItemRepo = require('../repositories/TodoItemRepository');

// Get every todolist of a user 
router.get('/', (req, res) => {

    // Get every todolist and return them in Json format
    UserRepo.getTodolists(req.user.sub).then((data) => {
       
        // Return this one in Json format
        res.status(200).json(data);

    }).catch((err) => res.status(500).json(err));
});
// Add a todo todolist
router.post('/create', (req, res) => {

    // Get, from the body, the title as well as the userId
    const { title } = req.body;

    // get user's id
    const userId = req.user.sub;
    
    // Add the item to the selected todolist passing the userid and the title
    TodoListRepo.create(title, userId).then((data) => {
        // asign this new todolist to the user 
        UserRepo.addTodolist(data._id, userId);

        // Return this one in Json format
        res.status(200).json(data);

    }).catch((err) => res.status(500).json(err));
});

// Add a todo todolist
router.delete('/:id', (req, res) => {

    // Get, from the body, the title as well as the userId
    const todolistId  = req.params.id;

    // Delete todolist (with use the userId to be sure that the action is made by a user who own this todolist)
    TodoListRepo.delete(todolistId, req.user.sub).then((data) => {
        // If an element as been deleted
        if (data.ok && data.deletedCount>0) {
            // ToDo: this would be cool to have a proper "on delete cascade" statement on the todolist model 
            // Delete all its items as well 
            ItemRepo.deleteByTodolist(todolistId);
            
            
            res.status(200).json({status: "OK", result:  "Deleted"});

            
        } else {
            // Return this one in Json format
            res.status(500).json({status: "Error", result: "you cannot delete this todolist", detail: data});
        }

        

    }).catch((err) => res.status(500).json(err));
});
// Rename a todolist
router.put('/rename/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // update it
    TodoListRepo.rename(id, req.user.sub, req.body.title)
        .then(data => data ? res.status(200).json(data) : res.status(400).json({ message: 'todolist not found' }))
        .catch(err => res.status(500).json(err));
});

module.exports = router;