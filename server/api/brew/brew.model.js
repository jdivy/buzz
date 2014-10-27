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
    ratings: { type: [{
        user_id: Schema.Types.ObjectId,
        rating: Number
    }], default: []}
});

BrewSchema
    .virtual('average_rating')
    .get(function(){
        var avg;
        if (this.ratings){
            var sum = this.ratings.reduce(function(a, b){
                return a.rating + b.rating;
            });
            avg = sum / this.ratings.length;
        }
        return avg;
    });

module.exports = mongoose.model('Brew', BrewSchema);