import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from 'react-redux'
import reducer from "./reducers/MusicPlayerReducer";
import MusicPlayer from "./components/MusicPlayer";

let store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
      <MusicPlayer/>
    </Provider>,
    document.getElementById("app")
);
