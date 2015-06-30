/**
 * Created by Chris on 6/29/2015.
 */

Template.Home.events({
    'submit .home-search' : function(event, template){

        Router.go('/Gifts/For/' + event.target.searchedTag.value);
        return false;
    }
});

Template.Home.onRendered(function() {
   $('.nav-search').hide();
});