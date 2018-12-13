// Profile page to display user details.

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import './ProfilePage.scss';

class Profile extends React.Component {

  handleClickButton = () => {
    // To control if click the button from tutorial page or welcome page
    if (this.props.location.pathname === this.props.pages.account.path) {
      this.props.history.push(this.props.pages.map.path); // go to the map
    } else {
      this.props.handleWelcomePageClose(); // close the welcome page
    }
  };

  render() {
    const { user } = this.props;
    return (
      <div className='geovation-profile'>
        <div className='profile-info'>
          <Avatar alt='profile-image' src={user.photoURL} className='avatar' />
          <Typography gutterBottom variant='h5'>{user.displayName}</Typography>
          <Typography component='p'>{user.email}</Typography>
        </div>
        <Button
          className={'button'}
          variant='contained'
          color='primary'
          onClick={this.handleClickButton}
        >
          Get Collecting
        </Button>
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object
};

export default Profile;
