
Template.navBar.events({
    'submit .nav-search': function (event, template) {

        Router.go('/Gifts/For/' + event.target.searchedTag.value);
        return false;
    }
});
