import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class UserRow extends Component {
  state = {
    editing: false
  };

  updateUserMutation = () => {
    const { updateUser, user, refetch } = this.props;
    updateUser({
      variables: {
        id: user.id,
        email: this.userEmail.value,
        firstName: this.userFirstName.value,
        lastName: this.userLastName.value
      },
      update: (proxy, { data: { updateUser } }) => {
        this.setState({ editing: false });
        refetch();
      }
    });
  };

  deleteUserMutation = () => {
    const { deleteUser, user, refetch } = this.props;
    deleteUser({
      variables: { id: user.id },
      update: (proxy, { data: { deleteUser } }) => {
        this.setState({ editing: false });
        refetch();
      }
    });
  };

  startEditing = () => {
    this.setState({ editing: true });
  };

  stopEditing = () => {
    this.setState({ editing: false });
  };

  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.id}</td>
        <td>
          {!this.state.editing ? (
            user.email
          ) : (
            <input
              style={{ height: '30px', width: '100%' }}
              ref={ref => (this.userEmail = ref)}
              type="text"
              defaultValue={user.email}
            />
          )}
        </td>
        <td>
          {!this.state.editing ? (
            user.firstName
          ) : (
            <input
              style={{ height: '30px', width: '100%' }}
              ref={ref => (this.userFirstName = ref)}
              type="text"
              defaultValue={user.firstName}
            />
          )}
        </td>
        <td>
          {!this.state.editing ? (
            user.lastName
          ) : (
            <input
              style={{ height: '30px', width: '100%' }}
              ref={ref => (this.userLastName = ref)}
              type="text"
              defaultValue={user.lastName}
            />
          )}
        </td>
        <td>{user.posts.length}</td>
        <td width="250px">
          {!this.state.editing && (
            <Button bsStyle="primary" onClick={this.startEditing}>
              Edit
            </Button>
          )}{' '}
          {this.state.editing && (
            <Button bsStyle="primary" onClick={this.updateUserMutation}>
              Save
            </Button>
          )}{' '}
          {this.state.editing && (
            <Button bsStyle="warning" onClick={this.stopEditing}>
              Cancel
            </Button>
          )}{' '}
          <Button bsStyle="danger" onClick={this.deleteUserMutation}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

const deleteUser = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const updateUser = gql`
  mutation updateUser(
    $id: ID!
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    updateUser(
      id: $id
      email: $email
      firstName: $firstName
      lastName: $lastName
    ) {
      id
      email
      firstName
      lastName
    }
  }
`;

const upvoteUser = gql`
  mutation upvoteUser($id: ID!) {
    upvoteUser(id: $id) {
      id
      title
      votes
    }
  }
`;

export default graphql(deleteUser, { name: 'deleteUser' })(
  graphql(updateUser, { name: 'updateUser' })(
    graphql(upvoteUser, { name: 'upvoteUser' })(UserRow)
  )
);
