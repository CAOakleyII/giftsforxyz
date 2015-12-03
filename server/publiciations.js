Meteor.publish('gifts', function(){
  var self = this;
  var gifts = [];

  try {
    console.log('api call');
    var response = HTTP.get('http://159.203.74.143:2456/items');

    if (response.statusCode  !== 200) {
      // Error retrieving gifts from API.
      console.log("API responded with a status code of " + response.statusCode  +
      " when attempting to retrieve gifts.");
    } else {
      gifts = response.data;
    }

    _.each(gifts, function(gift) {
      self.added('gifts', gift._id, gift);
    });

  } catch (error) {
    console.log(error);
  }

  self.ready();
});

Meteor.publish('users', function(){
  return Meteor.user();
});
