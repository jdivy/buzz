'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BrewSchema = new Schema({
    time: Date,
    bean: {
        roastery: String,
        roast: String,
        name: String
    },
    water: {
        temperature: Number,
        degrees: String
    },
    grind: {
        size: String,
        grinder: String
    },
    ratings: [{
        user_id: ObjectId,
        rating: Number
    }],
    average_rating: Number
});

module.exports = mongoose.model('Brew', BrewSchema)