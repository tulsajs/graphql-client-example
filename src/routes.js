import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Users from './containers/Users';
import Posts from './containers/Posts';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Routes extends Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/users">Graphql</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <LinkContainer to="/users">
              <NavItem eventKey={1}>Users</NavItem>
            </LinkContainer>
            <LinkContainer to="/posts">
              <NavItem eventKey={1}>Posts</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
        <Route exact path="/" component={Users} />
        <Route path="/users" component={Users} />
        <Route path="/posts" component={Posts} />
      </div>
    );
  }
}
