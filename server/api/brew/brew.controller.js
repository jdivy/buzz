'use strict';

var Brew = require('./brew.model');
var config = require('../../config/environment');

var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Get list of brews
 */
exports.index = function(req, res) {
    Brew.find({}, function(err, brews) {
        if(err) return res.send(500, err);
        res.json(200, brews);
    });
};

/**
 * Create a new brew
 */
exports.create = function(req, res, next) {
    var newBrew = new Brew(req.body);
    newBrew.save(function(err, brew) {
        if(err) return validationError(res, err);
        res.json(201, brew);
    })
};