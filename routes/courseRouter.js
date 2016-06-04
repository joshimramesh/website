var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Courses = require('../models/course');
var Verify = require('./verify');
var fs = require('fs');
var courseRouter = express.Router();
courseRouter.use(bodyParser.json());

courseRouter.route('/')
.get(function (req, res, next) {
    Courses.find({}, function (err, course) {
        if (err) throw err;
        res.json(course);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Courses.create(req.body, function (err, course) {
        if (err) throw err;
        console.log('Created the Course');
        var id = course._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Course with id: ' + id + 'request=' + req.body.image);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Courses.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

courseRouter.route('/:courseId')
.get(function (req, res, next) {
    Courses.findById(req.params.courseId, function (err, course) {
        if (err) throw err;
        res.json(course);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Courses.findByIdAndUpdate(req.params.courseId, {
        $set: req.body
    }, {
        new: true
    }, function (err, course) {
        if (err) throw err;
        res.json(course);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Courses.findByIdAndRemove(req.params.courseId, function (err, resp) {        
    	if (err) throw err;
        res.json(resp);
    });
});

module.exports = courseRouter;