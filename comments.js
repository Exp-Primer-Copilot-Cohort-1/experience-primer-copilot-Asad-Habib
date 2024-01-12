// Create web server
 var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var Post = require('./models/post');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/comments');

// Configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

// Create a new comment
app.post('/comments', function(req, res) {
  var comment = new Comment();
  comment.text = req.body.text;
  comment.save(function(err, comment) {
    if (err) {
      return res.status(500).json({message: err.message});
    }
    res.json({'comment': comment, message: 'Comment Created'});
  });
});

// Get all comments
app.get('/comments', function(req, res) {
  Comment.find(function(err, comments) {
    if (err) {
      return res.status(500).json({message: err.message});
    }
    res.json({comments: comments});
  });
});

// Get a single comment
app.get('/comments/:id', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return res.status(500).json({message: err.message});
    }
    res.json({comment: comment});
  });
});

// Update a comment
app.put('/comments/:id', function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return res.status(500).json({message: err.message});
    }
    comment.text = req.body.text;
    comment.save(function(err, comment) {
      if (err) {
        return res.status(500).json({message: err.message});
      }
      res.json({comment: comment, message: 'Comment Updated'});
    });
  });
});

// Delete a comment
app.delete('/comments/:id', function(req, res) {
  Comment.findByIdAndRemove(req.params.id, function(err, comment) {
    if (err) {
      return res.status(500).json({message: err.message});
    }
    