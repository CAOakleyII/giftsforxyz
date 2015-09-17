
Meteor.methods({
  vote: function(giftId, voteOption) {
    var gift = Gifts.findOne({ _id: giftId });

    if (isNaN(gift.downVotes))
    {
      gift.downVotes = 0;
    }
    if (isNaN(gift.upVotes))
    {
      gift.upVotes = 0;
    }

    switch(voteOption.toLowerCase()){
      case "clickupvote":
        gift.upVotes++;
        break;
      case "clickdownvote":
        gift.downVotes++;
        break;
      case "unclickupvote":
        gift.upVotes--;
        break;
      case "unclickdownvote":
        gift.downVotes--;
        break;
      case "switchupvote":
        gift.upVotes++;
        gift.downVotes--;
        break;
      case "switchdownvote":
        gift.upVotes--;
        gift.downVotes++;
        break;
    }

    Gifts.update({_id : giftId}, gift);

    return gift;
  },
  'updateGift': function(gift){
    Gifts.update({_id : gift._id}, gift);
  }
});
