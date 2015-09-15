Template.subNavBar.onRendered(function(){
  var routeName = Router.current().route.getName();
  $('.' + routeName).addClass('selected')

  $('.page-navbar a.brand').click(function(){
    $('.selected').removeClass('selected');
    $('.home').addClass('selected');
  });

  $('.add-gift').click(function(){
    $('.selected').removeClass('selected');
  });

  $('.page-sub-navbar a').click(function(){
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
  });
});
