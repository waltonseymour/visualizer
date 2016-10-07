import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from 'react-redux'
import { incrementCounter } from "./actions/CounterActions";
import reducer from "./reducers/CounterReducer";
import Counter from "./components/Counter";

let store = createStore(reducer);
let { dispatch } = store;

setInterval(() => {
  dispatch(incrementCounter());
}, 500);

ReactDOM.render(
    <Provider store={store}>
      <Counter/>
    </Provider>,
    document.getElementById("app")
);
