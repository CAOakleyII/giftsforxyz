var GiftInfo = {};
// for some reason when parsing data for the first time, checking the height and width somtimes returns undefined
// but it always corrects itself the second time, very weird, but spent too much time trying to find out why.
// will just force a retry if the array returned is empty, after that second attempt just let it go through with out.
var ForcedRetry = false;

Template.create.events({
    'click #retryFetch' : function(event){
        event.preventDefault();
        $('.modal-backdrop').fadeOut();
        fetchDataFromUrl();
    },
    'blur #directLink' : function(event) {
        event.preventDefault();
       fetchDataFromUrl();
    },
    'click .btnFetchData' : function(event) {
        event.preventDefault();
        fetchDataFromUrl();
    },
    'blur .extra-data input' : function()
    {
        loadDisplayData();
    },
    'mouseenter .btnFetchData' : function(event) {
        $(event.target).addClass('fa-spin');
    },
    'mouseleave .btnFetchData' : function() {
        $(event.target).removeClass('fa-spin');
    },
    'keyup .extra-data #price' : function(){
        loadDisplayData();
    },
    'keyup .extra-data textarea' : function(){
        loadDisplayData();
    },
    'submit #gift-create' : function(event){
        event.preventDefault();

        if ($('#gift-create .has-error').length) {
          return false;
        }

        var gift = new Gift();
        gift.directLink = event.target.directLink.value;
        gift.name = event.target.name.value;
        gift.price = event.target.price.value;
        gift.imageUrl = event.target.imageURL.value;
        gift.description =  event.target.description.value;
        gift.tags = [];
        event.target.nonParsedTags.value.trim().split("#").forEach(function(element, index, array){
            if(element.trim() !== "") {
                gift.tags.push(element.trim().toLowerCase());
            }
        });

         var captchaData = grecaptcha.getResponse();

        Meteor.call('createGift',
            gift,
            captchaData,
            function(error, result){
              if(error){
                console.log(error.reason);
                return;
              }
              // reset the captcha
              grecaptcha.reset();
              Router.go('/gifts/' + result);
        });
        return false;
    }
});

