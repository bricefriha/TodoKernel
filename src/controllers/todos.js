// Import express
const express = require('express');

const router = express.Router();

// Import the ItemRepo
const ItemRepo = require('../repositories/TodoItemRepository');
const TodoListRepo = require('../repositories/TodoListRepository');

// Routes
//
// Add a todo item
router.post('/:add', (req, res) => {

    const { name, todolistId } = req.body;

    // Add the item to the selected todolist
    ItemRepo.create(name, todolistId, req.user.sub).then((data) => {
        TodoListRepo.addItem(data._id, todolistId);
         
        // Return this one in Json format
        res.status(200).json(data);

    }).catch(err => res.status(500).json(err));
});

// Add a todo item
router.get('/get', (req, res) => {

    const { todolistId } = req.body;

    // Get items from the selected todolist
    ItemRepo.findByTodolist(todolistId, req.user.sub).then((data) => {
         
        // Return this one in Json format
        res.status(200).json(data);

    }).catch(err => res.status(500).json(err));
});

// delete a todo item
router.delete('/:id', (req, res) => {

    // Fetch the item id
    const { id } = req.params;

    ItemRepo.delete(id, req.user.sub).then((data) => {
      // Return a success
      res.status(200).json({result: data, message: `Deleted record with id: ${id}`});
    }).catch(err => res.status(500).json(err));
  });

// Update a todo item
router.put('/rename/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // get the todo item
    const todo = {name: req.body.name};

    // update it
    ItemRepo.rename(id, req.user.sub, todo)
        .then(data => data ? res.status(200).json(data) : res.status(403).json({ message: 'item not found' }))
        .catch(err => res.status(500).json({status:"Error", message: err}));
});

// check todo item
router.put('/check/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // update it
    ItemRepo.check(id, req.user.sub)
        .then(data => data ? res.status(200).json(data) : res.status(403).json({ message: 'item not found' }))
        .catch(err => res.status(500).json({ status:"Error", message: err }));
});
// check todo item
router.put('/move/:id', (req, res) => {
    
    // get the id
    const { id } = req.params;

    // update it
    ItemRepo.move(id, req.body.todolistId, req.body.newPosition, req.user.sub)
        .then(data => data ? res.status(200).json(data) : res.status(403).json({ message: 'item not found' }))
        .catch(err => res.status(500).json({ status:"Error", message: err }));
});

module.exports = router;



