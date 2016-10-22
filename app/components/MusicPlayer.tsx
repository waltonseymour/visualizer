import * as React from "react";
import * as ReactDOM from "react-dom";
import * as electron from "electron";
import { connect } from "react-redux";
import { addSong } from "../actions/MusicPlayerActions";
import { Song } from "../models/Song";

const { dialog } = electron.remote;

interface MusicPlayerDispatch {
  addSong(s: string);
}

interface MusicPlayerProps extends MusicPlayerDispatch {
  currentSong: Song;
}

const mapStateToProps = (state, ownProps): MusicPlayerProps => {
  return Object.assign({}, ownProps, {
    currentSong: state.currentSong
  })
}

const mapDispatchToProps = (dispatch): MusicPlayerDispatch => {
  return {
    addSong: (uri: string) => {
      let s = {
        title: "Where do you run to",
        length: 120,
        artist: "Vivian Girls",
        uri: uri
      };
      dispatch(addSong(s));
    }
  }
}

class MusicPlayer extends React.Component<MusicPlayerProps, {}> {
  constructor(props) {
    super(props);
  }

  newSong = () => {
    let filePath = dialog.showOpenDialog({
      filters: [{name: 'Music', extensions: ['mp3']}]
    });
    this.props.addSong("file://" + filePath[0]);
  };

  render() {
    let divStyle = {
      color: 'black',
      fontSize: '20px'
    };

    let player;
    if (this.props.currentSong) {
      player = <audio controls autoPlay src={this.props.currentSong.uri}/>
    } else {
      player = "";
    }

    return (
      <div style={divStyle}>
          <button onClick={this.newSong}> YAY </button>
          {player}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
