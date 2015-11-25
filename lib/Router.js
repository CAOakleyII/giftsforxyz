if(Meteor.isClient){
    Meteor.subscribe('gifts');
}

Router.configure({
    layoutTemplate: 'layout'
});


Router.route('/', function() {
    var gifts = Gifts.find({});
    this.render('gifts', {data: {gifts: gifts}});
    //this.render('home');
},{name: 'home'});

Router.route('gifts/create', function(){
    this.render('create');
},{name: 'create'});

Router.route('gifts/all', function() {
  var gifts = Gifts.find({});
  this.render('gifts', {data: {gifts: gifts} });
}, {name: 'all'});

Router.route('gifts/popular', function(){
    var gifts = Gifts.find({});
    this.render('gifts', {data: {gifts: gifts} });
},{name: 'popular'});

Router.route('gifts/for/:tag', function() {
    var gifts = Gifts.find({ tags: this.params.tag.toLowerCase() });
    this.render('gifts', {data: {gifts: gifts} });
});

Router.route('gifts/:_id', function() {
    var gift = Gifts.findOne({ _id : this.params._id});
    this.render('gift', {data : gift });
});

Router.route('user/:_id/wishlist', function(){
  var user = Users.findOne({_id: this.params._id});

  var wishlist_gifts = Gifts.find({_id: {$in: user.wishlist}}).fetch();
  this.render('wishlist', {data: {gifts: wishlist_gifts}});

}, {name: 'wishlist'});
