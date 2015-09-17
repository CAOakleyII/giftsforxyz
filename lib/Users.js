Users = Meteor.users;
// Initialize a seed activity
Meteor.startup(function() {
    if (Meteor.isServer) {
      if (Users.find({"emails.address":{"$in": ["aralcutt@gmail.com"]}}).count() === 0) {
        var options = {
          username: 'andrew',
          password: 'MqHkPaOFlOc4',
          email: 'aralcutt@gmail.com'
        };
        var userId = Accounts.createUser(options);
        console.log("seeded andrew");

        var user = Users.findOne({ _id : userId});
        console.log(user);
        Roles.addUsersToRoles(user, ['admin']);
        console.log(user);
      }

      if (Users.find({"emails.address":{"$in": ["caoakleyii@gmail.com"]}}).count() === 0) {
        var options = {
          username: 'Chris',
          password: 'Fh6tk66ifddg',
          email: 'caoakleyii@gmail.com'
        };
        var userId = Accounts.createUser(options);
        console.log("seeded chris");

        var user = Users.findOne({ _id : userId});
        console.log(user);
        Roles.addUsersToRoles(user, ['admin']);
      }
    }
});
