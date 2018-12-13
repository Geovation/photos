// Profile page to display user details.

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import './ProfilePage.scss';

class Profile extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div className='geovation-profile'>
        <Avatar alt="profile-image" src={user.photoURL} className="avatar" />
        <Typography gutterBottom variant="h5">{user.displayName}</Typography>
        <Typography component="p">{user.email}</Typography>
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object
};

export default Profile;
