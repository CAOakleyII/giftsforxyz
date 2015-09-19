Meteor.methods({
  isAdmin:function(){
    return Roles.userIsInRole(Meteor.user(), 'admin');
  }
});
