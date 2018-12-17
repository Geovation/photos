// Profile page to display user details.

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import config from '../custom/config';
import './ProfilePage.scss';

class Profile extends React.Component {

  handleClickButton = () => {
    this.props.goToPage(config.PAGES.map); // go to the map
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
        <div className='button'>
          <Button color='secondary' variant="contained" fullWidth={true} onClick={this.handleClickButton}>
            Get Collecting
          </Button>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object
};

export default Profile;
