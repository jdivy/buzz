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
        if (this.ratings.length){
            var sum = this.ratings.reduce(function(a, b){
                return a.rating + b.rating;
            });
            return sum / this.ratings.length;
        }
        return 0;
    });

module.exports = mongoose.model('Brew', BrewSchema);
