const initialState = {
  currentSong: null
};

function musicPlayer(state = initialState, action) {
  switch (action.type) {
    case "ADD_SONG":
      return Object.assign({}, state, {
        currentSong: action.payload
      });
    default:
      return state
  }
}

export default musicPlayer;
