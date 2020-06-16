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
        .then(data => data ? res.status(200).json(data) : res.status(403).json({ message: 'Username or password is incorrect' }))
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});

// Register the user
router.post('/register', (req, res) => {
    repository.create(req.body)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});

// Get the current user
router.get('/current', (req, res) => {
    repository.getById(req.user.sub)
        .then(data => data ? res.status(200).json(data) : res.status(403).json({status:"Error 403"}))
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});
// Get a single user
router.get('/:id', (req, res) => {
    repository.getById(req.params.id)
        .then(data => data ? res.status(200).json(data) :  res.status(403).json({status:"Error 403"}))
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});
// Update a user
router.put('/', (req, res) => {

    repository.update(req.user.sub, req.body)
        .then(() => res.status(200).json({status:"OK", message: "Changes saved"}))
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});
// Delete a user
router.delete('/current', (req, res) => {

    repository._delete(req.user.sub)
        .then(function() {
            // Delete all todolists of the user
            TodolistRepo.deleteByUser(userId);
            res.status(200).json({status: "OK", result:  "Deleted"});
        })
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});
// Delete a user
router.delete('/cleanup', (req, res) => {
    
    // Delete all todolist of the current user
    TodolistRepo.deleteByUser(req.user.sub)
        .then(function() {;
            res.status(200).json({status: "OK", result:  " deleted"});
        })
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});
// Send an email to recover the email
router.post('/forgot', (req, res) => {
    repository.sendRecoveryEmail(req.body.email)
        .then(data => res.status(200).json({status:"OK", message: data}))
        .catch(err => res.status(500).json({status:"Error 500", message: err}));
});
// Rename a todolist
router.put('/recovery', (req, res) => {
    
    // get the id
    const { recoveryCode, newPassword } = req.body;

    // update it
    repository.recoverPassword(recoveryCode, newPassword)
        .then(data => data ? res.status(200).json(data) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => res.status(401).json(err));
});


module.exports = router;
