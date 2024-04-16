import { Component } from "react";
import PropTypes from "prop-types";

class TimeControl extends Component {
  render() {
    return (
      <div className="length-control">
        <div className="title" id={this.props.titleID}>
          {this.props.title}
        </div>
        <button
          className="btn"
          id={this.props.decrementID}
          onClick={this.props.onClick}
          value="-"
        >
          <i className="fa fa-arrow-down fa-2x" />
        </button>
        <div className="btn" id={this.props.lengthID}>
          {String(this.props.length).replace(/-/g, "")}
        </div>
        <button
          className="btn"
          id={this.props.incrementID}
          onClick={this.props.onClick}
          value="+"
        >
          <i className="fa fa-arrow-up fa-2x" />
        </button>
      </div>
    );
  }
}
TimeControl.propTypes = {
  title: PropTypes.string.isRequired,
  titleID: PropTypes.string.isRequired,
  decrementID: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  lengthID: PropTypes.string.isRequired,
  incrementID: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TimeControl;
