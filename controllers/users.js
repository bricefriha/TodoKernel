const express = require('express');
const router = express.Router();

// Import JWT 
let jwt = require('jsonwebtoken');

// Call the config file
const config = require('../config/config.js');

// Import the repository
const repository = require('../repositories/UserRepository');
const TodolistRepo = require('../repositories/TodoListRepository');

// routes
//
// Authentificate the user
router.post('/authenticate',(req, res) => {
    repository.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => res.status(500).json(err));
});

// Register the user
router.post('/register', (req, res, next) => {
    repository.create(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
});

// Get the current user
router.get('/current', (req, res, next) => {
    repository.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
});
// Get a single user
router.get('/:id', (req, res, next) => {
    repository.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
});
// Update a user
router.put('/', (req, res, next) => {

    repository.update(req.user.sub, req.body)
        .then(updatedUser => res.json(updatedUser))
        .catch(err => next(err));
});
// Delete a user
router.delete('/current', (req, res, next) => {

    repository._delete(req.user.sub)
        .then(function() {
            // Delete all todolists of the user
            TodolistRepo.deleteByUser(userId);
            res.json({status: "OK", result:  " deleted"});
        })
        .catch(err => next(err));
});
// Delete a user
router.delete('/cleanup', (req, res, next) => {
    
    // Delete all todolist of the current user
    TodolistRepo.deleteByUser(req.user.sub)
        .then(function() {;
            res.json({status: "OK", result:  " deleted"});
        })
        .catch(err => next(err));
});


module.exports = router;
