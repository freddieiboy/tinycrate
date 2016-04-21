import React, {Component} from 'react';
import * as onboardingActions from '../../redux/modules/Onboarding';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';

class SlideContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 1
    }
  }
  componentWillUpdate = (nextProps, nextState) => {
    console.log(nextState.slide, nextProps)
    nextState.slide === 4 ? this.props.actions.push('get-started-color') : null
  }
  backSlide = () => {
    let number = this.state.slide;
    number > 1 ? number-- : null
    this.setState({slide: number})
  }
  nextSlide = () => {
    let number = this.state.slide;
    number < 4 ? number++ : null
    this.setState({slide: number})
  }
  render() {
    let slide;
    let slideText;
    const slideState = this.state.slide;
    if (slideState === 1) {
      slide = 'http://i.imgur.com/uMgW8F2.gif'
      slideText = 'Welcome to the world of Tinycrate!'
    } else if (slideState === 2) {
      slide = 'http://i.imgur.com/s61zxbY.gif'
      slideText = 'In this world, you communicate through tiny mysterious crates.'
    } else if (slideState === 3) {
      slide = 'http://i.imgur.com/YQOUmOe.png'
      slideText = 'It’s up to you to collect and send crates around the world through this Loot Messenger.'
    }
    const styles = {
      Onboarding: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100vh',
        backgroundColor: '#000'
      },
      imageContainer: {
        width: '100vw',
        height: '50%',
        border: '1px solid red',
        backgroundColor: '#FEFDFA'
      },
      image: {
        height: '100%',
        backgroundImage: 'url(' + slide + ')',
        backgroundPosition: 'center',
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'no-repeat'
      },
      messageContainer: {
        width: '100vw',
        height: '20%',
        border: '1px solid blue',
        backgroundColor: '#FEFDFA'
      }
    }
    return (
      <div className="Onboarding" style={styles.Onboarding}>
        <div className="imageContainer" style={styles.imageContainer}>
          <div className="image" style={styles.image}></div>
        </div>
        <div className="messageContainer" style={styles.messageContainer}>
          <p>{slideText}</p>
        </div>
        <button className="button" onClick={this.backSlide}>Back</button>
        <button className="button" onClick={this.nextSlide}>Next</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  store: {
    isTutorialMode: state.Onboarding.isTutorialMode
  }
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, routerActions, onboardingActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SlideContainer)
