import React, { Component } from 'react';
import { Table, Grid, Row, Col, Pagination } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PostRow from '../components/PostRow';
import { skipParam, history } from '../history';
import Loading from '../components/Loading';
class Posts extends Component {
  state = {
    first: 20,
    skip: skipParam() ? skipParam() : 0
  };

  activePage = () => {
    const activePage = this.state.skip / this.state.first;
    return activePage === 0 ? 1 : activePage + 1;
  };

  handlePageClick = eventKey => {
    let skip;
    if (eventKey === 1) {
      skip = 0;
    } else {
      skip = eventKey * this.state.first - this.state.first;
    }
    history.push(`/posts?skip=${skip}`);
    this.setState({ skip: skip });
    this.props.loadMoreEntries(this.state.first, skip, this.filter.value);
  };

  filterList = () => {
    this.setState({ skip: 0 });
    this.props.loadMoreEntries(this.state.first, 0, this.filter.value);
  };

  render() {
    const { posts, postsLength, loadMoreEntries, loading } = this.props;
    if (loading) {
      return <Loading />;
    }

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <label>Search by title</label>{' '}
            <input
              type="text"
              ref={ref => (this.filter = ref)}
              onKeyUp={this.filterList}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>User Email</th>
                  <th>Votes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts &&
                  posts.map((post, index) => (
                    <PostRow
                      post={post}
                      key={index}
                      refetch={() => {
                        return loadMoreEntries(
                          this.state.first,
                          this.state.skip,
                          this.filter.value
                        );
                      }}
                    />
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Pagination
            bsSize="medium"
            items={postsLength && postsLength.length / this.state.first}
            activePage={this.activePage()}
            onSelect={this.handlePageClick}
          />
        </Row>
      </Grid>
    );
  }
}

const getPosts = gql`
  query GetPosts($first: Int, $skip: Int, $title: String) {
    posts(first: $first, skip: $skip, title: $title) {
      id
      title
      votes
      user {
        id
        email
      }
    }
    postsLength(first: $first, skip: $skip, title: $title) {
      length
    }
  }
`;

export default graphql(getPosts, {
  options(props) {
    return {
      variables: {
        skip: skipParam() ? skipParam() : 0,
        first: 20
      },
      fetchPolicy: 'network-only'
    };
  },
  props({ data: { loading, posts, postsLength, fetchMore } }) {
    return {
      loading,
      posts,
      postsLength,
      loadMoreEntries(first, skip, title) {
        return fetchMore({
          variables: {
            first: first,
            skip: skip,
            title: title
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return fetchMoreResult;
          }
        }).catch(e => {
          alert(e);
        });
      }
    };
  }
})(Posts);
