// Importing config
const config = require('../config/config.js');
// Use jwt
const jwt = require('jsonwebtoken');

// Integrate Bcrypt
const bcrypt = require('bcryptjs');

// Import User model
const User = require('../models/User');
const TodoList = require('../models/TodoList');

class UserRepository {

    // Constructor
    constructor (model) {
        this.model = model;
    }

    // To Authentificate a user
    async authenticate({ username, password }) {
        // Get the user
        const user = await User.findOne({ username }).populate({path:'todolists', populate: { path: 'todolists' }});

        // Verify the input
        if (user && bcrypt.compareSync(password, user.hash)) {

            // Create the token
            const token = jwt.sign({ sub: user.id }, config.Secret);

            // Return all the information needed
            return {
                user: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                todolists: user.todolists,
                token
            };
        }
    }
    
    // Get a single user
    async getById(id) {
        var currentUser;
        try
        {
            // Get the current user
            currentUser = await User.findById(id);
        }
        catch
        {
            throw 'user not found'
        }

        return {
            user: currentUser.username,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            creationDate: currentUser.createdDate,
        };
    }
    
    // Create a user
    async create(userParam) {
        // validate
        if (await User.findOne({ username: userParam.username })) {
            throw 'Username "' + userParam.username + '" is already taken';
        }
    
        const user = new User(userParam);
    
        // hash password
        if (userParam.password) {
            user.hash = bcrypt.hashSync(userParam.password, 10);
        }
    
        // save user
        await user.save();

        // Login the user
        return this.authenticate({ username: userParam.username, password: userParam.password });
    }
    
    // Update a user
    async update(id, userParam) {
        
        // Get the current user 
        const user = await User.findById(id);
    
        // validate
        if (user && bcrypt.compareSync(userParam.password, user.hash)) {

            // Here we verify that the username hasn't been already picked
            if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
                throw 'Username "' + userParam.username + '" is already taken';
            }
        
            // hash the new password if it was filled
            if (userParam.newPassword) {
                userParam.hash = bcrypt.hashSync(userParam.newPassword, 10);
            }
            else {
                // Use the previous hashed password
                userParam.hash = user.hash;
            }
        
            // copy userParam properties to user
            Object.assign(user, userParam);
            
            // Update the user
            var updatedUser = await user.save();

        } else {
            throw 'Password incorrect';
        }

        // Return the new user info
        return {
            user: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
        };
        
    }
    
    // Delete a user
    async _delete(id) {
        await User.findByIdAndRemove(id);
    }
    // Add a todolist
    async addTodolist (todolistId, id) {
        // Get the user
        const user = await User.findById(id);

        // Add the new todolist
        user.todolists.push(todolistId);

        // Save the change
        user.save();
    }
    // Get every user's todolists
    async getTodolists (id) {

        // Return the list
        return TodoList.find({user: id}).populate({path:'items', populate: { path: 'items' }});

    }
}

module.exports = new UserRepository (User);