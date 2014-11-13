'use strict';

var should = require('should');
var app = require('../../app');
var Brew = require('./brew.model');

var brew = new Brew({
  time: new Date(),
  bean: {
    roastery: "Tonx",
    roast: "Light",
    name: "Colombia"
  },
  water: {
    temperature: 200,
    degrees: "F"
  },
  grind: {
    size: "28B",
    grinder: "Baratza Preciso"
  }
});

describe('Brew Model', function () {
  before(function (done) {
    // Clear all brews before testing
    Brew.remove().exec().then(function () {
      done();
    });
  });

  afterEach(function (done) {
    Brew.remove().exec().then(function () {
      done();
    });
  });

  it('should begin with no brews', function (done) {
    Brew.find({}, function (err, brews) {
      brews.should.have.length(0);
      done();
    });
  });

  it('should return average of 0 if no ratings exist', function (done) {
    brew.ratings.should.have.length(0);
    brew.average_rating.should.equal(0);
    done();
  });

  it('should return the correct average rating', function (done) {
    brew.ratings.push({rating: 4}, {rating: 6});
    brew.average_rating.should.equal(5);
    done();
  });

  it('should fail when saving without a time', function (done) {
    brew.time = null;
    brew.save(function (err) {
      should.exist(err);
      done();
    });
  });
});
