
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

export const setReactionEmoji = (emoji) => {
  return {
    type: 'SET_REACTION_EMOJI',
    reactionEmoji: emoji
  }
}

// REDUCERS + INITITAL STATE
const initialState = {
  emoji: 0,
  cratesList: [],
  reactionEmoji: ''
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
    case 'SET_REACTION_EMOJI':
      return {
        ...state,
        reactionEmoji: action.reactionEmoji
      }
    default:
      return state;
  }
}
