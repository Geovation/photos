// Profile page to display user details.

import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import {Link} from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import './ProfilePage.scss';
import PageWrapper from './PageWrapper';
import MapLocation from "../types/MapLocation";

const styles = theme => ({
  avatar: {
    margin: 10,
    height: 100,
    width: 100
  },
  location: {
    margin: '10px 0 10px 0'
  },
  row: {
    display: 'flex',
    width: "100%",
    padding: `0 ${theme.spacing(2)}px`
  },
  colr: {
    flex: "50%",
    textAlign: "right"
  },
  coll: {
    flex: "50%",
    textAlign: "left"
  }
});

class Profile extends React.Component {

  calcUrl(feature) {
    const mapLocation = new MapLocation(feature.geometry.coordinates[1], feature.geometry.coordinates[0], this.props.config.ZOOM_FLYTO);
    const urlFormated = mapLocation.urlFormated();
    return `${this.props.config.PAGES.displayPhoto.path}/${feature.properties.id}@${urlFormated}`;
  }

  render() {
    const { user, classes, label, geojson, config, handlePhotoClick } = this.props;

    const myPhotos = geojson && geojson.features.filter(f => f.properties.owner_id === user.id);
    console.log(myPhotos)
    console.log(user.id)

    const lastApproved = _.maxBy(myPhotos, o => o.properties.moderated);

    const photoUrl = lastApproved && this.calcUrl(lastApproved);
    const numPieces = _.sumBy(myPhotos, o => o.properties.pieces);

    return (
      <PageWrapper label={label} handleClose={this.props.handleClose} header={false}>
        <div className={'profile-info'}>
          <Avatar className={classes.avatar} alt='profile-image' src={user.photoURL}/>
          <Typography gutterBottom variant='h5'>{user.displayName}</Typography>
          <Typography component='p'>{user.email}</Typography>
          <Typography className={classes.location}>{user.location}</Typography>
          <Typography>{user.description}</Typography>

          <br/>

          <Typography variant='h5'>Some stats</Typography>
          { lastApproved &&
            <div className={classes.row}>
              <Typography variant='body1' className={classes.coll}>Last approved on</Typography>
              <Typography variant='body1' className={classes.colr}>
                <Link to={photoUrl} onClick={() => handlePhotoClick(lastApproved)}>{lastApproved.properties.moderated.toDateString()}</Link>
              </Typography>
            </div>
          }
          {myPhotos &&
            <div className={classes.row}>
              <Typography variant='body1' className={classes.coll}>Num. of uploads</Typography>
              <Typography variant='body1' className={classes.colr}>{myPhotos.length}</Typography>
            </div>
          }
          {!isNaN(numPieces) &&
          <div className={classes.row}>
            <Typography variant='body1' className={classes.coll}>Total Pieces</Typography>
            <Typography variant='body1' className={classes.colr}>{numPieces}</Typography>
          </div>
          }


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
