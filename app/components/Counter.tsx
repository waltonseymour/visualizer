import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { decrementCounter } from "../actions/CounterActions";

interface CounterDispatch {
  onClick();
}

interface CounterProps extends CounterDispatch {
  count: number;
}

const mapStateToProps = (state, ownProps): CounterProps => {
  return Object.assign({}, ownProps, {
    count: state.count
  })
}

const mapDispatchToProps = (dispatch): CounterDispatch => {
  return {
    onClick: () => {
      dispatch(decrementCounter());
    }
  }
}

class Counter extends React.Component<CounterProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    let divStyle = {
      color: 'blue',
      fontSize: '50px',
      marginLeft: '50%'
    };
    return <div style={divStyle} onClick={this.props.onClick}>{this.props.count}</div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
