import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { Navigation__Public } from './navigation__public';
import { Navigation__Authenticated } from './navigation__authenticated';

export class AppNavigation extends React.Component {
  renderNavigation(hasUser) {
    return hasUser ? <Navigation__Authenticated /> : <Navigation__Public />;
  }

  render() {
    return <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">HD Buff</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        { this.renderNavigation(this.props.hasUser) }
      </Navbar.Collapse>
    </Navbar>;
  }
}

AppNavigation.propTypes = {
  hasUser: React.PropTypes.object,
};
