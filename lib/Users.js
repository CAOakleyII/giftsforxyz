dbUsers = new Mongo.Collection("users");
// Initialize a seed activity
Meteor.startup(function() {
    if (Meteor.isServer) {
      if(dbUsers.find({"emails.address":{"$in": ["aralcutt@gmail.com"]}}).count() === 0){
        var options = {
          username: 'andrew',
          password: 'MqHkPaOFlOc4',
          email: 'aralcutt@gmail.com'
        };
        Accounts.createUser(options);

        var user = dbUsers.find({"emails.address":{"$in": ["aralcutt@gmail.com"]}});
        console.log(user);
        Roles.addUsersToRoles(user, ['admin']);
        console.log(user);
      }
    }
});
