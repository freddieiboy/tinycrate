var client = require('twilio')('AC57b3e4757050faf347be594c087072ac', '99c1785f890738c5a9dae9c1d7026818');

//Send an SMS text message
export const sendSMS = (phone) => {
  client.sendMessage({

      to:'+1' + phone, // Any number Twilio can deliver to
      from: '+16505631356', // A number you bought from Twilio and can use for outbound communication
      body: 'www.tinycratehq.com' // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (err) { // "err" is an error received during the request, if any
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
      }
  });

  // client.messages("MM800f449d0399ed014aae2bcc0cc2f2ec").get(function(err, message) {
  //     console.log(message.body);
  // });
}
