/**
 * Created by Chris on 6/29/2015.
 */

Template.home.events({
    'submit .home-search' : function(event, template){

        Router.go('/gifts/for/' + event.target.searchedTag.value);
        return false;
    }
});

Template.home.onRendered(function() {
   $('.nav-search').hide();
});