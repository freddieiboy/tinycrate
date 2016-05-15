import Router from 'koa-router'
import AWS from 'aws-sdk'
import fs from 'fs-extra'

const upload = new Router()

const s3AccessKeyId = 'AKIAJVXKWRV57MFYEHPA'
const s3SecretAccessKey = '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'
const s3Region = 'us-west-2'
const s3BucketName = 'tinycrate'

function uploadToS3(key, file) {
  return new Promise(function(resolve, reject) {
    
    fs.readFile(file.path, function(err, data) {
      
      AWS.config.update({accessKeyId: s3AccessKeyId, secretAccessKey: s3SecretAccessKey, region: s3Region});
      var bucket = new AWS.S3({
        params: {
          Bucket: s3BucketName
        }
      });
      
      var params = {
        Key: key,
        ContentType: file.type,
        Body: data,
        ACL: 'public-read'
      };
      
      bucket.putObject(params, function (err, data) {
        if (err) {
          console.log(err);
          reject(err)
        } else {
          resolve("Success!");
        }
      });
      
    });
  });
}

// upload image to Amazon S3
upload.post('/image', function (ctx, next)  {
  var key = ctx.request.fields.key;
  var file = ctx.request.files.imageFile;
  return uploadToS3(key, file).then(function(success) {
    ctx.body = success;
  }, function(error) {
    ctx.body = error;
  });
});

export default upload