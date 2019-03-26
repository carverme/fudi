var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router();

//GET /auth/signup - sends the form for signup... fix from index.js.
router.get('/signup', function(req, res) {
    res.render('auth/signup');
});

//GET /auth/login - sends the form for the login... fix from index.js.
router.get('/login', function(req, res) {
    res.render('auth/login');
});

//POST /auth/signup - processes the signup form, records in db.
router.post('/signup', function(req, res) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    }).spread(function(user, created) {
        if(created) {
            // no record found, created one.
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'Account created and logged in!'
            })(req, res);
            //immediately invoked function expression
        } else {
            req.flash('error', 'Email already exists!')
            res.redirect('/auth/signup');
        }
    }).catch(function(error) {
        console.log(error.message);
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});

//POST /auth/login - processes the login form.
router.post('/login', passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/auth/login',
   successFlash: 'You have logged in!',
   failureFlash: 'Invalid username and/or password!' 
}));

//GET /auth/logout - log out route.
router.get('/logout', function(req, res) {
    //Passport logout() removes req.user and clears the session.
    req.logout();
    req.flash('success', 'You have logged out!');
    res.redirect('/');
});

module.exports = router;