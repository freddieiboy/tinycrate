import React from 'react';
import mojs from 'mo-js';
import firebase from 'firebase';

var FIREBASE_URL = "https://burning-heat-5122.firebaseio.com";
var ref = new Firebase(FIREBASE_URL);

/*
DEPRECATED!
Crate Utilities. Don't pass state to these components. Presentational Components only!

DefaultCrate = Crate style when it loads.
PressedCrate = Crate style when pressed.
popAnimation = Animation function.
*/

export const DefaultCrate = ({color}) => {
  const evalColor = eval(color);
  return (
    <div className="default-crate" style={styles.shadow}>
      <svg viewBox="0 0 157 165" version="1.1">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-105.000000, -387.000000)">
            <g id="default-crate" transform="translate(105.000000, 387.000000)">
              <rect id="crate-bottom" fill={evalColor.darkColor} x="0" y="36.2828685" width="157" height="126.717131" rx="26"></rect>
              <rect id="crate-top" fill={evalColor.lightColor} x="0" y="0" width="157" height="107.641434" rx="26"></rect>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export const PressedCrate = ({popping, color}) => {
  const evalColor = eval(color);
  return(
    <div className={popping ? 'hide' : {}} style={styles.shadowPressed}>
      <svg viewBox="0 0 157 128" version="1.1" >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-367.000000, -430.000000)">
            <g transform="translate(367.000000, 430.000000)">
              <path id="crate-bottom-pressed" fill={evalColor.darkColor} d="M0.0387363138,53.1420234 C0.0387363138,33.0095093 4.40172453,23.7783713 4.40172453,23.7783713 C8.3778203,9.54136997 22.420139,3.1744319 35.8499801,9.33898447 C35.8499801,9.33898447 65.5461533,24.5105362 78.306673,24.5105362 C92.7046443,24.5105362 122.360906,9.28610109 122.360906,9.28610109 C135.76712,3.05295957 149.523301,9.63873233 152.692555,24.0832809 C152.692555,24.0832809 156.57461,35.2669851 156.574609,53.1420234 C156.574607,71.0170617 154.896172,90.5357711 154.896172,90.5357711 C153.873561,105.286307 141.319279,119.781221 126.806179,122.523472 C126.806179,122.523472 109.207247,127.643024 78.306673,127.643024 C47.4060993,127.643024 29.5884618,122.504433 29.5884618,122.504433 C15.0956454,119.599165 2.50140433,105.279136 1.55847323,90.5253465 C1.55847323,90.5253465 0.0387363138,73.2745376 0.0387363138,53.1420234 Z"></path>
              <path id="crate-top-pressed" fill={evalColor.lightColor} d="M4.7744506,46.1259538 C4.7744506,39.0444277 5.96801792,24.8770004 5.96801792,24.8770004 C7.04101595,10.1321596 19.8689786,-0.901461016 34.6155842,0.179360544 C34.6155842,0.179360544 63.691099,2.60355121 78.1957364,2.60355121 C92.7003738,2.60355121 121.798558,0.177746943 121.798558,0.177746943 C136.534654,-0.926072811 149.657527,10.1009533 150.981888,24.8428406 C150.981888,24.8428406 152.274144,34.7384112 152.274144,46.1259534 C152.274144,57.5134956 150.979238,67.4430821 150.979238,67.4430821 C149.59929,82.1540258 136.650418,96.0498289 122.02826,98.1680952 C122.02826,98.1680952 106.576587,101.73023 78.1957385,101.730231 C49.8148903,101.730232 34.3632146,98.1680957 34.3632146,98.1680957 C19.7539785,95.910083 6.89580173,82.1363981 5.78409212,67.3988071 C5.78409212,67.3988071 4.7744506,59.4351654 4.7744506,46.1259538 Z"></path>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

const styles = {
  shadow: {
    height: 83,
    borderRadius: 13,
  	boxShadow: '0px 12px 10px 0px rgba(5,156,150,0.34)'
  },
  shadowPressed: {
    marginTop: 30,
    height: 59,
    borderRadius: 27,
  	boxShadow: '0px 11px 10px 0px rgba(5,156,150,0.34)'
  }
}

export function openCrate(crate, callback) {
  crate.update({
    "opened": true,
    "openedAt": Firebase.ServerValue.TIMESTAMP
  }, (error) => {
    if (error) {
      console.log("Crate could not be opened: " + error);
    } else {
      // increment 'unwrappedCount' after opening a crate
      incrementUnwrappedCount();
    }
    callback(error);
  });
}

export function collectCrate(crate) {
  var collectionAuditRef = ref.child('collectionAudits').child(ref.getAuth().uid);
  collectionAuditRef.transaction(function(collectionAudit) {
    return {
      collectionCount: (collectionAudit === null) ? 1 : collectionAudit.collectionCount + 1,
      lastCollectedCrateId: crate.key
    };
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
    } else if (!committed) {
      console.log('Transaction not committed!');
    } else {
      var path = crate.key;
      var fannedOutData = {};
      fannedOutData['/collection/' + ref.getAuth().uid + '/' + path] = crate;
      ref.update(fannedOutData, function(error) {
        if(error) {
          console.log(error);
          return;
        } else {
          alert("This crate was saved to your collection!");
        }
      });
    }
  });
}

export function uncollectCrate(crateId) {
  var collectionAuditRef = ref.child('collectionAudits').child(ref.getAuth().uid);
  collectionAuditRef.transaction(function(collectionAudit) {
    return {
      collectionCount: (collectionAudit === null) ? 1 : collectionAudit.collectionCount - 1,
      lastCollectedCrateId: crateId
    };
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
    } else if (!committed) {
      console.log('Transaction not committed!');
    } else {
      var fannedOutData = {};
      fannedOutData['/collection/' + ref.getAuth().uid + '/' + crateId] = null;
      ref.update(fannedOutData, function(error) {
        if(error) {
          console.log(error);
          return;
        } else {
          alert("This crate was removed from your collection.");
        }
      });
    }
  });
}

