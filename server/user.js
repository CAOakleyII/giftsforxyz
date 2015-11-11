Meteor.methods({
  isAdmin:function(){
    return Roles.userIsInRole(Meteor.user(), 'admin');
  },
  toggleGiftInWishlist : function(giftId) {
    if(!giftId) {
      return;
    }

    var user = Meteor.user();
    if(!user){
      return;
    }

    for(var i = 0; i < user.wishlist.length; ++i) {
      if (giftId == user.wishlist[i]) {
        user.wishlist.splice(i, 1);
        Users.update({_id: user._id}, user);
        return;
      }
    }

    user.wishlist.push(giftId);
    Users.update({_id: user._id}, user);
    return;
  }
});


Accounts.onCreateUser(function(options, user){
  user.wishlist = new Array();
  return user;
});
