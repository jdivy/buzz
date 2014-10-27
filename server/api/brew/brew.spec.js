'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

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