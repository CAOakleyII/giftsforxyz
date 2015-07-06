Template.navbar.events({
    'keyup #navSearch' : function(event) {
        console.log('test');
        if (event.keyCode == 13){
            Router.go('/gifts/for/' + event.target.value);
            return false;
        }
    }
});