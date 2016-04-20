
// ACTION CREATORS
export const finishTutorialMode = () => {
  return {
    type: 'FINISH_TUTORIAL_MODE',
    isTutorialMode: false
  }
}

//TODO: make startTutorialMode

// REDUCERS + INITITAL STATE
const initialState = {
  isTutorialMode: true,
}

export default function onboarding (state = initialState, action) {
  switch (action.type) {
    case 'FINISH_TUTORIAL_MODE':
      return {
        ...state,
        isTutorialMode: action.isTutorialMode
      }
    default:
      return state;
  }
}
