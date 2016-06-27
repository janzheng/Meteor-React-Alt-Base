import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

export const PublicNavigation = () => (
  <div>
    <Nav>
      <LinkContainer to="/documents">
        <NavItem eventKey={ 3 } href="/documents">Documents</NavItem>
      </LinkContainer>
      <LinkContainer to="/files">
        <NavItem eventKey={ 4 } href="/files">Files</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
    {/*
      <LinkContainer to="signup">
        <NavItem eventKey={ 1 } href="/signup">Sign Up</NavItem>
      </LinkContainer>
    */}
      <LinkContainer to="login">
        <NavItem eventKey={ 2 } href="login">Log In</NavItem>
      </LinkContainer>
    </Nav>
  </div>
);
