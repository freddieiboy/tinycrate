import React, {Component} from 'react';

/*
Crate Utilities. Don't pass state to these components. Presentational Components only!

DefaultCrate = Crate style when it loads.
PressedCrate = Crate style when pressed.
*/

export class DefaultCrate extends Component {
  render() {
    const color = eval(this.props.color);

    return (
      <div className="default-crate">
        <svg viewBox="0 0 157 171" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-105.000000, -387.000000)">
              <g id="default-crate" transform="translate(105.000000, 387.000000)">
                <rect id="crate-bottom" fill={color.darkColor} x="0" y="36.2828685" width="157" height="126.717131" rx="26"></rect>
                <rect id="crate-top" fill={color.lightColor} x="0" y="0" width="157" height="107.641434" rx="26"></rect>
              </g>
            </g>
          </g>
        </svg>
        <div className="crate-shadow"></div>
      </div>
    )
  }
}

export class PressedCrate extends Component {
  render() {
    const color = eval(this.props.color);

    var pressedState = 'pressed-crate'
    this.props.popping ? pressedState = 'pressed-crate popping' : pressedState = 'pressed-crate'

    return(
      <div className={pressedState}>
        <svg viewBox="0 0 157 128" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-367.000000, -430.000000)">
              <g transform="translate(367.000000, 430.000000)">
                <path id="crate-bottom-pressed" fill={color.darkColor} d="M0.0387363138,53.1420234 C0.0387363138,33.0095093 4.40172453,23.7783713 4.40172453,23.7783713 C8.3778203,9.54136997 22.420139,3.1744319 35.8499801,9.33898447 C35.8499801,9.33898447 65.5461533,24.5105362 78.306673,24.5105362 C92.7046443,24.5105362 122.360906,9.28610109 122.360906,9.28610109 C135.76712,3.05295957 149.523301,9.63873233 152.692555,24.0832809 C152.692555,24.0832809 156.57461,35.2669851 156.574609,53.1420234 C156.574607,71.0170617 154.896172,90.5357711 154.896172,90.5357711 C153.873561,105.286307 141.319279,119.781221 126.806179,122.523472 C126.806179,122.523472 109.207247,127.643024 78.306673,127.643024 C47.4060993,127.643024 29.5884618,122.504433 29.5884618,122.504433 C15.0956454,119.599165 2.50140433,105.279136 1.55847323,90.5253465 C1.55847323,90.5253465 0.0387363138,73.2745376 0.0387363138,53.1420234 Z"></path>
                <path id="crate-top-pressed" fill={color.lightColor} d="M4.7744506,46.1259538 C4.7744506,39.0444277 5.96801792,24.8770004 5.96801792,24.8770004 C7.04101595,10.1321596 19.8689786,-0.901461016 34.6155842,0.179360544 C34.6155842,0.179360544 63.691099,2.60355121 78.1957364,2.60355121 C92.7003738,2.60355121 121.798558,0.177746943 121.798558,0.177746943 C136.534654,-0.926072811 149.657527,10.1009533 150.981888,24.8428406 C150.981888,24.8428406 152.274144,34.7384112 152.274144,46.1259534 C152.274144,57.5134956 150.979238,67.4430821 150.979238,67.4430821 C149.59929,82.1540258 136.650418,96.0498289 122.02826,98.1680952 C122.02826,98.1680952 106.576587,101.73023 78.1957385,101.730231 C49.8148903,101.730232 34.3632146,98.1680957 34.3632146,98.1680957 C19.7539785,95.910083 6.89580173,82.1363981 5.78409212,67.3988071 C5.78409212,67.3988071 4.7744506,59.4351654 4.7744506,46.1259538 Z"></path>
              </g>
            </g>
          </g>
        </svg>
        <div className="crate-shadow-pressed"></div>
      </div>
    )
  }
}

// Crate Color Properties Objects

const green = {
  lightColor: '#61F9CE',
  darkColor: '#0AB3A2',
}

const yellow = {
  lightColor: '#FFD687',
  darkColor: '#FFAC53',
}

const orange = {
  lightColor: '#FF7853',
  darkColor: '#E95832',
}

const blue = {
  lightColor: '#23CFFC',
  darkColor: '#009AC2',
}

const pink = {
  lightColor: '#FF7493',
  darkColor: '#E93A53',
}

const purple = {
  lightColor: '#F477FB',
  darkColor: '#C93BD9',
}


//TODO: use this in Crate.js
// var comment = this.props.msg.text
// var author = this.props.msg.authorDisplayName
// var image = this.props.msg.image
// var profile = this.props.msg.authorProfileImageURL

//TODO: use this for the preview msg
// <img className="preview-img" src={profile} alt=""/>
// <p>{author}</p>
// <p>{comment}</p>
// <img src={image} alt=""/>
