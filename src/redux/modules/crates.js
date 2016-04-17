
// ACTION CREATORS
export const setEmojiNumber = (num) => {
  return {
    type: 'EMOJI_NUMBER',
    number: num
  }
}

export const setupCratesList = (data) => {
  return {
    type: 'ADD_UNOPENED_CRATE',
    cratesList: data
  }
}

// REDUCERS + INITITAL STATE
const initialState = {
  emoji: 0,
  cratesList: []
}
export default function crates (state = initialState, action) {
  switch (action.type) {
    case 'EMOJI_NUMBER':
      return {
        ...state,
        emoji: action.number
      }
    case 'ADD_UNOPENED_CRATE':
      return {
        ...state,
        cratesList: action.cratesList
      }
    default:
      return state;
  }
}
