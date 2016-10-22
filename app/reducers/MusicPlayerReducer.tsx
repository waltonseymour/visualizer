import * as React from "react";
import { Song } from "../models/Song";

interface MusicState {
  currentSong: Song;
  player: HTMLAudioElement;
};

const initialState: MusicState = {
  currentSong: null,
  player: null
};

let musicPlayer = (state = initialState, action): MusicState => {
  switch (action.type) {
    case "ADD_SONG":
      return Object.assign({}, state, {
        currentSong: action.payload,
        player: <audio controls autoPlay src={action.payload.uri}/>
      });
    default:
      return state
  }
}

export default musicPlayer;
