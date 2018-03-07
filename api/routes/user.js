const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');



//before making a new user, check to make sure one doesn't already exists by running the user model User and using the .find method, then checking if there is a user. When you use .find like this, it won't give you a null, it will give you an empty array. So we check to see if the array length is greater than or equal to 1 as opposed to checking if it is not null. 
//Status 409 means "conflict"
//do not store your password with raw data by passing password: req.body.password
//instead hash it with node-bcrypt-js
//inside the hash the second argument is salting. It provides a random number to go with the hash so as to make sure that the bcrypted word can not be looked up in a hash dictionary and translated

router.post('/signup', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

//for logging in
//post to /login to check to  see if we have a user, and if we do, create a token
//even though our response will be an array(though we could use findOne instead), it will contain one user since we are making sure there aren't duplicates in the post signup above. So semantically, we will pass user as our argument and not users. if there is  nothing in the array, don't tell people that the email does not exist, instead say the Auth failed (this is why often websites say either the email or password are incorrect)
//to make sure the passwords match, use bcrypt.compare(plainPassword, hash, result). Here we pass teh body of the user input, then the encrypted text from the database
//the duplicate 401 auth failed is for the similar reason of not letting people know what passwords and usernames exist
//if the result is correct (user and password match) then we assign a json web token. Secret is set in your environement variable
router.post('/login', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;