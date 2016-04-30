import React, {Component} from 'react';
import { ifStyle } from '../utilities';
import $ from 'jquery';
import { Motion, spring } from 'react-motion';
import { colors } from '../Crates/CrateTemplate';
import { CheckIcon, CancelIcon } from '../NewCrates/Icons';

class Input extends Component {
  constructor() {
    super();
    this.state = {
      isFocused: false,
      hasText: false,
      isSuccess: false,
      isError: false,
      text: ''
    }
  }
  componentDidMount = () => {
    if(this.props.value !== undefined) {
      this.props.value.length > 0 ? this.setState({
        hasText: true,
        isSuccess: true,
        text: this.props.value
      }) : null
    }
  }
  componentWillUpdate = () => {
    this.validationCheck();
  }
  handleChange = (event) => {
    this.setState({text: event.target.value});
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
  validationCheck = () => {
    if (this.state.text.length > 0) {
      this.state.hasText === true ? null : this.setState({hasText: true, isSuccess: true})
    } else {
      this.state.hasText === false ? null : this.setState({hasText: false, isSuccess: false})
    }
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

    let isSuccessIcon;
    let isErrorIcon;
    if (this.state.isSuccess) {
      isSuccessIcon = <div className="inputValidation" style={styles.inputValidation}><CheckIcon color={colors('green').darkColor}/></div>
    } else {
      isSuccessIcon = ''
    }

    if (this.state.isError) {
      isErrorIcon = <div className="inputValidation" style={styles.inputValidation}><CancelIcon color={colors('pink').darkColor}/></div>
    } else {
      isErrorIcon = ''
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
        {isSuccessIcon}
        {isErrorIcon}
        <input type="text" style={ifStyle(
            styles.input,
            this.state.isFocused && styles.inputFocus
          )}
          onFocus={this.focus}
          onBlur={this.focus}
          value={this.state.text}
          onChange={this.handleChange}/>
      </div>
    )
  }
}

export default Input;
