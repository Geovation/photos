// Profile page to display user details.

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PageWrapper from './PageWrapper';
import './ProfilePage.scss';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  avatar: {
    margin: 10,
    height: 100,
    width: 100
  },
};

class Profile extends React.Component {
  render() {
    const { user, classes } = this.props;
    return (
      <PageWrapper handleClickButton={this.props.handleClose} header={false}>
        <div className={'profile-info'}>
          <Avatar className={classes.avatar} alt='profile-image' src={user.photoURL}/>
          <Typography gutterBottom variant='h5'>{user.displayName}</Typography>
          <Typography component='p'>{user.email}</Typography>
        </div>
      </PageWrapper>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object
};

export default withStyles(styles)(Profile);
