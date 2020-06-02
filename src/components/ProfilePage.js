// Profile page to display user details.

import React from "react";
import PropTypes from "prop-types";

import _ from "lodash";

import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import "./ProfilePage.scss";
import PageWrapper from "./PageWrapper";
import MapLocation from "../types/MapLocation";

const styles = theme => ({
  avatar: {
    margin: 10,
    height: 100,
    width: 100
  },
  row: {
    display: "flex",
    width: "100%"
    // padding: `0 ${theme.spacing(2)}px`
  },
  colr: {
    flex: "50%",
    textAlign: "right"
  },
  coll: {
    flex: "50%",
    textAlign: "left"
  },
  centered: {
    textAlign: "center"
  }
});

class Profile extends React.Component {
  calcUrl(feature) {
    const mapLocation = new MapLocation(
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0],
      this.props.config.ZOOM_FLYTO
    );
    const urlFormated = mapLocation.urlFormated();
    return `${this.props.config.PAGES.displayPhoto.path}/${feature.properties.id}@${urlFormated}`;
  }

  render() {
    const { user, classes, label, geojson, handlePhotoClick } = this.props;

    const myPhotos =
      geojson &&
      geojson.features.filter(f => f.properties.owner_id === user.id);
    const myLastPhotos = _.reverse(
      _.sortBy(myPhotos, o => o.properties.moderated)
    ).slice(0, 20);

    console.log(myLastPhotos);

    const numPieces = _.sumBy(myPhotos, o => o.properties.pieces);

    return (
      <PageWrapper
        label={label}
        handleClose={this.props.handleClose}
        header={false}
      >
        <div className={"profile-info"}>
          <Avatar
            className={classes.avatar}
            alt="profile-image"
            src={user.photoURL}
          />
          <Typography gutterBottom variant="h5">
            {user.displayName}
          </Typography>
          <Typography component="p">{user.email}</Typography>
          <Typography>{user.location}</Typography>
          <Typography>{user.description}</Typography>

          <br />

          {myPhotos && (
            <Typography variant="body1">
              Num. of uploads <strong>{myPhotos.length}</strong>
            </Typography>
          )}
          {!isNaN(numPieces) && (
            <Typography variant="body1">
              Total Pieces <strong>{numPieces}</strong>
            </Typography>
          )}

          <br />

          {myLastPhotos.length && (
            <div>
              <Typography variant="h6" className={classes.centered}>
                Last {myLastPhotos.length} approved
              </Typography>

              {_.map(myLastPhotos, photo => (
                <div className={classes.centered} key={photo.properties.id}>
                  <Typography variant="body1">
                    {photo.properties.pieces && (
                      <span>
                        <strong>{photo.properties.pieces}</strong> pieces{" "}
                      </span>
                    )}
                    <Link
                      to={this.calcUrl(photo)}
                      onClick={() => handlePhotoClick(photo)}
                    >
                      {photo.properties.moderated.toDateString()}
                    </Link>
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
        {/*{ config.ENABLE_GRAVATAR_PROFILES &&*/}
        {/*  <div className={'link'}>*/}
        {/*    { user.profileURL ?*/}
        {/*      <p>*/}
        {/*        {'To change these information, please update your '}*/}
        {/*        <a href={user.profileURL}*/}
        {/*          target='_blank'*/}
        {/*          rel="noopener noreferrer">*/}
        {/*          Gravatar Account*/}
        {/*        </a>*/}
        {/*      </p>*/}
        {/*    :*/}
        {/*      <p>*/}
        {/*        {'To change these information, please create a '}*/}
        {/*        <a href='https://en.gravatar.com/connect/?source=_signup'*/}
        {/*          target='_blank'*/}
        {/*          rel="noopener noreferrer">*/}
        {/*          Gravatar Account*/}
        {/*        </a>*/}
        {/*      </p>*/}
        {/*    }*/}
        {/*  </div>*/}
        {/*}*/}
      </PageWrapper>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object
};

export default withStyles(styles)(Profile);
