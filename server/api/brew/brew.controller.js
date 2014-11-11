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
 * Get an individual brew by id.
 * @param req the request
 * @param res the response
 * @param next the next callback
 */
exports.show = function(req, res, next) {
  var brewId = req.params.id;

  Brew.findById(brewId, function (err, brew) {
    if (err) return next(err);
    if (!brew) return res.send(401);
    res.json(brew);
  });
};

exports.next = function (req, res, next) {
  Brew.find({}, function (err, brews) {
    if(err) return res.send(500, err);
    res.json(200, brews[0]);
  });
};


/**
 * Create a new brew.
 */
exports.create = function(req, res, next) {
    var newBrew = new Brew(req.body);
    newBrew.save(function(err, brew) {
        if(err) return validationError(res, err);
        res.json(201, brew);
    })
};

/**
 * Deletes a brew by id.
 */
exports.destroy = function(req, res) {
  Brew.findByIdAndRemove(req.params.id, function (err, brew) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};
