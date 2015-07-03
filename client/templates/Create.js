var GiftInfo = {};


Template.create.events({
    'blur #directLink' : function() {
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
    },
    'blur #imageURL' : function(){
        var url = $('#imageURL').val();
        var imgTag = '<img id="imgPreview" src="' + url + '" class="scalable-image" />';
        $('#divImgPreview').html(imgTag);
    },
    'submit #gift-create' : function(event){
        
        var gift = new Gift();
        gift.directLink = event.target.directLink.value;
        gift.name = event.target.name.value;
        gift.price = event.target.price.value;
        gift.imageUrl = event.target.imageURL.value;
        gift.description =  event.target.description.value;
        gift.tags = [];

        Meteor.call('createGift',
            { gift: gift},
            function(error, result){
                console.log(result);
                Router.go('gifts/' + result);
        });
        return false;
    }
});


function parseDirectLinkResponse(data) {

    pageHTML = data;
    GiftInfo.directLink = $('#directLink').val();
    GiftInfo.productName = "";
    GiftInfo.price = "";
    GiftInfo.img = "";
    GiftInfo.description = "";
    GiftInfo.vendorsProductId = "";
    GiftInfo.images = [];

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

    // seperated this to it's own if
    // because there's a chance their website tags change
    // and we need to still grab info, if we can't find any the specified way.
    if (GiftInfo.img.trim() == "") {
        console.log("second attempt");
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
                        image.productName = "";
                    }
                    GiftInfo.images.push(image);

                    index++;
                }
            }
        }

        if (GiftInfo.images.length >= 1) {
            var image = GiftInfo.images[0];

            // grab the first one with a product name if possible.
            // helps better the chances of guessing the right item on the first try.
            for (var i = 0; i < GiftInfo.images.length; i++)
            {
                if (GiftInfo.images[i].productName != "")
                {
                    image = GiftInfo.images[i];
                    break;
                }
            }

            GiftInfo.img = image.src;
            GiftInfo.productName = image.productName
            // add index of image
            $('#ImageURL').data('index', image.index)

            // register click event
            $('#leftArrow').on('click', leftClick);
            $('#rightArrow').on('click', rightClick);

            if (GiftInfo.images.length > 1) {
                // show arrows
                $('#leftArrow').removeClass('hide');
                $('#rightArrow').removeClass('hide');
            }
        }
    }
    loadGiftData();
    $('#fetchingData').modal('toggle')
}

function loadGiftData() {
    $('#name').val(GiftInfo.productName.replace(/\s+/g, ' ').trim());
    $('#price').val(GiftInfo.price.replace(/\s+/g, '').trim().replace("$", ""));
    $('#imageURL').val(GiftInfo.img.trim());
    $('#description').val(GiftInfo.description.trim());
    $('#imageURL').trigger('blur');
}

function leftClick() {

    var index = $('#ImageURL').data('index');

    if (index == 0) {
        index = GiftInfo.images.length - 1;
    }
    else {
        index--;
    }

    var image = GiftInfo.images[index];

    GiftInfo.productName = image.alt;
    GiftInfo.img = image.src;
    $('#ImageURL').data('index', image.index);

    loadGiftData();

}
function rightClick() {

    var index = $('#ImageURL').data('index');

    if (index == (GiftInfo.images.length - 1)) {
        index = 0;
    }
    else {
        index++;
    }

    var image = GiftInfo.images[index];

    GiftInfo.productName = image.alt;
    GiftInfo.img = image.src;
    $('#ImageURL').data('index', image.index);

    loadGiftData();

}