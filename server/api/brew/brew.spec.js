'use strict';

var _ = require('lodash');
var should = require('should');
var moment = require('moment');
var config = require('../../config/environment');
var app = require('../../app');
var request = require('supertest');
var Brew = require('./brew.model');
var User = require('../user/user.model');

var testBrew = {
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
};
var token;

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

describe('GET /api/brews/next', function () {

  var next;
  var nextBrew;

  before(function (done) {
    // Clear brews before testing, then load new ones
    var old = moment().subtract(1, 'h');
    next = moment().add(1, 'h');
    var b = _.cloneDeep(testBrew);
    Brew.remove().exec().then(function () {
      var oldBrew = new Brew(b);
      oldBrew.time = old.toDate();
      nextBrew = new Brew(b);
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
        if (err) {
          return done(err);
        }
        res.body.bean.roastery.should.be.equal("Blue Bottle");
        should(next.isSame(res.body.time));
        done();
      });
  });
});

describe('PUT /api/brews/:id', function () {

});

describe('PUT /api/brews/:id/rate', function () {
  var brewId;
  before(function(done){
    Brew.remove().exec().then(function () {
      Brew.create(testBrew, function (err, brew) {
        if(err){ return done(err);}
        brewId = brew._id;
        return done();
      });
    });
  });

  it('should return rated brew', function (done) {
    request(app)
      .put('/api/brews/' + brewId + '/rate')
      .send({ratings: [{rating: 5}]})
      .expect(200)
      .end(function (err, res) {
        if(err) {return done(err);}
        res.body.ratings.should.be.instanceof(Array);
        res.body.ratings.should.have.length(1);
        return done();
      });
  });

  it('should ignore other field updates', function (done) {
    request(app)
      .put('/api/brews/' + brewId + '/rate')
      .send({bean: {roastery: "Other"}, ratings: [{rating: 10}]})
      .expect(200)
      .end(function(err, res){
        if(err) { return done(err);}
        res.body.bean.roastery.should.equal("Tonx");
        res.body.ratings.should.have.length(2);
        return done();
      });
  });
});

describe('Restricted endpoints', function () {
  var admin = {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  };
  var user = {
    provider: 'local',
    name: 'User',
    email: 'user@user.com',
    password: 'user'
  };
  var brewId;
  var adminToken;
  var userToken;

  before(function (done) {
    Brew.remove().exec().then(function () {
      Brew.create(testBrew, function (err, brew) {
        if(err) { return done(err);}
        brewId = brew._id;
        return done();
      });
    });
  });

  before(function (done) {
    User.remove().exec().then(function () {
      User.create(admin, user, function (err) {
        if(err) { return done(err);}
        return done();
      });
    });
  });

  before(function (done) {
    login(admin)(function (err, token) {
      if(err){return done(err);}
      adminToken = 'Bearer ' + token;
      return done();
    });
  });

  before(function (done) {
    login(user)(function (err, token) {
      if (err) {return done(err);}
      userToken = 'Bearer ' + token;
      return done();
    });
  });

  describe('with anonymous access', function(){
    describe('POST /api/brews', function () {
      it('should refuse action', function (done) {
        request(app)
          .post('/api/brews')
          .expect(401)
          .end(function (err, res) {
            if (err) {return done(err);}
            res.text.should.match(/Unauthorized/);
            done();
          });
      });
    });

    describe('DELETE /api/brews/:id', function () {
      it('should refuse action', function (done) {
      request(app)
        .delete('/api/brews/' + brewId)
        .expect(401)
        .end(function (err, res) {
          if(err){return done(err);}
          res.text.should.match(/Unauthorized/);
          done();
        });
      });
    });
  });

  describe('with unauthorized access', function () {

    describe('POST /api/brews', function () {
      it('should refuse for non-admin', function (done) {
        request(app)
          .post('/api/brews')
          .set('authorization', userToken)
          .send(testBrew)
          .expect(403)
          .end(function (err, res) {
            if(err){return done(err);}
            res.text.should.match(/Forbidden/);
            return done();
          });
      });
    });

    describe('DELETE /api/brews/:id', function () {
      it('should refuse for non-admin', function (done) {
        request(app)
          .delete('/api/brews/' + brewId)
          .set('authorization', userToken)
          .expect(403)
          .end(function (err, res) {
            if(err){return done(err);}
            res.text.should.match(/Forbidden/);
            return done();
          });
      });
    });

  });

  describe('with authorized access', function () {

    describe('POST /api/brews', function () {
      it('should respond with saved brew', function (done) {
        var d = new Date();
        request(app)
          .post('/api/brews')
          .set('authorization', adminToken)
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

    describe('DELETE /api/brews/:id', function () {
      it('should delete the brew', function (done) {
        request(app)
          .delete('/api/brews/' + brewId)
          .set('authorization', adminToken)
          .expect(204)
          .end(function (err, res) {
            if (err) {return done(err); }
            return done();
          });
      });
    });
  });

});

function login(user){
  return function(done){
    request(app)
      .post('/auth/local')
      .send(_.pick(user, ['email', 'password']))
      .expect(200)
      .end(function (err, res) {
        if(err) {return done(err);}
        return done(null, res.body.token);
      });
  }
}
