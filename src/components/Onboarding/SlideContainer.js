import React, {Component} from 'react';
import * as onboardingActions from '../../redux/modules/Onboarding';
import {green} from '../Crates/CrateUtils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerActions} from 'react-router-redux';
import SelectColorView from './SelectColorView';
import ControlsView from './ControlsView';

class SlideContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 1,
      selectedColor: 'empty'
    }
  }
  // componentWillUpdate = (nextProps, nextState) => {
  //   console.log(nextState.slide, nextProps)
  //   nextState.slide === 4 ? this.props.actions.push('get-started-color') : null
  // }
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
  selectColor = (color) => {
    this.setState({selectedColor: color})
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
    } else if (slideState === 4) {
      slideText = 'Crate colors are special in Tinycrate. Which color will you represent you? Choose one.'
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
        // border: '1px solid red',
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
        borderTop: '1px solid #D9D9D9',
        backgroundColor: '#FEFDFA'
      },
      controlContainer: {
        height: '30%',
        position: 'absolute',
        width: '100vw',
        // backgroundColor: 'blue'
      }
    }
    const selectinColors = this.state.slide !== 4;
    return (
      <div className="Onboarding" style={styles.Onboarding}>
        <div className="imageContainer" style={styles.imageContainer}>
          {selectinColors ? (
            <div className="image" style={styles.image}></div>
          ) : (
            <SelectColorView selectColor={this.selectColor} />
          )}
        </div>
        <div className="messageContainer" style={styles.messageContainer}>
          <p>{slideText}</p>
        </div>
        <div className="controlContainer" style={styles.controlContainer}>
          <ControlsView back={this.backSlide} next={this.nextSlide} slide={this.state.slide} selectedColor={this.state.selectedColor}/>
        </div>
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
