if(Meteor.isClient){
    Meteor.subscribe('gifts');
}

Router.configure({
    layoutTemplate: 'layout'
});


Router.route('/', function() {
    var gifts = Gifts.find({});
    this.render('gifts', {data: {gifts: gifts}});
},{name: 'home'});

Router.route('gifts/create', function(){
    this.render('create');
},{name: 'create'});

Router.route('gifts/popular', function(){
    var gifts = Gifts.find({});
    this.render('gifts', {data: {gifts: gifts} });
},{name: 'popular'})

Router.route('gifts/for/:tag', function() {
    var gifts = Gifts.find({ tags: this.params.tag.toLowerCase() });
    this.render('gifts', {data: {gifts: gifts} });
});

Router.route('gifts/:_id', function() {
    var gift = Gifts.findOne({ _id : this.params._id});
    this.render('gift', {data : gift });
});

Router.route('user/:username/wishlist', function(){
  console.log(this.params.username);
  var user = Users.findOne({username: this.params.username});
  console.log(user);

  var wishlist_gifts = Gifts.find({_id: {$in: user.wishlist}}).toArray();
  this.render('wishlist', {data: {gifts: wishlist_gifts}});

}, {name: 'wishlist'});
