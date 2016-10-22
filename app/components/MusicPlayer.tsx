import * as React from "react";
import * as electron from "electron";
import { connect } from "react-redux";
import { addSong } from "../actions/MusicPlayerActions";
import { Song } from "../models/Song";

const { dialog } = electron.remote;

interface MusicPlayerDispatch {
  addSong(s: string);
}

interface MusicPlayerProps extends MusicPlayerDispatch {
  player: HTMLAudioElement;
}

const mapStateToProps = (state, ownProps): MusicPlayerProps => {
  return Object.assign({}, ownProps, {
    player: state.player
  })
}

const mapDispatchToProps = (dispatch): MusicPlayerDispatch => {
  return {
    addSong: (uri: string) => {
      dispatch(addSong({ uri }));
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

    return (
      <div style={divStyle}>
          <button onClick={this.newSong}> YAY </button>
          {this.props.player}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
