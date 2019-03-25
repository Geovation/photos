// Profile page to display user details.

import React from 'react';
// import PropTypes from 'prop-types';

// import './ProfilePage.scss';
import { withStyles } from '@material-ui/core/styles';
import SelectControl from './SelectControl';

const styles = {

};

class SelectControlNumbered extends React.Component {
  render() {
    //const { user, classes,label } = this.props;
    return (
      <SelectControl {...this.props}/>
    );
  }
}

// // TODO
// Profile.propTypes = {
//   user: PropTypes.object
// };

export default withStyles(styles)(SelectControlNumbered);