function fetchDataFromUrl(){
    $('#leftArrow').addClass('hide');
    $('#rightArrow').addClass('hide');

    var linkURL = $('#directLink').val();
    if (linkURL.trim() == "")
    {
        return;
    }

    $('#fetchingData').modal('toggle')

    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            //options.url = "http://cors.corsproxy.io/url=" + options.url;
        }
    });

    $.get(linkURL, parseDirectLinkResponse);
}
function parseDirectLinkResponse(data) {

    pageHTML = data;
    GiftInfo.directLink = $('#directLink').val();
    GiftInfo.productName = "";
    GiftInfo.price = "";
    GiftInfo.img = "";
    GiftInfo.description = "";
    GiftInfo.vendorsProductId = "";
    GiftInfo.images = [];

    // customized data mining
    if (GiftInfo.directLink.indexOf("amazon.com") > -1) {

        GiftInfo.productName = $(pageHTML).find('span#productTitle').length == 1 ? $(pageHTML).find('span#productTitle').text() : "";
        GiftInfo.price = $(pageHTML).find('span#priceblock_ourprice').length == 1 ? $(pageHTML).find('span#priceblock_ourprice').text() : $(pageHTML).find('#regularprice_savings').length == 1 ? $(pageHTML).find('#regularprice_savings').text() : "";
        GiftInfo.price = GiftInfo.price.trim();
        GiftInfo.img = $(pageHTML).find('#imgTagWrapperId img').length == 1 ? $(pageHTML).find('#imgTagWrapperId img').attr('data-old-hires') : "";
        GiftInfo.description = $(pageHTML).find('#productDescription').length == 1 ? $(pageHTML).find('#productDescription').text().trim() : "";
        GiftInfo.vendorsProductId = $(pageHTML).find('#ASIN').val();
    }
    else if (GiftInfo.directLink.indexOf("fancy.com") > -1) {
        GiftInfo.productName = $(pageHTML).find('.figure-item figcaption .title').first().text();
        GiftInfo.price = $(pageHTML).find('#itemprice').text();
        GiftInfo.img = $(pageHTML).find('.figure-item .figure img').prop('src');
    }
    else if (GiftInfo.directLink.indexOf("uncommongoods.com") > -1) {
        GiftInfo.productName = $(pageHTML).find('.itemTitle').text();
        GiftInfo.price = $(pageHTML).find('#itemPrice').text();
        GiftInfo.img = $(pageHTML).find(".mainImage").prop('src');
    }

    // generic based on meta tags
    // Dig for Title
    var metaTitle = findFirst($(pageHTML), '[property="og:title"]');
    var itemPropName = findFirst($(pageHTML), '[itemprop=name]');
    if(metaTitle.length)
    {
      GiftInfo.productName = metaTitle.attr('content');
    } else if (itemPropName.length)
    {
      GiftInfo.productName = itemPropName.text() ? itemPropName.text() : itemPropName.attr('content');
    } else {
      GiftInfo.productName = $(pageHTML).find('title').text();
    }

    // Dig for Image
    var metaImage = findFirst($(pageHTML), '[property="og:image"]');
    var itemPropImage = findFirst($(pageHTML), '[itemprop=image]');
    if (metaImage.length)
    {
      GiftInfo.img = metaImage.attr('content');
    } else if (itemPropImage.length) {
      GiftInfo.img = itemPropImage.attr('content');
    }
    var initialImage = GiftInfo.img;

    // Dig for URL
    var metaUrl = findFirst($(pageHTML), '[property="og:url"]');
    var itemPropUrl = findFirst($(pageHTML), '[itemprop=url]');
    if(metaUrl.length)
    {
      GiftInfo.directLink = metaUrl.attr('content')
    } else if (itemPropUrl.length) {
      GiftInfo.directLink = itemPropUrl.attr('href') ? itemPropUrl.attr('href') : itemPropUrl.attr('content');
    }

    // Dig for Description
    var metaDescription = findFirst($(pageHTML), '[property="og:description"]');
    var itemPropDescription = findFirst($(pageHTML), '[itemprop=description]');
    if(metaDescription.length)
    {
      GiftInfo.description = metaDescription.attr('content')
    } else if (itemPropDescription.length) {
      GiftInfo.description = itemPropDescription.text() ? itemPropDescription.text() : itemPropDescription.attr('content');
    }

    // Dig for Price
    var metaPrice = findFirst($(pageHTML), '[property="og:price"]');
    var itemPropPrice = findFirst($(pageHTML), '[itemprop=price]');
    if(metaPrice.length)
    {
      GiftInfo.price = metaPrice.attr('content')
    } else if (itemPropPrice.length) {
      GiftInfo.price = itemPropPrice.text() ? itemPropPrice.text() : itemPropPrice.attr('content');
    }

    // seperated this to it's own if
    // because there's a chance their website tags change
    // and we need to still grab info, if we can't find any the specified way.
    if (true) {

        var docImages = $(pageHTML).find('img');
        var index = 0;
        for (var i = 0; i < docImages.length; i++) {
            var image = docImages[i];
            if (image.width > 130 && image.height > 130) {

                if (GiftInfo.images.indexOf(image) == -1) {

                    image.index = index;
                    if (image.alt != "") {
                        image.productName = image.alt;
                    }
                    else if (image.title != "") {
                        image.productName = image.title;
                    }
                    else {
                        image.productName = GiftInfo.productName;
                    }
                    GiftInfo.images.push(image);

                    index++;
                }
            }
        }

        if (GiftInfo.images.length >= 1) {
            var image = GiftInfo.images[0];

            // if we were able to grab a reliable image use that
            if(initialImage != "")
            {
              image.src = initialImage;
              image.productName = GiftInfo.productName;
            } else {
              // else grab the first one with a product name if possible.
              // helps better the chances of guessing the right item on the first try.
              for (var i = 0; i < GiftInfo.images.length; i++)
              {
                  if (GiftInfo.images[i].productName != "")
                  {
                      image = GiftInfo.images[i];
                      break;
                  }
              }
            }

            GiftInfo.img = image.src;
            GiftInfo.productName = image.productName;
            // add index of image
            $('#imageURL').data('index', image.index);

            // register click event
            $('#leftArrow').on('click', leftClick);
            $('#rightArrow').on('click', rightClick);

            if (GiftInfo.images.length > 1) {
                // show arrows
                $('#leftArrow').removeClass('hide');
                $('#rightArrow').removeClass('hide');
            }
        }

        // No image, and we haven't retried yet
        if(!GiftInfo.images.length && !ForcedRetry)
        {
          ForcedRetry = true;
          fetchDataFromUrl();
        } else if(!GiftInfo.images.length && ForcedRetry) {
          // still no image and we retried
          ForcedRetry = false;

          // no data at all :(
          if (!GiftInfo.name  && !GiftInfo.price  && !GiftInfo.img  && !GiftInfo.description) {
              $('#errorFetching').modal('toggle');
          }

        } else {
          // this is a retry attempt, reset it to false for later.
          ForcedRetry = false;
        }

    }
    loadGiftData();
    loadDisplayData();
    $('.modal-backdrop').fadeOut();
    $('#fetchingData').modal('toggle');
}

function loadGiftData() {
    $('#name').val(GiftInfo.productName.replace(/\s+/g, ' ').trim());
    $('#price').val(GiftInfo.price.replace(/\s+/g, '').trim().replace("$", ""));
    $('#imageURL').val(GiftInfo.img.trim());
    $('#description').val(GiftInfo.description.trim());
    $('.extra-data').fadeIn();
}

function loadDisplayData() {

    $('#nameDisplay').text($('#name').val().trim());
    $('#priceDisplay').text($('#price').val().replace(/\s+/g, '').trim().replace("$", ""));
    $('#imageDisplay').attr('src', $('#imageURL').val().trim());
    $('#descriptionDisplay').text( $('#description').val().trim());

    $('.preview-data').fadeIn();
}

function leftClick() {

    var index = $('#imageURL').data('index');

    if (index == 0) {
        index = GiftInfo.images.length - 1;
    }
    else {
        index--;
    }

    var image = GiftInfo.images[index];

    GiftInfo.productName = image.productName;
    GiftInfo.img = image.src;
    $('#imageURL').data('index', image.index);

    loadGiftData();
    loadDisplayData();

}
function rightClick() {

    var index = $('#imageURL').data('index');

    if (index == (GiftInfo.images.length - 1)) {
        index = 0;
    }
    else {
        index++;
    }

    var image = GiftInfo.images[index];

    GiftInfo.productName = image.productName;
    GiftInfo.img = image.src;
    $('#imageURL').data('index', image.index);

    loadGiftData();
    loadDisplayData();
}

// find selector is not reliable.
function findFirst(elementArray, selector) {
  var returnElement = [];
  returnElement = $(elementArray).find(selector);

  if(returnElement.length)
  {
    return $(returnElement);
  }

  elementArray.each(function(index, element) {
      if ($(element).is(selector)) {
        returnElement = element;
        return;
      }
    });

  return $(returnElement);
}
