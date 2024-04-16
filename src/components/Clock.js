import { Component } from "react";
import TimeControl from "./TimeControl";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      secondsLeft: 0,
      color: { color: "white" },
      timerType: "Session",
      timerId: "",
      timerSession: 25,
      timerBreak: 5,
      running: false,
    };
    this.handleBrkLength = this.handleBrkLength.bind(this);
    this.play = this.play.bind(this);
    this.handleSesLength = this.handleSesLength.bind(this);
    this.currentTime = this.currentTime.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.reset = this.reset.bind(this);
    this.decrementSessionTime = this.decrementSessionTime.bind(this);
    this.handleRunning = this.handleRunning.bind(this);
  }
  handleRunning(currentState) {
    this.setState({
      running: currentState,
    });
  }
  handleBrkLength(e) {
    if (!this.state.running) {
      const id = e.target.id !== "" ? e.target.id : e.target.parentNode.id;
      if (this.state.breakLength > 1 && id === "break-decrement") {
        this.setState((state) => ({
          breakLength: state.breakLength - 1,
          timerBreak: state.timerBreak - 1,
        }));
      }
      if (this.state.breakLength < 60 && id === "break-increment") {
        this.setState((state) => ({
          breakLength: state.breakLength + 1,
          timerBreak: state.timerBreak + 1,
        }));
      }
    }
  }
  handleSesLength(e) {
    if (!this.state.running) {
      const id = e.target.id !== "" ? e.target.id : e.target.parentNode.id;
      if (this.state.sessionLength > 1 && id === "session-decrement") {
        this.setState((state) => ({
          sessionLength: state.sessionLength - 1,
          timerSession: state.timerSession - 1,
        }));
      }
      if (this.state.sessionLength < 60 && id === "session-increment") {
        this.setState((state) => ({
          sessionLength: state.sessionLength + 1,
          timerSession: state.timerSession + 1,
        }));
      }
    }
  }
  currentTime() {
    const padZero = (num) => (num < 10 ? `0${num}` : num);
    const time =
      this.state.timerType === "Session"
        ? this.state.timerSession
        : this.state.timerBreak;
    return `${padZero(time)}:${padZero(this.state.secondsLeft)}`;
  }
  decrementSessionTime() {
    if (this.state.timerType === "Session") {
      if (this.state.timerSession === 0) {
        this.play();
        this.setState((state) => ({
          timerType: "Break",
          timerSession: state.sessionLength,
          secondsLeft: 0,
          timerBreak: state.breakLength,
        }));
      } else {
        this.setState((state) => ({
          timerSession: state.timerSession - 1,
        }));
      }
    } else {
      if (this.state.timerBreak === 0) {
        this.play();
        this.setState((state) => ({
          timerType: "Session",
          timerBreak: state.breakLength - 1,
          secondsLeft: 0,
          timerSession: state.sessionLength,
        }));
      } else {
        this.setState((state) => ({
          timerBreak: state.timerBreak - 1,
        }));
      }
    }
  }
  timerControl() {
    const decrementSeconds = (fn) => {
      this.handleRunning(true);
      if (this.state.secondsLeft === 0) {
        fn();
        this.setState({
          secondsLeft: 59,
        });
      } else {
        if (this.state.secondsLeft === 59) {
          if (
            this.state.timerType === "Session" &&
            this.state.timerSession === this.state.sessionLength
          )
            fn();
          if (
            this.state.timerType === "Break" &&
            this.state.timerBreak === this.state.breakLength
          )
            fn();
        }
        this.setState((state) => ({
          secondsLeft: state.secondsLeft - 1,
        }));
      }
    };
    if (this.state.timerId === "") {
      this.setState({
        timerId: setInterval(() => {
          decrementSeconds(this.decrementSessionTime);
        }, 1000),
      });
    } else {
      clearInterval(this.state.timerId);
      this.setState({
        timerId: "",
        running: false,
      });
    }
  }
  play() {
    const deepElement = document.getElementById("beep");
    deepElement.play();
    this.playTimeout = setTimeout(() => {
      deepElement.pause();
      deepElement.currentTime = 0;
    }, 2000);
  }
  reset() {
    clearInterval(this.state.timerId);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      secondsLeft: 0,
      color: { color: "white" },
      timerType: "Session",
      timerId: "",
      timerSession: 25,
    });
  }
  render() {
    return (
      <div className="container">
        <h1 className="title">Session timer control</h1>
        <TimeControl
          incrementID="break-increment"
          length={this.state.breakLength}
          lengthID="break-length"
          decrementID="break-decrement"
          onClick={this.handleBrkLength}
          title="Break Length"
          titleID="break-label"
        />
        <TimeControl
          incrementID="session-increment"
          length={this.state.sessionLength}
          lengthID="session-length"
          decrementID="session-decrement"
          onClick={this.handleSesLength}
          title="Session Length"
          titleID="session-label"
        />
        <div className="timer" style={this.state.color}>
          <div className="timer-wrap">
            <div id="timer-label">{this.state.timerType}</div>
            <div id="time-left">{this.currentTime()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button className="btn" id="start_stop" onClick={this.timerControl}>
            <i className="fa fa-play fa-2x" />
            <i className="fa fa-pause fa-2x" />
          </button>
          <button className="btn" id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x" />
          </button>
        </div>
        <audio controls id="beep">
          <track
            kind="captions"
            src="captions.vtt"
            srcLang="en"
            label="English"
          />
          <source
            src="https://bigsoundbank.com/UPLOAD/ogg/0035.ogg"
            type="audio/ogg"
          />
        </audio>
      </div>
    );
  }
}
export default Clock;
