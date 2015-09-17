Template.gift_edit.helpers({
    'unparsedTags': function(){
        return "#" + this.tags.join(" #");
    }

});

Template.gift_edit.events({
  'submit .gift-edit': function(event){
    event.preventDefault();

    this.name = event.target.name.value.trim();

    var tags = [];
    event.target.unparsedTags.value.trim().split("#").forEach(function(element, index, array){
        if(element.trim() !== "") {
            tags.push(element.trim().toLowerCase());
        }
    });

    this.tags = tags;

    Meteor.call('updateGift',
        this,
        function(error, result){
          if(error){
            console.log(error.reason);
            $(event.target.save).addClass('btn-error')
          }
          else{
            $(event.target.save).addClass('btn-success')
          }

    });
  }
});
