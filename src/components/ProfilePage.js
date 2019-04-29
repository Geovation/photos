// Profile page to display user details.

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PageWrapper from './PageWrapper';
import './ProfilePage.scss';
import { withStyles } from '@material-ui/core/styles';
import config from '../custom/config'

const styles = {
  avatar: {
    margin: 10,
    height: 100,
    width: 100
  },
  location: {
    margin: '10px 0 10px 0'
  }
};

class Profile extends React.Component {
  render() {
    const { user, classes,label } = this.props;

    return (
      <PageWrapper label={label} handleClose={this.props.handleClose} header={false}>
        <div className={'profile-info'}>
          <Avatar className={classes.avatar} alt='profile-image' src={user.photoURL}/>
          <Typography gutterBottom variant='h5'>{user.displayName}</Typography>
          <Typography component='p'>{user.email}</Typography>
          <Typography className={classes.location}>{user.location}</Typography>
          <Typography>{user.description}</Typography>
        </div>
        { config.ENABLE_GRAVATAR_PROFILES &&
          <div className={'link'}>
            { user.profileURL ?
              <p>
                {'To change these information, please update your '}
                <a href={user.profileURL}
                  target='_blank'
                  rel="noopener noreferrer">
                  Gravatar Account
                </a>
              </p>
            :
              <p>
                {'To change these information, please create a '}
                <a href='https://en.gravatar.com/connect/?source=_signup'
                  target='_blank'
                  rel="noopener noreferrer">
                  Gravatar Account
                </a>
              </p>
            }
          </div>
        }
      </PageWrapper>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object
};

export default withStyles(styles)(Profile);
