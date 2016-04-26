import React, {Component} from 'react';
import { ifStyle } from '../utilities';
import $ from 'jquery';
import { Motion, spring } from 'react-motion';
import { colors } from '../Crates/CrateTemplate';
import { CheckIcon } from '../NewCrates/Icons';

class Input extends Component {
  constructor() {
    super();
    this.state = {
      isFocused: false,
      hasText: false,
      isSuccess: false,
      isError: false
    }
  }
  componentDidMount = () => {
    if(this.props.value !== undefined) {
      this.props.value.length > 0 ? this.setState({hasText: true, isSuccess: true}) : null
    }
  }
  handleChange = (event) => {
    if(!this.state.hasText) {
      if(event.target.value.length > 0) {
        this.setState({hasText: true, isSuccess: true});
      }
    } else {
      if(event.target.value.length === 0) {
        this.setState({hasText: false, isSuccess: false})
      }
    }
  }
  focus = () => {
    !this.state.isFocused ? this.setState({isFocused: true}) : this.setState({isFocused: false})
  }
  labelInitPos() {
    return {
      bottom: spring(5),
      opacity: spring(1)
    }
  }
  labelFinalPos() {
    return {
      bottom: spring(24),
      opacity: spring(0.5)
    }
  }
  labelPosChecker = () => {
    const isFocused = this.state.isFocused;
    const noText = !this.state.hasText && !isFocused;
    const predefinedText = this.state.hasText;

    return Object.assign(
      {},
      isFocused && this.labelFinalPos(),
      predefinedText && this.labelFinalPos(),
      noText && this.labelInitPos(),
    )
  }
  render() {
    const styles = {
      Input: {
        position: 'relative',
        marginTop: '24px'
      },
      input: {
        border: 'none',
        borderBottom: '2px solid grey',
        borderRadius: '0px'
      },
      inputFocus: {
        borderBottom: '2px solid' + colors('green').darkColor
      },
      label: {
        position: 'absolute',
      },
      inputValidation: {
        position: 'absolute',
        right: '0px',
        bottom: '8px'
      }
    }
    let validation;
    if (this.state.isSuccess) {
      validation = <div className="inputValidation" style={styles.inputValidation}><CheckIcon color={colors('green').darkColor}/></div>
    } else {
      validation = ''
    }
    return (
      <div className="Input" style={styles.Input}>
        <Motion style={this.labelPosChecker()}>
          {({bottom, opacity}) =>
            <div className="label noTouch" style={Object.assign({}, styles.label, {bottom, opacity})}>
              <label>{this.props.label}</label>
            </div>
          }
        </Motion>
        {validation}
        <input type="text" style={ifStyle(
            styles.input,
            this.state.isFocused && styles.inputFocus
          )}
          onFocus={this.focus}
          onBlur={this.focus}
          value={this.props.value}
          onChange={this.handleChange}/>
      </div>
    )
  }
}

export default Input;
