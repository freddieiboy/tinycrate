const FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
const ref = new Firebase(FIREBASE_URL);

// only track events on Mixpanel in production mode
export function trackEvent(eventName, properties) {
  if(process.env.NODE_ENV === "development") {
    if(ref.getAuth() !== null) {
      mixpanel.identify(ref.getAuth().uid);
    }
    if(properties) {
      mixpanel.track(eventName, properties);
    } else {
      mixpanel.track(eventName);
    }
  }
}