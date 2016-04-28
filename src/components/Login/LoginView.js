import React from 'react';
import CrateTemplate from '../Crates/CrateTemplate';

const LoginButtons = ({loginTwitter}) => {
  const styles = {
    LoginPage: {
      // textAlign: 'center',
      height: '100vh'
    },
    loginBG: {
      height: '100%',
      width: '100%',
      background: 'url(http://i.imgur.com/F6pOzw1.png) center',
      backgroundSize: 'cover',
      zIndex: '-2',
      position: 'absolute',
      left: '0px',
      top: '-149px',
      transform: 'scale(0.8)'
    },
    title: {
      position: 'absolute',
      bottom: '270px',
      left: '50%',
      marginLeft: '-62px'
    },
    loginTitles: {
      position: 'absolute',
      left: '50%',
      marginLeft: '-58px',
      top: '188px',
    },
    loginCrates: {
      // display: 'inline-block',
      // width: '170px',
      // marginTop: '75px',
      // textAlign: 'left
      height: '250px'
    },
    twitterCrate: {
      margin: '0 20px'
      // float: 'left'
    },
    facebookCrate: {
      margin: '0 20px'
      // float: 'left',
      // marginRight: '18px'
    },
    loginFooter: {
      // height: '100%',
      // width: '100%',
      // overflow: 'hidden'
    },
    getStarted: {
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden'
      // textAlign: 'left'
    },
    getStartedBG: {
      position: 'absolute',
      height: '375px',
      width: '375px',
      backgroundColor: '#F6F6F6',
      borderTop: '40px solid #fefdfa',
      borderLeft: '20px solid #fefdfa',
      borderRight: '20px solid #fefdfa',
      left: '50%',
      transform: 'translate(-50%)',
      zIndex: '-1'
    },
    getStartedStripedBG: {
      left: '0px',
      width: '100vw',
      height: '30px',
    },
    getStartedCrate: {
      marginTop: '100px'
    },
    stripes: {
      position: 'absolute',
      zIndex: '-2',
      marginTop: '40px'
    },
    stripe1: {
      backgroundColor: '#57E3FD'
    },
    stripe2: {
      backgroundColor: '#C746E9'
    },
    stripe3: {
      backgroundColor: '#FFDF81'
    },
    stripe4: {
      backgroundColor: '#FB70AF'
    },
    stripe5: {
      backgroundColor: '#49FFCC'
    },
    stripe6: {
      backgroundColor: '#1ADEDB'
    },
    stripe7: {
      backgroundColor: '#2BBFD9'
    }
  }
  return (
    <div className="LoginContainer" style={styles.LoginPage}>
      <div className="loginBG" style={styles.loginBG}></div>
      <footer>
        <h1 style={styles.title}>Tinycrate</h1>
          <div className="loginTitles" style={styles.loginTitles}>
            <p>Start the Journey</p>
          </div>
        <div className="loginFooter Grid" style={styles.loginFooter}>
          <div className="stripes" style={styles.stripes}>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe1)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe2)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe3)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe4)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe5)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe6)}></div>
            <div className="getStartedStripedBG" style={Object.assign({}, styles.getStartedStripedBG, styles.stripe7)}></div>
          </div>
          <div className="getStarted Grid-cell" style={styles.getStarted}>
            <div className="getStartedBG Grid-cell" style={styles.getStartedBG}></div>
            <div className="loginCrates Grid Grid--center-content" style={styles.loginCrates}>
              {/*<div className="Grid-cell"></div>*/}
              <div className="facebookCrate Grid-cell" style={styles.facebookCrate}>
                <CrateTemplate color={'facebook'} crateType={'login-facebook'} crateSize={80} pop={true} popType={'2'} shadow={'true'}/>
              </div>
              <div className="twitterCrate Grid-cell" style={styles.twitterCrate} onMouseUp={loginTwitter} onTouchEnd={loginTwitter}>
                <CrateTemplate color={'twitter'} crateType={'login-twitter'} crateSize={80} pop={true} popType={'2'} shadow={'true'}/>
              </div>
              <div className="Grid-cell"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginButtons;