export function incrementGiftedCount () {
  var userRef = ref.child('users').child(ref.getAuth().uid);
  userRef.child("giftedCount").transaction(function(giftedCount) {
    if(giftedCount === null) {
      return 1;
    }
    return giftedCount + 1;
  });
}

const incrementUnwrappedCount = () => {
  var userRef = ref.child('users').child(ref.getAuth().uid);
  userRef.child("unwrappedCount").transaction(unwrappedCount => {
    if(unwrappedCount === null) {
      return 1;
    }
    return unwrappedCount + 1;
  });
}

export function pop1(el, color) {
  // var el = this.refs.thisCrate,
    // mo.js timeline obj
    const evalColor = eval(color);
    var timeline = new mojs.Timeline(),

    // tweens for the animation:

    // burst animation
    tween1 = new mojs.Burst({
      parent: el,
      duration: 1500,
      shape : 'circle',
      fill : evalColor.lightColor,
      x: '50%',
      y: '50%',
      opacity: 0.6,
      childOptions: { radius: {20:0} },
      radius: {40:120},
      count: 6,
      isSwirl: true,
      isRunLess: true,
      easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
    }),
    // ring animation
    tween2 = new mojs.Transit({
      parent: el,
      duration: 750,
      type: 'circle',
      radius: {0: 50},
      fill: 'transparent',
      stroke: evalColor.lightColor,
      strokeWidth: {15:0},
      opacity: 0.6,
      x: '50%',
      y: '50%',
      isRunLess: true,
      easing: mojs.easing.bezier(0, 1, 0.5, 1)
    }),
    // icon scale animation
    tween3 = new mojs.Tween({
      duration : 700,
      onUpdate: function(progress) {
      }
    });

  timeline.add(tween1, tween2, tween3);

  return timeline.start()
}

