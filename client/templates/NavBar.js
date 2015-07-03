
Template.navBar.events({
    'submit .nav-search': function (event, template) {

        Router.go('/gifts/for/' + event.target.searchedTag.value);
        return false;
    }
});
