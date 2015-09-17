Template.gifts.helpers({
  isAdmin: function() {
    // assigning the result makes this call synchronous
    return ReactiveMethod.call('isAdmin');

  }
});
