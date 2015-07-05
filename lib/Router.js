if(Meteor.isClient){
    Meteor.subscribe('gifts');
}

Router.configure({
    layoutTemplate: 'layout'
});


Router.route('/', function() {
    this.render('home');
});

Router.route('gifts/create', function(){
    this.render('create');
});

Router.route('gifts/for/:tag', function() {
    var gifts = Gifts.find({});
    this.render('gifts', {data: {gifts: gifts} });
});

Router.route('gifts/:_id', function() {
    var gift = Gifts.findOne({ _id : this.params._id});
    this.render('gift', {data : gift });
});