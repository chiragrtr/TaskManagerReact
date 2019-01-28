import React, { Component } from "react";
import { DragSource } from "react-dnd";

const taskSource = {
  beginDrag(props) {
    return {
      id: props.index,
      listId: props.listId,
      taskName: props.taskName
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Task extends Component {
  render() {
    const {
      taskName,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    return connectDragSource(
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

export default DragSource("task", taskSource, collect)(Task);
