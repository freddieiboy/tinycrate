import React, { Component } from 'react';
import FlexCrateTemplate, { colors } from './Crates/FlexCrateTemplate';
import { Heart, EmojiContainer } from './Emojis';
import { TinycrateIcon } from './NewCrates/Icons';
import Input from './Onboarding/Input';
import $ from 'jquery';
// import { sendSMS } from '../sendSMS';

class Desktop extends Component {
  constructor() {
    super();
    this.state = {
      isSigningUp: false,
      isAddingEmail: false
    }
  }
  startForm = () => {
    this.setState({isSigningUp: true});
  }
  formCheck = () => {
    const phoneNumberError = $('#Phone').val().length < 10;
    const emailOptionActive = this.state.isAddingEmail;
    const emailOptionInactive = !emailOptionActive
    if (phoneNumberError) {
      if (emailOptionActive) {
        if ($('#Email').val().length === 0) {
          notie.alert(3, 'Your phone number needs 10 digits or your email must be longer than 1 character.', 2.1);
        } else {
          notie.alert(3, 'Your phone number needs 10 digits!', 2.1);
        }
      } else {
        notie.alert(3, 'Your phone number needs 10 digits!', 2.1);
      }
    } else {
      if (this.state.isAddingEmail) {
        notie.alert(1, 'Text sent and email confirmed. Check your phone!', 2.1);
        this.setState({isAddingEmail: false})
        this.addEmail();
        this.sendSMS();
      } else {
        notie.alert(1, 'Text sent. Check your phone!', 2.1);
        this.sendSMS();
      }
    }
  }
  sendSMS = () => {
    const data = $('#Phone').val();
    let formData = new FormData();
    formData.append('phoneNumber', data);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", './api/sendSMS', true);
    xhr.send(formData);

    const isSigningUp = this.state.isSigningUp;
    isSigningUp ? this.setState({isSigningUp: false}) : this.setState({isSigningUp: true})
  }
  addEmail = () => {
    const data = $('#Email').val();
    let formData = new FormData();
    formData.append('email', data);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", './api/addEmail', true);
    xhr.send(formData);
  }
  checkIf = () => {
    if ($('#newsletterCheck').prop('checked')) {
      console.log('checked')
      this.setState({isAddingEmail: true})
    } else {
      console.log('notChecked')
      this.setState({isAddingEmail: false})
    }
  }
  render() {
    const styles = {
      Desktop: {
        overflowY: 'scroll'
      },
      crateContainer: {
        position: 'relative',
        width: '80px'
      },
      crateInner: {
        position: 'absolute',
        paddingBottom: '3em'
      },
      title: {
        textAlign: 'center',
        marginBottom: '2em'
      },
      signup: {
        width: '400px',
        textAlign: 'center'
      },
      signupButton: {
        margin: '4em 0em'
      },
      navigation: {
        height: '60px',
        border: '1px solid #E2E2E2',
        paddingTop: '5px'
      },
      navOption: {
        margin: '0px 15px'
      },
      signupInput: {
        borderTop: '1px dashed #C5C5C5',
        paddingTop: '10px'
      },
      signupCheck: {
        marginTop: '24px'
      },
      check: {
        margin: '7px 11px 0px 0px'
      },
      checkLabel: {
        margin: '0px'
      }
    }
    const test = 'test';
    const thisColor = 'blue';
    return (
      <div className="Desktop full-height" style={styles.Desktop}>
        <div className="navigation Grid Grid--full-center" style={styles.navigation}>
          <div className="navOption" style={styles.navOption}>
            <TinycrateIcon color={'#E2E2E2'}/>
          </div>
        </div>
        <div className="Grid Grid--center Grid--columns full-height">
          <div className="crateContainer flex-1" style={styles.crateContainer}>
            <div className="crateInner Grid Grid--bottom full-height" style={styles.crateInner}>
              <FlexCrateTemplate
                size={80}
                color={thisColor}
                type={'empty'}
                preview={<Heart color={colors(thisColor).darkColor}/>}
                pop={1}
                shadow={true}
                />
            </div>
          </div>
          <div className="title flex-auto" style={styles.title}>
            <h1>Tinycrate</h1>
            <p>
              Tinycrate is an app where you communicate through small boxes.
              <br/>
              We call it a Loot Messenger.
            </p>
          </div>
          <div className="signup flex-1" style={styles.signup}>
            {this.state.isSigningUp ?
              <div className="signupInput" style={styles.signupInput}>
                <div className="animated fadeIn">
                  <p>Only for the mobile web on any phone.</p>
                  <Input label={'Phone'} type={'phone-number'} ref="thisPhoneNumber" />
                  {this.state.isAddingEmail ?
                    <div className="animated fadeIn">
                      <Input label={'Email'} />
                    </div>
                  :
                    ''
                  }
                  <div className="signupCheck Grid" style={styles.signupCheck}>
                    <input onClick={this.checkIf} style={styles.check} type="checkbox" id="newsletterCheck"/>
                    <p style={styles.checkLabel}>Sign up for Tinycrate Newsletter-crates</p>
                  </div>
                </div>
                <div className="signupButton" style={styles.signupButton}>
                  <div className="button" onClick={this.formCheck}>
                    {this.state.isAddingEmail ?
                      <p>SMS and Newsletter Sign up</p>
                    :
                      <p>Text link to your Phone</p>
                    }
                  </div>
                </div>
              </div>
              :
              <div>
                <div className="button" onClick={this.startForm}>Join the Alpha Webapp</div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Desktop;
