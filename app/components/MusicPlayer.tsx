import * as React from "react";
import * as electron from "electron";
import { connect } from "react-redux";
import { addSong } from "../actions/MusicPlayerActions";
import { Song } from "../models/Song";
import visualizer from "./Visualizer";

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
    dialog.showOpenDialog({
      filters: [{name: 'Music', extensions: ['mp3', 'm4a', 'wav', 'ogg']}]
    },
      (files) => this.props.addSong("file://" + files[0])
    );
  };

  componentDidMount(){
    let v = new visualizer({
      canvasElement: document.getElementById('canvas'),
      musicElement: document.getElementById('music'),
      height: 1200,
      width: 1600
    });

    v.draw();
  }

  render() {
    return (
      <div onClick={this.newSong}>
          {this.props.player}
          <canvas height={1200} width={1600} id="canvas"></canvas>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
