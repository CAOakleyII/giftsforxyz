Users = Meteor.users;
// Initialize a seed activity
Meteor.startup(function() {
    if (Meteor.isServer) {

      // Seed Andrew and Make Andrew an Admin
      var userAndrew = Users.findOne({"emails.address":{"$in": ["aralcutt@gmail.com"]}});
      if (userAndrew == null) {
        var options = {
          username: 'andrew',
          password: 'MqHkPaOFlOc4',
          email: 'aralcutt@gmail.com'
        };

        var userId = Accounts.createUser(options);
        console.log("seeded andrew");
        userAndrew = Users.findOne({ _id : userId});
        console.log(userAndrew);
      }

      if (!Roles.userIsInRole(userAndrew, ['admin'])){
        Roles.addUsersToRoles(userAndrew, ['admin']);
        console.log("made andrew admin");
      }

      // Seed Chris and Make Chris an Admin.
      var userChris = Users.findOne({"emails.address":{"$in": ["caoakleyii@gmail.com"]}});
      if (userChris == null) {
        var options = {
          username: 'Chris',
          password: 'Fh6tk66ifddg',
          email: 'caoakleyii@gmail.com'
        };

        var userId = Accounts.createUser(options);
        console.log('seeded chris');
        userChris = Users.findOne({ _id : userId});
        console.log(userChris);
      }

      if (!Roles.userIsInRole(userChris, ['admin'])) {
        Roles.addUsersToRoles(userChris, ['admin']);
        console.log('made chris admin.');
      }
    }
});
