import Koa from 'koa'
import convert from 'koa-convert'
import body from 'koa-better-body'
import webpack from 'webpack'
import webpackConfig from '../build/webpack.config'
import historyApiFallback from 'koa-connect-history-api-fallback'
import serve from 'koa-static'
import proxy from 'koa-proxy'
import _debug from 'debug'
import config from '../config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import api from './api'
import { sendFcm } from './api/notification'
import { Firebase, FirebaseAuth, FirebaseDb } from './modules/Firebase.js';

// listen for new additions to the notification queue
var ref = FirebaseDb.ref("notificationQueue");
ref.on("child_added", function(snapshot) {
  var notificationQueueSnapshot = snapshot;
  var notificationData = snapshot.val();
  
  // find the FCM token associated with the recipient's UID
  var userFcmTokenRef = FirebaseDb.ref('fcmTokens/' + notificationData.recipientUId);
  userFcmTokenRef.on("value", function(snapshot) {
    var userFcmToken = snapshot.val();
    return sendFcm(userFcmToken, notificationData.message).then(function(success) {
      // remove the record from the notification queue
      notificationQueueSnapshot.ref.remove();
    }, function(error) {
      console.log(JSON.stringify(error));
    });
  }, function (error) {
    console.log(JSON.stringify(error));
  });
});

const debug = _debug('app:server')
const paths = config.utils_paths
const app = new Koa()
const byteLimit = '50mb'
app.use(body({multipart: true, formLimit: byteLimit, jsonLimit: byteLimit, textLimit: byteLimit, bufferLimit: byteLimit}));

// Include API
app.use(api.routes())

// Enable koa-proxy if it has been enabled in the config.
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)))
}

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false
})))

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(convert(serve(paths.client('static'))))
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(convert(serve(paths.base(config.dir_dist))))
}

export default app
