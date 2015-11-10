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


         if(popularTags.length < 3 && popularTags[currentTag] === undefined){
           popularTags.push(currentTag);
         } else {
           for(var y = 0; y < popularTags.length; ++y){
             var popularTag = popularTags[y];
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
     tagsCount.sort();

     var popularityLimit = 3;
     var popIndex = 1;
     while(popIndex <= popularityLimit){
       popularTags.push(tagsCount.pop());
       popIndex++;
     }
     return ["Tags"];
   }
});
