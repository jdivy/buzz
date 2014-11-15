'use strict';

var _ = require('lodash');
var Brew = require('./brew.model');

/**
 * Get list of brews
 */
exports.index = function (req, res) {
  Brew.find({}, function (err, brews) {
    if (err) return res.send(500, err);
    return res.json(200, brews);
  });
};

/**
 * Get an individual brew by id.
 */
exports.show = function (req, res, next) {
  Brew.findById(req.params.id, function (err, brew) {
    if (err) return next(err);
    if (!brew) return res.send(401);
    return res.json(brew);
  });
};

/**
 * Get the next brew in time.
 */
exports.next = function (req, res, next) {
  Brew.findOne({time: {$gt: new Date()}}, function (err, brew) {
    if (err) return res.send(500, err);
    if (brew) {
      return res.json(200, brew);
    } else {
      return res.json(200, {});
    }
  });
};

/**
 * Create a new brew.
 */
exports.create = function (req, res, next) {
  Brew.create(req.body, function (err, brew) {
    if (err) return validationError(res, err);
    return res.json(201, brew);
  });
};

/**
 * Updates a brew.
 */
exports.update = function(req, res) {
  if(req.body._id) {delete req.body._id;}
  Brew.findById(req.params.id, function (err, brew) {
    if(err) { return handleError(res, err);}
    if(!brew) { return res.send(404);}
    var updated = _.merge(brew, req.body);
    updated.save(function (err) {
      if(err) { return handleError(res, err);}
      return res.json(200, brew);
    });
  });
};

/**
 * Deletes a brew by id.
 */
exports.destroy = function (req, res) {
  Brew.findByIdAndRemove(req.params.id, function (err, brew) {
    if (err) {return res.send(500, err);}
    return res.send(204);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function validationError(res, err) {
  return res.json(422, err);
}
