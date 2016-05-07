import React, {Component} from 'react';
import { ifStyle } from '../utilities';
import $ from 'jquery';
import { Motion, spring } from 'react-motion';
import { colors } from '../Crates/CrateTemplate';
import { CheckIcon, CancelIcon, AlertIcon } from '../NewCrates/Icons';

//NOTE: needs type check for email in the future. Check for @ in input.

class Input extends Component {
  constructor() {
    super();
    this.state = {
      type: '',
      isFocused: false,
      hasText: false,
      isSuccess: false,
      isError: false,
      text: ''
    }
  }
  componentDidMount = () => {
    if (this.props.type !== undefined) {
      this.setState({type: this.props.type})
    } else {
      this.setState({type: 'default'})
    }
    if(this.props.value !== undefined) {
      this.props.value.length > 0 ? this.setState({
        hasText: true,
        isSuccess: true,
        text: this.props.value
      }) : null
    }
  }
  componentWillUpdate = (nextProps, nextState) => {
    if(nextProps.isUsernameAvailable === false && this.state.isError === false) {
      this.setState({isError: true, isSuccess: false});
      return;
    }
    this.validationCheck(nextState);
  }
  handleChange = (event) => {
    this.setState({text: event.target.value});
  }
  focus = () => {
    const type = this.state.type;
    const text = this.state.text.length;
    if (!this.state.isFocused) {
      this.setState({isFocused: true})
    } else {
      if (type === 'phone-number') {
        if (text > 0) {
          if (text < 7) {
            this.setState({isFocused: true, isError: true})
          } else {
            this.setState({isFocused: false})
          }
        } else {
          this.setState({isFocused: false, isError: false})
        }
      } else if (type === 'default') {
        this.setState({isFocused: false})
      }
      // this.setState({isFocused: false})
    }
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
  validationCheck = (state) => {
    const text = state.text.length;
    const type = state.type;
    const hasText = state.hasText;

    if (type === 'default') {
      if (text > 0) {
        hasText ? null : this.setState({hasText: true, isSuccess: true})
      } else {
        !hasText ? null : this.setState({hasText: false, isSuccess: false})
      }
    } else if (type === 'phone-number') {
      if (text >= 7) {
        hasText === true ? null : this.setState({hasText: true, isSuccess: true, isError: false})
      } else {
        !hasText ? null : this.setState({hasText: false, isSuccess: false})
      }
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
      inputFocusError: {
        borderBottom: '2px solid' + colors('pink').darkColor
      },
      label: {
        position: 'absolute',
      },
      inputValidation: {
        position: 'absolute',
        right: '0px',
        bottom: '8px'
      },
      errorAlert: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        transform: 'translate(110%, 0)',
        color: colors('pink').darkColor
      },
      alertIcon: {
        marginRight: '6px'
      }
    }

    let isSuccessIcon;
    if (this.state.isSuccess) {
      isSuccessIcon = <div className="animated bounceIn"><CheckIcon color={colors('green').darkColor}/></div>
    } else {
      isSuccessIcon = ''
    }

    let isErrorIcon;
    if (this.state.isError) {
      isErrorIcon = <div className="animated bounceIn" style={styles.alertIcon}><AlertIcon color={colors('pink').darkColor}/></div>
    } else {
      isErrorIcon = ''
    }

    let phoneNumberErrorAlert;
    if (this.state.type === 'phone-number' && this.state.isError) {
      phoneNumberErrorAlert = <div className="errorAlert animated fadeIn" style={styles.errorAlert}>7 digits needed including area code</div>
    } else {
      phoneNumberErrorAlert = ''
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
        <div className="inputValidation" style={styles.inputValidation}>
          {isSuccessIcon}
          {isErrorIcon}
        </div>
        <input id={this.props.label} type="text" style={ifStyle(
            styles.input,
            this.state.isFocused && styles.inputFocus,
            this.state.isError && styles.inputFocusError
          )}
          onFocus={this.focus}
          onBlur={this.focus}
          value={this.state.text}
          onChange={this.handleChange}/>
        {phoneNumberErrorAlert}
      </div>
    )
  }
}

export default Input;
