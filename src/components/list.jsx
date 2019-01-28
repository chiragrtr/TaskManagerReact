import React, { Component } from "react";
import Task from "./task";
import { DropTarget } from "react-dnd";

const taskTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    const targetListId = props.listId;
    const sourceListId = item.listId;

    if (targetListId === sourceListId) {
      return; // Shouldn't allow drop in the same list.
    }

    const deleteEvent = new Event("deleteTaskFromList");
    deleteEvent.detail = { listId: sourceListId, taskId: item.id };

    const addEvent = new Event("addTaskToList");
    addEvent.detail = { listId: targetListId, taskName: item.taskName };

    window.dispatchEvent(deleteEvent);
    window.dispatchEvent(addEvent);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class List extends Component {
  state = {
    taskNames: []
  };

  componentWillMount = () => {
    this.addListener("deleteTaskFromList");
    this.addListener("addTaskToList");
  };

  addListener = eventName => {
    window.addEventListener(eventName, e => {
      const listId = this.props.listId;
      const eventData = e.detail;
      if (listId === eventData.listId) {
        const taskNames = [...this.state.taskNames];
        eventName === "addTaskToList"
          ? taskNames.push(eventData.taskName)
          : taskNames.splice(eventData.taskId, 1);
        this.setState({ taskNames });
      }
    });
  };

  showCloseIcon = (e, isHeading) => {
    const target = e.target;
    const inputBox = target.closest("input");
    const button = target.closest("button");
    const taskDiv = target.closest("div.task");
    if (inputBox || button || (isHeading && taskDiv)) {
      return;
    }
    const listDiv = target.closest("div.list");
    const parent = isHeading ? listDiv : taskDiv;
    const closeDiv = parent.querySelector("div.close");
    closeDiv.className = "close";
  };

  showCloseIconOnHeading = e => {
    this.showCloseIcon(e, true);
  };

  addHideClassToCloseDiv = parent => {
    const closeDiv = parent.querySelector("div.close");
    closeDiv.className = "close hide";
  };

  hideCloseIcon = e => {
    let parent = e.target.closest("div.task");
    this.addHideClassToCloseDiv(parent);
  };

  hideCloseIconFromHeading = e => {
    let parent = e.target.closest("div.list");
    this.addHideClassToCloseDiv(parent);
  };

  hideInputAndShowElem = (parentNode, selector) => {
    setTimeout(() => {
      const input = parentNode.querySelector("input");
      const element = parentNode.querySelector(selector);
      const button = parentNode.querySelector("button");
      const closeDiv = parentNode.querySelector("div.close");
      closeDiv.className = "close hide";
      input.className = "hide";
      element.className = "show";
      button.className = "hide";
    }, 200);
  };

  hideInputBox = e => {
    const parent = e.target.parentNode;
    this.hideInputAndShowElem(parent, "span");
  };

  hideInputBoxOnHeading = e => {
    const parent = e.target.parentNode;
    this.hideInputAndShowElem(parent, "h5");
  };

  showInputBox = (e, isHeading) => {
    const parentNode = e.target.parentNode;
    const input = parentNode.querySelector("input");
    const element = parentNode.querySelector(isHeading ? "h5" : "span");
    const button = parentNode.querySelector("button");
    element.className = "hide";
    input.className = "show";
    button.className = "show btn btn-sm btn-primary";
    input.focus();
  };

  showInputBoxOnHeading = e => {
    this.showInputBox(e, true);
  };

  deleteTask = index => {
    const taskNames = this.state.taskNames;
    taskNames.splice(index, 1);
    this.setState({ taskNames });
    this.props.onTaskDeletion(this.props.list);
  };

  save = (e, taskIndex) => {
    const isTaskIndexUndefined = taskIndex === undefined;
    const parentNode = e.target.parentNode;
    const input = parentNode.querySelector("input");
    const element = parentNode.querySelector(
      isTaskIndexUndefined ? "h5" : "span"
    );
    const button = parentNode.querySelector("button");
    input.className = "hide";
    element.className = "show";
    button.className = "hide";
    if (isTaskIndexUndefined) {
      element.innerText = input.value;
    } else {
      const taskNames = this.state.taskNames;
      taskNames[taskIndex] = input.value;
      this.setState({ taskNames });
    }
  };

  saveTask = (e, index) => {
    this.save(e, index);
  };

  saveHeading = e => {
    this.save(e);
  };

  render() {
    const { connectDropTarget, isOver, children } = this.props;
    let tasks = [];
    for (let i = 0; i < this.props.list.numOfTasks; i++) {
      tasks.push(
        <Task
          listId={this.props.listId}
          key={i}
          index={i}
          showCloseIcon={this.showCloseIcon}
          hideCloseIcon={this.hideCloseIcon}
          showInputBox={this.showInputBox}
          taskName={this.state.taskNames[i]}
          deleteTask={this.deleteTask}
          hideInputBox={this.hideInputBox}
          saveTask={this.saveTask}
        />
      );
    }

    const addTaskLink = (
      <a
        className="add task"
        key={this.props.list.numOfTasks}
        href="#"
        onClick={() => {
          this.props.onTaskAddition(this.props.list);
          const taskNames = this.state.taskNames;
          this.setState({ taskNames });
        }}
      >
        <span className="icon-add" />
        Click to add task
      </a>
    );

    tasks.push(addTaskLink);

    const list = connectDropTarget(
      <div className="list">
        <div
          className="heading"
          onMouseOver={this.showCloseIconOnHeading}
          onMouseOut={this.hideCloseIconFromHeading}
        >
          <h5 onClick={this.showInputBoxOnHeading}>Click to edit heading</h5>
          <div
            className="close hide"
            onClick={() => this.props.onListDeletion(this.props.list)}
          >
            x
          </div>
          <input
            className="hide"
            onBlur={this.hideInputBoxOnHeading}
            type="text"
            placeholder="Enter List Heading"
          />
          <button className="hide" onClick={this.saveHeading}>
            Save
          </button>
        </div>
        {tasks}
      </div>
    );
    return list;
  }
}

export default DropTarget("task", taskTarget, collect)(List);
