import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ControlsView from 'components/Onboarding/ControlsView';

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()

  renderer.render(component)
  return renderer.getRenderOutput()
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<ControlsView {...props} />)
}

describe('(View) Controls', function () {
  let _component
  let _props
  let _child

  beforeEach(function () {
    _child = {}
    _props = {
      colors: 'red'
    }

    _component = shallowRenderWithProps(_props)
  })

  it('Should render as a <div>.', function () {
    expect(_component.type).to.equal('div')
  })
})
