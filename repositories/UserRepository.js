// Importing config
const config = require('../config/config.js');
// Use jwt
const jwt = require('jsonwebtoken');

// Integrate Bcrypt
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');

// Helper
const mathHelper = require('../helpers/math');

// Import User model
const User = require('../models/User');
const TodoList = require('../models/TodoList');

class UserRepository {

    // Constructor
    constructor(model) {
        this.model = model;
    }

    // To Authentificate a user
    async authenticate({ username, email, password }) {
        // Try to know if the user try to login with his email
        if (email) {

            // Get the user from his email
            var user = await User.findOne({ email }).populate({ path: 'todolists', populate: { path: 'todolists' } });
        } else if (username) {

            // Get the user from his username
            var user = await User.findOne({ username }).populate({ path: 'todolists', populate: { path: 'todolists' } });
        } else {
            throw "email or username missing";
        }


        // Verify the input
        if (user && bcrypt.compareSync(password, user.hash)) {

            // Create the token
            const token = jwt.sign({ sub: user.id }, config.Secret);

            // Return all the information needed
            return {
                username: user.username,
                email: user.email,
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
        try {
            // Get the current user
            currentUser = await User.findById(id);
        }
        catch
        {
            throw 'user not found'
        }

        return {
            user: currentUser.username,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            creationDate: currentUser.createdDate,
        };
    }

    // Create a user
    async create(userParam) {
        // Verify that the username is not already taken
        if (await User.findOne({ username: userParam.username })) {
            throw 'Username "' + userParam.username + '" is already taken';
        }
        // Verify that the email adress is not already taken
        if (await User.findOne({ email: userParam.email })) {
            throw 'Email adress "' + userParam.email + '" is already taken';
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
            await user.save();

        } else {
            throw 'Password incorrect';
        }

    }

    // Delete a user
    async _delete(id) {
        await User.findByIdAndRemove(id);
    }
    // Add a todolist
    async addTodolist(todolistId, id) {
        // Get the user
        const user = await User.findById(id);

        // Add the new todolist
        user.todolists.push(todolistId);

        // Save the change
        user.save();
    }
    // Get every user's todolists
    async getTodolists(id) {

        // Return the list
        return TodoList.find({ user: id }).populate({ path: 'items', populate: { path: 'items' } });

    }
    // Send an email to recover a password
    async sendRecoveryEmail(emailUser) {
        var user = await User.findOne({ email: emailUser });

        if (user) {
            // Create the transporter
            const transporter = nodemailer.createTransport({
                service: config.serviceEmail,
                auth: {
                    user: config.Email,
                    pass: config.PasswordEmail
                }
            });

            try {
                // Generate a random code
                var code = mathHelper.generateRandomString(6);
            } catch (error) {
                throw 'error code generation: '+ error;
            }

            // Set a message
            var message = `Hello `  + user.firstName+`,
                           We are sorry to learn that you forgot your password.😢
                           However you can reset it thanks to this magic code 😀: 
                           `+ code + `

                           (this code is available for only 5 minutes)

                           Seen you there! 😁`

            // Set the email
            const mailOptions = {
                from: config.Email,
                to: emailUser,
                subject: 'TodoKernel - Password Change Request 🔑',
                text: message
            };

            // Send the email
            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    throw error;
                } else {
                    

                    // Return result
                    return 'Email sent: ' + info.response;
                }
            });
            // Register the code in the database
            Object.assign(user, {recoveryCode: code});

            // Update the user
            await user.save();
            
            // set an interval of five minutes
            var minutes = 5, the_interval = minutes * 60 * 1000;

            // After 5 minutes delete the code
            setInterval(function() {
                // Reset the recovery code
                Object.assign(user, {recoveryCode: ''});

                // Update the user
                user.save();
            }, the_interval);
            
        } else {
            throw "There is no user link to this email";
        }


    }
    // Recover the password
    async recoverPassword(code, newPassword) {

        // Find a user with this recovery code
        const userToRecover = await User.findOne({ recoveryCode: code });

        if (userToRecover) {
                if (newPassword){
                    // hash password
                    var passwordHashed = bcrypt.hashSync(newPassword, 10);
                } else {
                    throw 'please enter a new password';
                }

                // Reset the recovery code
                Object.assign(userToRecover, {recoveryCode: '', hash: passwordHashed});

                // Update the user
                await userToRecover.save();
            
        } else {
            throw 'Please try again';
        }
        
        return this.authenticate({ username: userToRecover.username, password: newPassword });

    }
}

module.exports = new UserRepository(User);