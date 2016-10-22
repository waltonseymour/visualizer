import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from 'react-redux'
import reducer from "./reducers/MusicPlayerReducer";
import MusicPlayer from "./components/MusicPlayer";
import visualizer from "./components/Visualizer";

let store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
      <MusicPlayer/>
    </Provider>,
    document.getElementById("app")
);

let v = new visualizer({
  canvasElement: document.getElementById('canvas'),
  musicElement: document.getElementById('music')
});

v.draw();
