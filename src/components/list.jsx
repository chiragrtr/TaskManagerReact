import React, { Component } from "react";
class List extends Component {
  state = {
    taskNames: []
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
    }, 100);
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
    button.className = "show";
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
    let tasks = [];
    for (let i = 0; i < this.props.list.numOfTasks; i++) {
      tasks.push(
        <div
          className="task"
          key={i}
          onMouseOver={this.showCloseIcon}
          onMouseOut={this.hideCloseIcon}
        >
          <span onClick={this.showInputBox}>
            {this.state.taskNames[i] || "Click to edit task "}
          </span>
          <div className="close hide" onClick={() => this.deleteTask(i)}>
            x
          </div>
          <input
            className="hide"
            onBlur={this.hideInputBox}
            type="text"
            placeholder={this.state.taskNames[i] || "Enter task description"}
          />
          <button className="hide" onClick={e => this.saveTask(e, i)}>
            Save
          </button>
        </div>
      );
    }

    const addTaskLink = (
      <a
        className="add task"
        key={this.props.list.numOfTasks}
        href="#"
        onClick={() => this.props.onTaskAddition(this.props.list)}
      >
        <span className="icon-add" />
        Click to add task
      </a>
    );

    tasks.push(addTaskLink);

    const list = (
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

export default List;
