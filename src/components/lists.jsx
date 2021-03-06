import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import List from "./list";

class Lists extends Component {
  state = {
    lists: [{ id: 0, numOfTasks: 3 }, { id: 1, numOfTasks: 2 }]
  };

  componentWillMount = () => {
    this.addListener("deleteTaskFromList");
    this.addListener("addTaskToList");
  };

  componentDidMount = () => {
    const lists = [...this.state.lists];
    this.setState({ lists });
  };

  addListener = eventName => {
    window.addEventListener(eventName, e => {
      const lists = [...this.state.lists];
      const listIndex = lists.findIndex(list => list.id === e.detail.listId);
      eventName === "addTaskToList"
        ? lists[listIndex].numOfTasks++
        : lists[listIndex].numOfTasks--;
      this.setState({ lists });
    });
  };

  handleTaskAddition = list => {
    const lists = [...this.state.lists];
    const index = lists.indexOf(list);
    lists[index].numOfTasks++;
    this.setState({ lists });
  };

  handleTaskDeletion = list => {
    const lists = [...this.state.lists];
    const index = lists.indexOf(list);
    lists[index].numOfTasks--;
    this.setState({ lists });
  };

  handleListDeletion = list => {
    const lists = [...this.state.lists];
    const index = lists.indexOf(list);
    lists.splice(index, 1);
    this.setState({ lists });
  };

  handleListAddition = () => {
    const lists = [...this.state.lists];
    const length = lists.length;
    const id = length ? lists[length - 1].id : -1;
    lists.push({ id: id + 1, numOfTasks: 0 });
    this.setState({ lists });
  };

  render() {
    const lists = this.state.lists.map(list => (
      <List
        listId={list.id}
        key={list.id}
        onTaskAddition={this.handleTaskAddition}
        onTaskDeletion={this.handleTaskDeletion}
        onListDeletion={this.handleListDeletion}
        list={list}
      />
    ));

    lists.push(
      <div className="list" key="-1">
        <a className="add task" href="#" onClick={this.handleListAddition}>
          <span className="icon-add" />
          Click to add a new list
        </a>
      </div>
    );
    return (
      <div className="main">
        <h2>
          <b>Welcome to your Task manager</b>
        </h2>
        <br />
        <div className="lists-container">{lists}</div>
        <br />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Lists);
