// Import express
const express = require('express');

// Import JWT 
let jwt = require('jsonwebtoken');

const app = express.Router();
const config = require('../config/config.js');

// Import the ItemRepo
const ItemRepo = require('../repositories/TodoItemRepository');
const TodoListRepo = require('../repositories/TodoListRepository');

// Routes
//
// Add a todo item
app.post('/:add', (req, res) => {

    const { name, todolistId } = req.body;

    // Add the item to the selected todolist
    ItemRepo.create(name, todolistId, req.user.sub).then((item) => {
        TodoListRepo.addItem(item._id, todolistId);
         
        // Return this one in Json format
        res.status(200).json(item);

    }).catch(error => res.status(500).json(error));
});

// Add a todo item
app.get('/get', (req, res) => {

    const { todolistId } = req.body;

    // Get items from the selected todolist
    ItemRepo.findByTodolist(todolistId, req.user.sub).then((item) => {
         
        // Return this one in Json format
        res.status(200).json(item);

    }).catch(error => res.status(500).json(error));
});

// delete a todo item
app.delete('/:id', (req, res) => {

    // Fetch the item id
    const { id } = req.params;

    ItemRepo.delete(id, req.user.sub).then((ok) => {
      // Return a success
      res.status(200).json({result: ok, message: `Deleted record with id: ${id}`});
    }).catch(error => res.status(500).json(error));
  });

// Update a todo item
app.put('/rename/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // get the todo item
    const todo = {name: req.body.name};

    // update it
    ItemRepo.rename(id, req.user.sub, todo)
        .then(result => result ? res.status(200).json(result) : res.status(400).json({ message: 'item not found' }))
        .catch(error => res.status(500).json({status:"Error", message: error}));
});

// check todo item
app.put('/check/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // update it
    ItemRepo.check(id, req.user.sub)
        .then(result => result ? res.status(200).json(result) : res.status(400).json({ message: 'item not found' }))
        .catch(error => res.status(500).json({ status:"Error", message: error }));
});

module.exports = app;



