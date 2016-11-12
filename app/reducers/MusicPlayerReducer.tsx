import * as React from "react";
import { Song } from "../models/Song";

interface MusicState {
  currentSong: Song;
};

let initalSong = {uri: "file:///home/walton/Downloads/Vivian%20Girls%20-%20Where%20Do%20You%20Run%20To.mp3"};

const initialState: MusicState = {
  currentSong: initalSong,
};

let musicPlayer = (state = initialState, action): MusicState => {
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
