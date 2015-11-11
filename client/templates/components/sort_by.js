Template.sortBy.helpers({

  tags: function(){
    var gifts = Gifts.find({});
    var tagsCount = [];
    var popularTags = [];
    gifts.forEach(function(gift){


      for(var x = 0; x < gift.tags.length; ++x) {
        var currentTag = gift.tags[x];

        if(typeof tagsCount[currentTag] !== 'number'){
          tagsCount[currentTag] = 1;
        } else {
          tagsCount[currentTag] += 1;
        }


        var currentTagsCount = tagsCount[currentTag];
        var currentTagAsObject = { name : currentTag };

        if (popularTags.length < 3 && popularTags.indexOf(currentTagAsObject) < 0){
          popularTags.push(currentTagAsObject);
        } else {
          var y = 0;

          // insertion sort
          // if current tag already exist in popular tag.
          // get that one, and see if it can be moved up anymore.
          if (popularTags.indexOf(currentTagAsObject) < 0) {
            y = popularTags.indexOf(currentTagAsObject);
          }
          for(y; y < popularTags.length; ++y){
            var popularTag = popularTags[y];
            // if current tag is greater than that tag
            if(currentTagsCount > tagsCount[popularTag]) {
              var z = y;
              while(z > 0) {
                // shift each tag back one.
                var tag = popularTags[z];
                popularTags[z - 1] = tag;
                z--;
              }
              popularTags[y] = currentTag;
            }
          }
        }
      }
    });
    console.log(popularTags);
    return popularTags;
  }
});
