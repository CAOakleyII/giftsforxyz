Meteor.methods({
  isAdmin:function(){
    return Roles.userIsInRole(Meteor.user(), 'admin');
  },
  addGiftToWishlist:function(giftId){
  	if(!giftId){
  		return;
  	}

	var user = Meteor.user();
  	
  	if(!user){
  		return;
  	}

  	var alreadyFave = false;
  	for(var i = 0; i < user.wishlist.length; i++){
  		if(giftId == user.wishlist[i]){
  			alreadyFave = true;
  			break;
  		}
  	}

  	if(alreadyFave){
  		return;
  	}

  	user.wishlist.push(giftId);
  	Users.update({_id: user._id}, user);
  	return true;
  }
});


Accounts.onCreateUser(function(options, user){
  user.wishlist = new Array();
  return user;
});
