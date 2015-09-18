
Meteor.methods({
  createGift: function(gift, captchaData){
    var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);

    if (!verifyCaptchaResponse.success) {
        console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
        throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
    } else {
        console.log('reCAPTCHA verification passed!');
    }

    return Gifts.insert(gift);
  },
  'updateGift': function(gift){
    Gifts.update({_id : gift._id}, gift);
  },
  'deleteGift': function(gift){
    Gifts.remove({_id: gift._id});
  },
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
  }
});
