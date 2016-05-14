// only track events on Mixpanel in production mode
export function trackEvent(eventName, properties) {
  if(process.env.NODE_ENV !== "development") {
    if(properties) {
      mixpanel.track(eventName, properties);
    } else {
      mixpanel.track(eventName);
    }
  }
}