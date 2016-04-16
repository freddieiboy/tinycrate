
// ACTION CREATORS
export const setEmojiNumber = (num) => {
  return {
    type: 'EMOJI_NUMBER',
    number: num
  }
}

export const setUserData = (data) => {
  return {
    type: 'USER_DATA',
    data: data
  }
}

export const setupCratesList = (data) => {
  return {
    type: 'UNOPENED_CRATES_LIST',
    cratesList: data
  }
}

// REDUCERS + INITITAL STATE
const initialState = {
  emoji: 0,
  data: [],
  cratesList: []
}
export default function crates (state = initialState, action) {
  switch (action.type) {
    case 'EMOJI_NUMBER':
      return {
        ...state,
        emoji: action.number
      }

    case 'USER_DATA':
      return {
        ...state,
        data: action.data
      }
    case 'UNOPENED_CRATES_LIST':
      return {
        ...state,
        cratesList: action.cratesList
      }
    default:
      return state;
  }
}
