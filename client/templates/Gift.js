/**
 * Created by Chris on 7/6/2015.
 */
Template.gift.onRendered(function(){
  var previousVote = localStorage.getItem(this.data._id + 'vote');

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
   }
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
