
var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var app = express();
var port = process.env.PORT || 2000;


app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));


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

app.listen(port, function() {
    console.log("You're listening to the smooth sounds of port " + port + " in the morning");
});
