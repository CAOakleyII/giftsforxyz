
Meteor.methods({
  createGift: function(gift){
    return Gifts.insert(gift);
  }
});