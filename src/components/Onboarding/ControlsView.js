import React from 'react';

const ControlsView = ({slide, back, next, selectColor}) => {
  return (
    <div className="ControlsView">
      {slide > 1 ? (
        <button className="button" onClick={back}>Back</button>
      ) : (
        null
      )}
      <button className="button" onClick={next}>Next</button>
    </div>
  )
}

export default ControlsView;
