
Meteor.methods({
  createGift: function(gift, captchaData){
    var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);

    if (!verifyCaptchaResponse.success) {
        console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
        throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
    } else {
        console.log('reCAPTCHA verification passed!');
    }

    return Gifts.insert(gift);
  }
});
