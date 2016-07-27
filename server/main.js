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
import firebase from 'firebase'

firebase.initializeApp({
  serviceAccount: {
    projectId: "firebase-testingtc",
    clientEmail: "tinycrate-server@firebase-testingtc.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCYspOlQvAj8es7\nB1N2ru7+cxWI6gBOPJC5Ff7rTd9iRvHhiWLqqgtgy1DEh1Lupx+30o+zcLkEG/Mf\nK8RjReIoy2IbOxSl6/W8ugAuSdRpRXZ86AlleWHfJ0lx9Tg2G+ppDWLn4HqkF73L\njLwv35DR378XjZ6pfjt5/oNjwnxyVNnrEvNpy/0Gb4bV9xmjKS9I9JzBH42khRx1\nYsc/iAjvt8Ottqy29BeGwbr44W6dM8oUbtSeb2++gr2I/qci7lkvryzhz1aju2MM\nhD0+CxLJ76ys8PZlVBmG/p+SzsLER0gC1v46VE8tiTE77VXmEEyCSe7ZDjkiF45r\n4V/k7CS1AgMBAAECggEALcT5NIQH7v5If/0GK4Dr6iEcx1k8ljbZOmE5c9Z3qsGR\nJwVDPQuTNYQ7xWy6kwZNH5BhumuDSZQHH8TCrO75hzjPQ1JGMiW0Fsm53CYNITDM\n/0ud5WioyXbBMQNLwgxECxEUIGTM3fqvzR92GPNuOTpT0P+GG0/XDA4Z3AEjxDDr\nkx7hSgcplpNZGb8fLRDsltxY8ETSt8BmLlbIkHcbOrxa4gvn+2o0kBNnmYTnf2kf\ngpeHs+rjlA1MQmKR4hdz6na7mciDmR/RkSRVkv4yKS426Kso6PcjuJFZQf209yya\nSWY1Ld9osxdR0M8Ae2T+p8bQbJIrqr/fwqB0XlTX0QKBgQDcpmwMVeGE+9hlBXPG\nvcYpKBH4Rc5ntD2P9qdmqeFIbSBS25gol6SFrSp/CQSVFonclZXzNgm5DcGJ9Bmw\nCuyr25LsdjkY0wEEsiAKKVACXDSfbYYWLINtaSsjB9zwC+oUmNELL8XhXms/GWFu\nI9zRyI9PBgiM8QBQB4V+WPgxhwKBgQCxKTNhxmVW3YooDjq/8fLFY3C+5wrXRSe5\nwiw/mPCRrN9ogEtR0+fIjfQhVvcOiTW/rcZYXu2rcdMueisFhkqum1WrbpvacDHc\n2tyhtIFypUtJ1boxpOAlNqADMpny+dD1MxLyn4e5GeuUGDbriF89dxcmD8T6lIEv\n3i3QJtx24wKBgQCtlsQ0ZDA69gNFXqe5+Dz4zgxtHUYIMjWol+0VCJsy5p9icF5h\nuQN3I0fmj0qqnAOzpX9FywKVMqxLgt3esImHnwQUweGjlQUdE6G/PMc0RCQmNP0j\nXru7DN0h/yKjO0xaDeuP+HKeHjETgD01cENeS4HrMpzxfPy4+WHdh9Mi6wKBgG11\nc1W56uscvju5bvshVko3AnYw8jXHeKABJK22pQycrvw2KFNKhi8X5fqjbMoCZL8l\ncyMuo9IF5eEVgndLXeE8AFaHZKw2HdjDMQaILGLVVgssjnoV0JethHf1T8EcMMsO\n32ogvw7SwQcjXutvusiTSC4wGBhqoNceg1fUaurZAoGBAJ01iwW6h4HfFxJMhpNj\nRPTfWzDvGajQCXaq1Up01JUeruZEsXFGccocpKjbZEe4/THniQ3iIMDbpSZSpXiy\nDbh3OVItGfG1bIs33CnyxJATVJYHhG26pn+r7fFOwSwFfSdnUzwAf8t7pXfVci83\ntC4SaPW3e01hsV5PytX3xorx\n-----END PRIVATE KEY-----\n"
  },
  databaseURL: "https://testingtc.firebaseio.com"
});

var db = firebase.database();

// listen for new additions to the notification queue
var ref = db.ref("notificationQueue");
ref.on("child_added", function(snapshot) {
  var notificationQueueSnapshot = snapshot;
  var notificationData = snapshot.val();
  
  // find the FCM token associated with the recipient's UID
  var userFcmTokenRef = db.ref('fcmTokens/' + notificationData.recipientUId);
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
