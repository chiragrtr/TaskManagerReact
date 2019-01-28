import React, { Component } from "react";
class Task extends Component {
  render() {
    return (
      <div
        className="task"
        onMouseOver={this.props.showCloseIcon}
        onMouseOut={this.props.hideCloseIcon}
      >
        <span onClick={this.props.showInputBox}>
          {this.props.taskName || "Click to edit task "}
        </span>
        <div
          className="close hide"
          onClick={() => this.props.deleteTask(this.props.index)}
        >
          x
        </div>
        <input
          className="hide"
          onBlur={this.props.hideInputBox}
          type="text"
          placeholder={this.props.taskName || "Enter task description"}
        />
        <button
          className="hide"
          onClick={e => this.props.saveTask(e, this.props.index)}
        >
          Save
        </button>
      </div>
    );
  }
}

export default Task;
