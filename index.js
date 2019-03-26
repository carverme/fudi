require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var port = process.env.PORT || 2000;
// Auth
var session = require('express-session');
var passport = require('./config/passportConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var flash = require('connect-flash');

var app = express();



app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));
app.use(require('morgan')('dev'));

// <----------AUTH - Passport/Flash enablement----------->
//must come before you use app.use passportjs.
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

//initializes and sets up flash messages.
app.use(flash());

//must come after session setup.
app.use(passport.initialize());
app.use(passport.session());

//attaches current user to all routes.
//attaches flash messages.
app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/auth', require('./controllers/auth'));



// <--------------------ROUTES--------------------->
    // GET / - gets the main site index page
    app.get('/', function(req, res) {
      res.render('index');
    });

    // GET /about - gets the main site about page
    app.get('/about', function(req, res) {
      res.render('about');
    });

    // GET /articles - gets full articles list
    app.get('/articles', function(req, res) {
      db.article.findAll().then(function(data) {
        res.render('articles/index', { articles: data });
      });
    });

    // POST /articles - create a new article from form data
    app.post('/articles', function(req, res) {
      db.article.create({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
        }).then(function(data) {
          res.redirect('/articles');
        });
    });

    // GET /articles/new - returns form for new article
    app.get('/articles/new', function(req, res) {
      res.render('articles/new');
    });

    // New - GET /auths/signup
    app.get('/auths/signup', function(req, res) {
      res.render('auths/signup');
    });

    // New - GET /auths/login
    app.get('/auths/login', function(req, res) {
      res.render('auths/login');
    })

    //New - GET /fudis/index
    app.get('/fudis/index', function(req, res) {
      res.render('fudis/index');
    })

    //New - GET /fudis/new
    app.get('/fudis/new', function(req, res) {
      res.render('fudis/new');
    })

    //GET to /articles/edit - updates the specific article called.
    app.get('/articles/:index/edit', function(req, res) {
      var index = parseInt(req.params.index);
      db.article.find({
        where: {id: index}
        }).then(function(data) {
          res.render('articles/edit', {article: data})
        });
    });

    // GET ONE/articles/:index - gets a specific article
    app.get('/articles/:index', function(req, res) {
      var index = parseInt(req.params.index);
      db.article.find({
        where: {id: req.params.index}
        }).then(function(data) {
          console.log(data);
          if(data != null){
            res.render('articles/show', {article: data});
          } else {
            res.render('articles/404');
          }
        });
    });

    app.put('/articles/:index', function(req, res) {
      db.article.update({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
        }, {
          where: {id: req.params.index}
          }).then(function(data){
            res.send(data);
          });
    });

    //<--------------Delete Route-------------->
    app.delete('/articles/:index', function(req,res) {
      db.article.destroy({
        where: {id: req.params.index}
      }).then(function(data) {
        console.log(data);
        res.sendStatus(200);
      });
    });
    //<--------------Delete Route End-------------->

var server = app.listen(port, function() {
    console.log("You're listening to the smooth sounds of port " + port + " in the morning");
});

module.exports = server;