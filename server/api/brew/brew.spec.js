'use strict';

var should = require('should');
var moment = require('moment');
var app = require('../../app');
var request = require('supertest');
var Brew = require('./brew.model');

describe('GET /api/brews', function () {

    it('should respond with JSON array', function (done) {
        request(app)
            .get('/api/brews')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });
});

describe('POST /api/brews', function () {
    it('should respond with saved brew', function (done) {
        var d = new Date();
        request(app)
            .post('/api/brews')
            .send({
                time: d,
                bean: {
                    roastery: "Tonx",
                    roast: "light",
                    name: "Costa Rica"
                },
                water: {
                    temperature: 200,
                    degrees: "F"
                },
                grind: {
                    size: "30K",
                    grinder: "Baratza Preciso"
                }
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                // check a few things, notably the default empty ratings array
                res.body.should.be.instanceof(Object);
                res.body.time.should.be.equal(d.toISOString());
                res.body.water.temperature.should.be.equal(200);
                res.body.ratings.should.be.instanceof(Array);
                done();
            });
    });
});

describe('GET /api/brews/next', function () {

  var next;
  var nextBrew;

  before(function (done) {
    // Clear brews before testing, then load new ones
    var old = moment().subtract(1, 'h');
    next = moment().add(1, 'h');
    var brew = {
      time: old.toDate(),
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
    };
    Brew.remove().exec().then(function () {
      var oldBrew = new Brew(brew);
      nextBrew = new Brew(brew);
      nextBrew.time = next.toDate();
      nextBrew.bean.roastery = "Blue Bottle";
      Brew.create(oldBrew, nextBrew, function (err) {
        done();
      });
    });
  });

  after(function (done) {
    Brew.remove().exec().then(function () {
      done();
    });
  });

  it('should return the next brew only', function (done) {
    request(app)
      .get('/api/brews/next')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if(err){return done(err);}
        res.body.bean.roastery.should.be.equal("Blue Bottle");
        should(next.isSame(res.body.time));
        done();
      });
  });
});