export function pop2(crateRefs, color, preview) {
  /* Icon 7 */
      const evalColor = eval(color);
      const bounceItem = preview;
      var removeEl = function removeEl (node) { node.parentNode.removeChild(node); }
      var timeline = new mojs.Timeline(),

      // burst animation
      tween1 = new mojs.Burst({
        parent: crateRefs,
        className: 'asdf;lkasjdf;lkasdjfkj;kj',
        duration: 900,
        delay: 200,
        shape : 'circle',
        fill: color.darkColor,
        x: '50%',
        y: '50%',
        opacity: 0.6,
        childOptions: { radius: {'rand(20,5)':0} },
        radius: {90:150},
        count: 18,
        isSwirl: true,
        swirlSize: 15,
        isRunLess: true,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        onComplete: function () { removeEl(this.el); }
      }),
      // ring animation
      tween2 = new mojs.Transit({
        parent: crateRefs,
        duration: 1100,
        type: 'circle',
        radius: {30: 100},
        fill: 'transparent',
        stroke: color.darkColor,
        strokeWidth: {30:0},
        opacity: 0.6,
        x: '50%',
        y: '50%',
        isRunLess: true,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        onComplete: function () { removeEl(this.el); }
      }),
      tween3 = new mojs.Transit({
        parent: crateRefs,
        duration: 1200,
        delay: 320,
        type: 'circle',
        radius: {30: 80},
        fill: 'transparent',
        stroke: color.darkColor,
        strokeWidth: {20:0},
        opacity: 0.3,
        x: '50%',
        y: '50%',
        isRunLess: true,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        onComplete: function () { removeEl(this.el); }
      }),
      // icon scale animation
      tween4 = new mojs.Tween({
        duration : 400,
        onUpdate: function(progress) {
          if(progress > 0.3) {
            var elasticOutProgress = mojs.easing.elastic.out(1.43*progress-0.43);
            bounceItem.style.WebkitTransform = bounceItem.style.transform = 'scale3d(' + '1,' + elasticOutProgress + ',1)';
          }
          else {
            bounceItem.style.WebkitTransform = bounceItem.style.transform = 'scale3d(0,0,1)';
          }
        }
      })

      timeline.add(tween1, tween2, tween3, tween4);

      return timeline.start()
  /* Icon 7 */
}

// Crate Color Properties Objects

export const green = {
  lightColor: '#49FFCC',
  darkColor: '#1ADEDB',
}

export const yellow = {
  lightColor: '#FCE973',
  darkColor: '#FFC868',
}

export const orange = {
  lightColor: '#FD9C44',
  darkColor: '#F67A1B',
}

export const blue = {
  lightColor: '#57E3FD',
  darkColor: '#2BBFD9',
}

export const pink = {
  lightColor: '#FB70AF',
  darkColor: '#EE3B76',
}

export const purple = {
  lightColor: '#FF5DFA',
  darkColor: '#C746E9',
}

export const empty = {
  lightColor: '#E9FAFD',
  darkColor: '#CBEBF0'
}

export const emptyAlt = {
  lightColor: '#CBEBF0'
}

export const productHunt = {
  lightColor: '#DA552F',
  darkColor: '#CC4124'
}

const twitter = {
  lightColor: '#55ACEE',
  darkColor: '#2F91DB'
}

const facebook = {
  lightColor: '#3B5998',
  darkColor: '#24468B'
}

//TODO:10 props use in Crate.js
// var comment = this.props.msg.text
// var author = this.props.msg.authorDisplayName
// var image = this.props.msg.image
// var profile = this.props.msg.authorProfileImageURL

//#Beta:10 for use this for the preview msg
// <img className="preview-img" src={profile} alt=""/>
// <p>{author}</p>
// <p>{comment}</p>
// <img src={image} alt=""/>
