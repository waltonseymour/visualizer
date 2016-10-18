import { Song } from "../models/Song";

export const addSong = (s: Song) => {
  return {
    type: "ADD_SONG",
    payload: s
  }
}
