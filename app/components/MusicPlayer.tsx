import * as React from "react";
import * as ReactDOM from "react-dom";
import * as electron from "electron";
import { connect } from "react-redux";
import { addSong } from "../actions/MusicPlayerActions";
import { Song } from "../models/Song";

const { dialog } = electron.remote;

interface MusicPlayerDispatch {
  addSong();
}

interface MusicPlayerProps extends MusicPlayerDispatch {
  currentSong: Song;
}

interface MusicPlayerState {
  selectedUri: string;
}

const mapStateToProps = (state, ownProps): MusicPlayerProps => {
  return Object.assign({}, ownProps, {
    currentSong: state.currentSong
  })
}

const mapDispatchToProps = (dispatch): MusicPlayerDispatch => {
  return {
    addSong: () => {
      let s = {
        title: "Where do you run to",
        length: 120,
        artist: "Vivian Girls",
        uri: "file:///home/walton/Downloads/Vivian%20Girls%20-%20Where%20Do%20You%20Run%20To.mp3"
      };
      dispatch(addSong(s));
    }
  }
}

class MusicPlayer extends React.Component<MusicPlayerProps, MusicPlayerState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedUri: ""
    };
  }

  updateUri = (e) => {
    this.setState({
      selectedUri: e.target.value
    });
  };

  render() {
    let divStyle = {
      color: 'black',
      fontSize: '20px'
    };

    return (
      <div style={divStyle} onClick={this.props.addSong}>
          <button onClick={() => dialog.showOpenDialog({}) }> YAY </button>
          {this.state.selectedUri}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
