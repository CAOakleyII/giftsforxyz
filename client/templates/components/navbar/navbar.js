Template.navbar.events({
    'keyup #navSearch' : function(event) {
        // when a user hits enter search
        if (event.keyCode == 13) {
            Router.go('/gifts/for/' + event.target.value);
            return false;
        }
    }
});
