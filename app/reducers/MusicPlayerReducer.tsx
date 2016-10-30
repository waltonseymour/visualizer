import * as React from "react";
import { Song } from "../models/Song";

interface MusicState {
  currentSong: Song;
  player: JSX.Element;
};

let initalSong = {uri: "file:///home/walton/Downloads/Vivian%20Girls%20-%20Where%20Do%20You%20Run%20To.mp3"};

const initialState: MusicState = {
  currentSong: initalSong,
  player: <audio id="music" style={{display: 'none'}} autoPlay src={initalSong.uri}/>
};

let musicPlayer = (state = initialState, action): MusicState => {
  switch (action.type) {
    case "ADD_SONG":
      return Object.assign({}, state, {
        currentSong: action.payload,
        player: <audio id="music" style={{display: 'none'}} autoPlay src={action.payload.uri}/>
      });
    default:
      return state
  }
}

export default musicPlayer;
