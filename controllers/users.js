const express = require('express');
const router = express.Router();

// Import the repository
const repository = require('../repositories/UserRepository');
const TodolistRepo = require('../repositories/TodoListRepository');

// routes
//
// Authentificate the user
router.post('/authenticate',(req, res) => {
    repository.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});

// Register the user
router.post('/register', (req, res) => {
    repository.create(req.body)
        .then(user => res.json(user))
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});

// Get the current user
router.get('/current', (req, res) => {
    repository.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});
// Get a single user
router.get('/:id', (req, res) => {
    repository.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});
// Update a user
router.put('/', (req, res) => {

    repository.update(req.user.sub, req.body)
        .then(updatedUser => res.json(updatedUser))
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});
// Delete a user
router.delete('/current', (req, res) => {

    repository._delete(req.user.sub)
        .then(function() {
            // Delete all todolists of the user
            TodolistRepo.deleteByUser(userId);
            res.json({status: "OK", result:  " deleted"});
        })
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});
// Delete a user
router.delete('/cleanup', (req, res) => {
    
    // Delete all todolist of the current user
    TodolistRepo.deleteByUser(req.user.sub)
        .then(function() {;
            res.json({status: "OK", result:  " deleted"});
        })
        .catch(error => res.status(500).json({status:"Error 500", message: error}));
});


module.exports = router;
