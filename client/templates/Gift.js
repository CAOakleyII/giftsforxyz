/**
 * Created by Chris on 7/6/2015.
 */
Template.gift.helpers({
    priceFormated: function(){
        return "$" + (parseFloat(this.price).toFixed(2)).toLocaleString();
    }
})