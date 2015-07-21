/**
 * Created by Chris on 7/6/2015.
 */
 Template.gift.events({
   'click .up-vote' : function(event) {
      var giftId = $(event.target).attr('id');
      console.log(giftId);
      Meteor.call('upVote', giftId, function(error, result){
        // save that the user up voted to their client storage
        // possibly change the color of the upvote arrow.
      })
   }
 })
Template.gift.helpers({
    priceFormated: function(){
        return "$" + (parseFloat(this.price).toFixed(2)).toLocaleString();
    }
})