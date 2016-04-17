// ACTIONS
export const openActionBar = () => {
  return {
    type: 'OPEN_ACTION_BAR',
    isOpened: true,
    isCreatingCrate: true
  }
}

export const closeActionBar = () => {
  return {
    type: 'CLOSE_ACTION_BAR',
    isOpened: false,
    isCreatingCrate: false,
    isSelectingUsers: false
  }
}

export const selectGiftees = () => {
  return {
    type: 'SELECTING_GIFTEES',
    isCreatingCrate: false,
    isSelectingUsers: true
  }
}

export const editNewCrate = () => {
  return {
    type: 'EDIT_NEW_CRATE',
    isCreatingCrate: true,
    isSelectingUsers: false
  }
}

export const selectCrateColor = (color) => {
  return {
    type: 'SELECT_CRATE_COLOR',
    newCrateColor: color
  }
}

export const getBtnPosition = (position) => {
  return {
    type: 'MAIN_BUTTON_POSITION',
    mainButtonPosition: position
  }
}

export const getBtnWidth = (width) => {
  return {
    type: 'MAIN_BUTTON_WIDTH',
    mainButtonWidth: width
  }
}

export const addNewCrateText = (text) => {
  return {
    type: 'ADD_NEW_CRATE_TEXT',
    newCrateText: text
  }
}

export const addNewCratePhoto = (url) => {
  return {
    type: 'ADD_NEW_CRATE_PHOTO',
    newCratePhoto: url
  }
}

export const loadSubscribers = (obj) => {
  return {
    type: 'LOAD_SUBSCRIBERS',
    subscribers: obj
  }
}

export const newGiftee = (uid) => {
  return {
    type: 'NEW_GIFTEE',
    giftee: uid
  }
}

export const removeGiftee = (uid) => {
  return {
    type: 'REMOVE_GIFTEE',
    giftee: uid
  }
}

export const flushNewCrateState = () => {
  return {
    type: 'FLUSH_NEW_CRATE_STATE',
    isOpened: false,
    isCreatingCrate: false,
    isSelectingUsers: false,
    newCratePhoto: '',
    newCrateText: '',
    giftee: ''
  }
}

export const hideActionBar = () => {
  return {
    type: 'HIDE_ACTION_BAR',
    isHidden: true
  }
}

export const showActionBar = () => {
  return {
    type: 'SHOW_ACTION_BAR',
    isHidden: false
  }
}

const initialState = {
  isHidden: true,
  isOpened: false,
  isCreatingCrate: false,
  isSelectingUsers: false,
  mainButtonPosition: 0,
  mainButtonWidth: 0,
  newCrateColor: '',
  newCrateText: '',
  newCratePhoto: '',
  subscribers: {},
  giftee: []
}

export default function NewCrates (state = initialState, action) {
  switch (action.type) {
    case 'OPEN_ACTION_BAR':
      return {
        ...state,
        isOpened: action.isOpened,
        isCreatingCrate: action.isCreatingCrate
      }
    case 'CLOSE_ACTION_BAR':
      return {
        ...state,
        isOpened: action.isOpened,
        isCreatingCrate: action.isCreatingCrate,
        isSelectingUsers: action.isSelectingUsers
      }
    case 'SELECTING_GIFTEES':
      return {
        ...state,
        isCreatingCrate: action.isCreatingCrate,
        isSelectingUsers: action.isSelectingUsers
      }
    case 'EDIT_NEW_CRATE':
      return {
        ...state,
        isCreatingCrate: action.isCreatingCrate,
        isSelectingUsers: action.isSelectingUsers
      }
    case 'SELECT_CRATE_COLOR':
      return {
        ...state,
        newCrateColor: action.newCrateColor
      }
    case 'MAIN_BUTTON_POSITION':
      return {
        ...state,
        mainButtonPosition: action.mainButtonPosition
      }
    case 'MAIN_BUTTON_WIDTH':
      return {
        ...state,
        mainButtonWidth: action.mainButtonWidth
      }
    case 'ADD_NEW_CRATE_TEXT':
      return {
        ...state,
        newCrateText: action.newCrateText
      }
    case 'ADD_NEW_CRATE_PHOTO':
      return {
        ...state,
        newCratePhoto: action.newCratePhoto
      }
    case 'LOAD_SUBSCRIBERS':
      return {
        ...state,
        subscribers: action.subscribers
      }
    case 'NEW_GIFTEE':
      return {
        ...state,
        giftee: [
          ...state.giftee,
          action.giftee
        ]
      }
    case 'REMOVE_GIFTEE':
      const index = state.giftee.indexOf(action.giftee);
      return {
        ...state,
       giftee: [
         ...state.giftee.slice(0, index),
         ...state.giftee.slice(index + 1)
       ]
      }
    case 'FLUSH_NEW_CRATE_STATE':
      return {
        ...state,
        isOpened: action.isOpened,
        isCreatingCrate: action.isCreatingCrate,
        isSelectingUsers: action.isSelectingUsers,
        newCratePhoto: action.newCratePhoto,
        newCrateText: action.newCrateText,
        giftee: action.giftee
      }
    case 'HIDE_ACTION_BAR':
      return {
        ...state,
        isHidden: action.isHidden
      }
    case 'SHOW_ACTION_BAR':
      return {
        ...state,
        isHidden: action.isHidden
      }
    default:
      return state;
  }
}
