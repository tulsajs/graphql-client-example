import React, { Component } from 'react';
import { Table, Grid, Row, Col, Pagination } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserRow from '../components/UserRow';
import { skipParam, history } from '../history';

class Users extends Component {
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
    history.push(`${history.location.pathname}?skip=${skip}`);
    this.setState({ skip: skip });
    this.props.loadMoreEntries(
      this.state.first,
      skip,
      this.filterKey.value,
      this.filterValue.value
    );
  };

  filterList = () => {
    this.setState({ skip: 0 });
    this.props.loadMoreEntries(
      this.state.first,
      0,
      this.filterKey.value,
      this.filterValue.value
    );
  };

  clearInput = () => {
    this.filterValue.value = '';
    this.props.loadMoreEntries(this.state.first, this.state.skip);
  };

  render() {
    const { users, usersLength, loadMoreEntries, loading } = this.props;
    if (loading) {
      return (
        <Grid>
          <Row>
            <Col xs={12}>
              <div>Loading...</div>
            </Col>
          </Row>
        </Grid>
      );
    }

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <label>Search by </label>{' '}
            <select
              onChange={this.clearInput}
              ref={ref => (this.filterKey = ref)}>
              <option value="email">email</option>
              <option value="firstName">first name</option>
              <option value="lastName">last name</option>
            </select>
            <input
              type="text"
              ref={ref => (this.filterValue = ref)}
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
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Post Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user, index) => (
                    <UserRow
                      user={user}
                      key={index}
                      refetch={() => {
                        return loadMoreEntries(
                          this.state.first,
                          this.state.skip,
                          this.filterKey.value,
                          this.filterValue.value
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
            items={usersLength && usersLength.length / this.state.first}
            activePage={this.activePage()}
            onSelect={this.handlePageClick}
          />
        </Row>
      </Grid>
    );
  }
}

const getUsers = gql`
  query GetPosts(
    $first: Int
    $skip: Int
    $email: String
    $firstName: String
    $lastName: String
  ) {
    users(
      first: $first
      skip: $skip
      email: $email
      firstName: $firstName
      lastName: $lastName
    ) {
      id
      email
      firstName
      lastName
      posts {
        id
      }
    }
    usersLength(
      first: $first
      skip: $skip
      email: $email
      firstName: $firstName
      lastName: $lastName
    ) {
      length
    }
  }
`;

export default graphql(getUsers, {
  options(props) {
    return {
      variables: {
        skip: skipParam() ? skipParam() : 0,
        first: 20
      },
      fetchPolicy: 'network-only'
    };
  },
  props({ data: { loading, users, usersLength, fetchMore } }) {
    return {
      loading,
      users,
      usersLength,
      loadMoreEntries(first, skip, filterKey, filterValue) {
        return fetchMore({
          variables: {
            first: first,
            skip: skip,
            [filterKey]: filterValue
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return fetchMoreResult;
          }
        });
      }
    };
  }
})(Users);
