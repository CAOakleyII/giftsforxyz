Gifts = new Mongo.Collection("gifts");

Gift = function() {
    this.directLink = "";
    this.name = "";
    this.price = 0.00;
    this.imageUrl = "";
    this.description = "";
    this.tags = [];
    this.createdAt = new Date();
    this.downVotes = 0;
    this.upVotes = 0;
    this.hidden = false;

};

Gift.constructor = Gift;

Gift.prototype.bestPopularity = function() {
    // http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
    // http://www.redditblog.com/2009/10/reddits-new-comment-sorting-system.html
    var n = this.upVotes + this.downVotes;
    if (n == 0)
    {
        return 0;
    }

    // var stats = new StatisticFormula()
    // var z = stats.NormalDistribution(1-(1-confidence)/2);
    // alternatively we can set z = 1.96 because the confidence of 95% is a const.
    // since I don't wanna spend too much time on getting the stats formula to work for
    // a const value. also calculation speeds are a thing
    var z = 1.96;
    var phat = 1.0 * this.upVotes / n;

    return (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n);
};

Gift.prototype.popularity = function() {
    return this.upVotes - this.downVotes;
}

Gift.prototype.hotPopularity = function() {
    // http://amix.dk/blog/post/19588
    var secondsTimeSpan = (this.createdAt - (new Date(1970, 1, 1))).getSeconds() - 1134028003;
    var order = Math.log(Math.max(Math.abs(this.popularity()), 1)) / Math.LN10;

    // if popularity is gretaer than 0 = 1; less than 0 = -1; equal to 0 = 0
    var sign = (this.popularity > 0) ? 1 : (this.popularity < 0) ? -1 : 0;

    return Math.round10(order + sign * secondsTimeSpan / 45000, -7);
};


/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
    Math.round10 = function (value, exp) {
        return decimalAdjust('round', value, exp);
    };
}

// Initialize a seed activity
Meteor.startup(function() {
  if (Meteor.isServer && Gifts.find().count() === 0) {
      var gift = new Gift();
      gift.name = "FitBit",
      gift.directLink = "http://www.amazon.com/Fitbit-Flex-Accessory-Slate-Large/dp/B00IREZGI2/",
      gift.imageUrl = "http://ecx.images-amazon.com/images/I/61WbFU%2BAK6L._SL1500_.jpg",
      gift.price = "14.20",
      gift.description = "The perfect gift for someone who's staying trying to stay active.";
      gift.tags.push("fitlife");
      gift.tags.push("runner");
    Gifts.insert(gift);
  }
});