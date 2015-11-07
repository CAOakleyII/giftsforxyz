/**
 * Created by Chris on 7/6/2015.
 */
Template.gift.onRendered(function(){
  var previousVote = localStorage.getItem(this.data._id + 'vote');
  var user = Meteor.user();
  
  // if there was a previous vote display that the user voted on it.
  if (previousVote)
  {
    switch(previousVote){
      case 'upVote':
        $(this.find('i#' + this.data._id +'.up-vote')).addClass('up-vote-clicked');
        break;
      case 'downVote':
        $(this.find('i#' + this.data._id +'.down-vote')).addClass('down-vote-clicked');
        break;
    }
  }
  
  if(user){
    for (var i = 0; i < user.wishlist.length; ++i){
      var giftId = wishlist[i];
      if (giftId == this.data._id) {
        $(this.find('span.addWishlist')).addClass('in-wishlist');
        break;
      }
    }
  }
  

});

 /**
 * Gift Events
 */
 Template.gift.events({
   'click .up-vote' : function(event) {
      var giftId = $(event.target).attr('id');
      vote($(event.target), giftId, 'upVote');
   },
   'click .down-vote' : function(event) {
     var giftId = $(event.target).attr('id');
     vote($(event.target), giftId, 'downVote');
   },
   'click .card-content .card-link': function(event){
      //ga('send', 'event', 'gift', 'follow gift');
   },
   'click .add-wishlist': function(event){
      var user = Meteor.user();
      if(!user){
        return;
      }
      var giftDiv = $(event.target).closest('.card.gift-card');
      var giftId = giftDiv.attr('gift-id');
      if(giftId == null){
        return;
      }
      $(event.target).toggle('in-wishlist');
      Meteor.call('addGiftToWishlist', giftId);
   }
 });

 Template.gift.helpers({
 });

 /*
 * Handles a vote made by a user.
 */
 function vote(targetElement, giftId, voteOption) {

   // get the previos vote
   var previousVote = localStorage.getItem(giftId + 'vote');

   // set the vote in the local storage.
   localStorage.setItem(giftId + 'vote', voteOption);

   // handle an upvote
   if(voteOption === "upVote") {
     // since it was clicked, toggling this will make sense for all cases.
     // and down vote click should also never be on
     $(targetElement).toggleClass('up-vote-clicked');
     $('i#' + giftId +'.down-vote').removeClass('down-vote-clicked');

     if(previousVote) {
       // there's a previous vote, handle the previous vote switch approriately.
       switch(previousVote) {
         case "upVote":
           Meteor.call('vote', giftId, 'unclickUpVote');
           localStorage.removeItem(giftId + 'vote');
           break;
          case "downVote":
            Meteor.call('vote', giftId, 'switchUpVote');
            break;
       }
     } else {
       // there's no previous vote, just go ahead and add one to upvote.
       Meteor.call('vote', giftId, 'clickUpVote');
     }
   }

   // handle a down vote
   if(voteOption === "downVote") {
     // since it was clicked, toggling this will make sense for all cases.
     // and down vote click should also never be on
     $(targetElement).toggleClass('down-vote-clicked');
     $('i#' + giftId +'.up-vote').removeClass('up-vote-clicked');

     if (previousVote) {
       // there's a previous vote, handle the previous vote switch approriately.
       switch(previousVote) {
         case "upVote":
           Meteor.call('vote', giftId, 'switchDownVote');
           break;
          case "downVote":
            Meteor.call('vote', giftId, 'unclickDownVote');
            localStorage.removeItem(giftId + 'vote');
            break;
       }
     } else {
       // there's no previous vote, just go ahead and add one to down vote;
       Meteor.call('vote', giftId, 'clickDownVote');
     }
   }

   // end function vote
   return;
 }


 /**
 * Gift Helpers
 */
Template.gift.helpers({
    priceFormated: function(){
        return "$" + (parseFloat(this.price).toFixed(2)).toLocaleString();
    }
});
