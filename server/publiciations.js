Meteor.publish('gifts', function(){
    return Gifts.find();
});

Meteor.publish('users', function(){
  return Meteor.user();
});
