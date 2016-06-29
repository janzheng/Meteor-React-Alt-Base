import React from 'react';
import { Grid } from 'react-bootstrap';
import AppNavigation from '../containers/__app-navigation';

export const App = React.createClass({
  renderPage (children) {
    return children;
  },

  render() {
    return <div>
      <AppNavigation />
      <Grid>
        { this.renderPage(this.props.children) }
      </Grid>
    </div>;
  },
});

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};