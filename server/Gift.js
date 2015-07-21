
Meteor.methods({
  upVote: function(giftId){
    
    var gift =  Gifts.find({ _id : giftId });
    
    console.log("before any call: " + gift.upVotes);
    if (isNaN(gift.upVotes))
    {
      gift.upVotes = 1;
    } else {
      console.log("incriment");
      console.log("value before incriment:" + gift.upVotes);
     gift.upVotes++; 
    }
    
    console.log(gift.upVotes);
    
    return Gifts.update({_id : giftId}, { $set : { upVotes : gift.upVotes } });
  }
});