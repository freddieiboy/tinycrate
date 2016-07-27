import Router from 'koa-router'
import request from 'request'

const notification = new Router()

const firebaseCloudMessagingServerKey = 'AIzaSyBo1AoInaY_mufYPBDe6S3vmPbIz0MkYZA'
const firebaseCloudMessagingApiUrl = 'https://fcm.googleapis.com/fcm/send'

export function sendFcm(fcmToken, body) {
  return new Promise(function(resolve, reject) {
    
    var requestBody = {
      'to' : fcmToken,
      'content_available': true,
      "notification": {
        "title": "Tinycrate",
        "body": body,
        "click_action": "fcm.ACTION.HELLO"
      },
      "data": {
        "foo":"bar"
      }
    };
    
    request({
      url: firebaseCloudMessagingApiUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'key=' + firebaseCloudMessagingServerKey
      },
      json: true,
      body: requestBody
    }, function (error, response, body){
      console.log(body);
      if(error) {
        console.log(error);
        reject(err);
      } else {
        resolve("Success!");
      }
    });
    
  });
}

// send message via Firebase Cloud Messaging
notification.post('/send', function (ctx, next)  {
  var fcmToken = ctx.request.fields.fcmToken;
  return sendFcm(fcmToken, 'Test Body').then(function(success) {
    ctx.body = success;
  }, function(error) {
    ctx.body = error;
  });
});

export default notification