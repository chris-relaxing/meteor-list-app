import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    if (text) {
      Meteor.call('tasks.insert', text);
      // These are the key-value pairs that are getting added to the mongo db
      // Tasks.insert({
      //   text,
      //   createdAt: new Date(), // current time
      //   owner: Meteor.userId(),
      //   username: Meteor.user().username,
      // });
    }


    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div>
        <br/><br/>
        <div className="container">
          <header>
            <h1>Our List</h1>({this.props.incompleteCount} items)
            <label className="hide-completed"><br/><br/>
              <input type="checkbox" readOnly
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Checked
            </label>
            <AccountsUIWrapper />
            </header>
            { this.props.currentUser ?
              <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                <input type="text" ref="textInput" placeholder="Add new list items here" />
              </form> : ''
            }

          <ul>
            {this.renderTasks()}
          </ul>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: {createdAt: -1}}).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);
