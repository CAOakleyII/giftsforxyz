Meteor.publish('gifts', function(){
    return Gifts.find();
})