Template.gift_edit.helpers({
    'unparsedTags': function(){
        return "#" + this.tags.join(" #");
    }

});

Template.gift_edit.events({
  'change input[type="text"]': function(event){
    var saveBtn = $(event.target).parents('.gift-edit').find('.gift-save');
    saveBtn.removeClass('btn-danger').removeClass('btn-success').addClass('btn-primary');
  },
  'change .imageUrlText': function(event){
    $('.gift-image').attr('src', event.target.value.trim());
  },
  'click .gift-delete': function(event){
    GiftDelete(this, event);
  },
  'submit .gift-edit': function(event){
    event.preventDefault();
    GiftUpdate(this, event);
  }
});

function GiftUpdate(gift, event){
  gift.name = event.target.name.value.trim();
  gift.imageUrl = event.target.imageUrl.value.trim();
  gift.description = event.target.description.value.trim();
  gift.price = event.target.price.value.trim().replace("$","");
  var tags = [];
  event.target.unparsedTags.value.trim().split("#").forEach(function(element, index, array){
      if(element.trim() !== "") {
          tags.push(element.trim().toLowerCase());
      }
  });

  gift.tags = tags;

  Meteor.call('updateGift',
      gift,
      function(error, result){
        if(error){
          console.log(error.reason);
          $(event.target.save).removeClass('btn-primary').removeClass('btn-success').addClass('btn-danger');
        }
        else{
          $(event.target.save).removeClass('btn-primary').removeClass('btn-danger').addClass('btn-success');
        }

  });
}

function GiftDelete(gift, event){
  Meteor.call('deleteGift',
    gift,
    function(error, result){
      if(error){
        console.log(error)
      }
      else{
        console.log("success");
      }
    }
  );
}
