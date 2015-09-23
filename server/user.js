Meteor.methods({
  isAdmin:function(){
    return Roles.userIsInRole(Meteor.user(), 'admin');
  }
});


Accounts.onCreateUser(function(options, user){
  console.log('on create')
  console.log(user);
  user.wishlist = new Array();

  return user;
});
