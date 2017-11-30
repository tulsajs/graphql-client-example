import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class PostRow extends Component {
  state = {
    editing: false
  };

  updatePostMutation = () => {
    const { updatePost, post, refetch } = this.props;
    updatePost({
      variables: { id: post.id, title: this.input.value },
      update: (proxy, { data: { updatePost } }) => {
        this.setState({ editing: false });
        refetch();
      }
    });
  };

  deletePostMutation = () => {
    const { deletePost, post, refetch } = this.props;
    deletePost({
      variables: { id: post.id },
      update: (proxy, { data: { deletePost } }) => {
        refetch();
      }
    });
  };

  upvotePostMutation = () => {
    const { upvotePost, post, refetch } = this.props;
    upvotePost({
      variables: { id: post.id },
      update: (proxy, { data: { upvotePost } }) => {
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
    const { post } = this.props;
    return (
      <tr>
        <td>{post.id}</td>
        <td>
          {!this.state.editing ? (
            post.title
          ) : (
            <input
              style={{ height: '30px', width: '100%' }}
              ref={ref => (this.input = ref)}
              type="text"
              defaultValue={post.title}
            />
          )}
        </td>
        <td>{post.user.email}</td>
        <td>{post.votes}</td>
        <td width="250px">
          {!this.state.editing && (
            <Button bsStyle="primary" onClick={this.startEditing}>
              Edit
            </Button>
          )}{' '}
          {!this.state.editing && (
            <Button bsStyle="info" onClick={this.upvotePostMutation}>
              Upvote
            </Button>
          )}{' '}
          {this.state.editing && (
            <Button bsStyle="primary" onClick={this.updatePostMutation}>
              Save
            </Button>
          )}{' '}
          {this.state.editing && (
            <Button bsStyle="warning" onClick={this.stopEditing}>
              Cancel
            </Button>
          )}{' '}
          <Button bsStyle="danger" onClick={this.deletePostMutation}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

const deletePost = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const updatePost = gql`
  mutation updatePost($id: ID!, $title: String!) {
    updatePost(id: $id, title: $title) {
      id
      title
    }
  }
`;

const upvotePost = gql`
  mutation upvotePost($id: ID!) {
    upvotePost(id: $id) {
      id
      title
      votes
    }
  }
`;

export default graphql(deletePost, { name: 'deletePost' })(
  graphql(updatePost, { name: 'updatePost' })(
    graphql(upvotePost, { name: 'upvotePost' })(PostRow)
  )
);
