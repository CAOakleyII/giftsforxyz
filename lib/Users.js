Users = Meteor.users;
// Initialize a seed activity
Meteor.startup(function() {
    if (Meteor.isServer) {
      if(Users.find({"emails.address":{"$in": ["aralcutt@gmail.com"]}}).count() === 0){
        var options = {
          username: 'andrew',
          password: 'MqHkPaOFlOc4',
          email: 'aralcutt@gmail.com'
        };
        var userId = Accounts.createUser(options);
        console.log(userId);

        var user = Users.findOne({ _id : userId});
        console.log(user);
        Roles.addUsersToRoles(user, ['admin']);
        console.log(user);
      }
    }
});
