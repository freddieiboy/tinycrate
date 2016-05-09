import Router from 'koa-router'
import uploadApi from './upload'
var client = require('twilio')('AC57b3e4757050faf347be594c087072ac', '99c1785f890738c5a9dae9c1d7026818');

import mailchimp from 'mailchimp-v3';
mailchimp.setApiKey('bf21e8c5ce01c8ca427291537c90e06c-us8');

const api = new Router({
  prefix: '/api'
})

api.use('/upload', uploadApi.routes())
api.post('/sendSMS', (ctx, next) => {
  const phoneNumber = ctx.request.fields.phoneNumber
  client.sendMessage({
      to:'+1' + phoneNumber,
      from: '+16505631356',
      body: "You've been invited to test Tincyrate! www.tinycratehq.com"
  }, (err, responseData) => {
      if (err) {
        // console.log(responseData.from);
        console.log(responseData);
      }
  });
})
api.post('/addEmail', (ctx, next) => {
  const email = ctx.request.fields.email
  console.log(email)
  mailchimp
    // .get('lists')
    .post('lists/e3c994e12d/members', {
      "email_address": email,
      "status": "subscribed",
      "merge_fields": {
          "FNAME": "",
          "LNAME": ""
      }
    })
    .then(function(result){
      console.log(result);
    })
    .catch(function(error){
      console.log(error);
    });
})

export default api
