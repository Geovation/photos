// Profile page to display user details.

import React from "react";
import PropTypes from "prop-types";

import _ from "lodash";
import loadImage from "blueimp-load-image";

import { Link } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

import RootRef from "@material-ui/core/RootRef";
import { Icon } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import PageWrapper from "./PageWrapper";
import MapLocation from "../types/MapLocation";
import { dbFirebase, authFirebase } from "features/firebase";

const AVATAR_SIZE = 100;
const MAX_AVATAR_SIZE = 512;
const styles = (theme) => ({
  avatar: {
    margin: 10,
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  row: {
    display: "flex",
    width: "100%",
    // padding: `0 ${theme.spacing(2)}px`
  },
  colr: {
    flex: "50%",
    textAlign: "right",
  },
  coll: {
    flex: "50%",
    textAlign: "left",
  },
  centered: {
    textAlign: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px;",
  },
  avatarProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -AVATAR_SIZE/2,
    marginLeft: -AVATAR_SIZE/2,
  }

});

class Profile extends React.Component {

  constructor(props) { 
    super(props);

    this.state = {
      updatingPhoto: false,
      profileImg: null,
    };
    this.domRefInput = {};
  }

  calcUrl(feature) {
    const mapLocation = new MapLocation(
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0],
      this.props.config.ZOOM_FLYTO
    );
    const urlFormated = mapLocation.urlFormated();
    return `${this.props.config.PAGES.displayPhoto.path}/${feature.properties.id}@${urlFormated}`;
  }

  handleAvatarClick = (e) => {
    this.domRefInput.current.click();
  }

  openFile = async (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      this.setState({ updatingPhoto: true });

      try {  
        // reduce and save file 
        const img = await loadImage(
          imageFile,
          {
            canvas: true,
            orientation: true,
            maxWidth: MAX_AVATAR_SIZE,
            maxHeight: MAX_AVATAR_SIZE,
          }
        );

        const imgSrc = img.image.toDataURL("image/jpeg");
        this.setState({
          profileImg: imgSrc
        });
        const base64 = imgSrc.split(",")[1];
        const avatarUrl = await dbFirebase.saveProfilePhoto(this.props.user.id, base64);

        await authFirebase.updateCurrentUser({ photoURL: avatarUrl });

      } catch (e) {
        this.setState({
          profileImg: null
        });
      } finally {
        this.setState({
          updatingPhoto: false,
        });
      }
    } 
  };

  render() {
    const {
      user,
      classes,
      label,
      geojson,
      handlePhotoClick,
      handleClose
    } = this.props;

    const myPhotos =
      geojson &&
      geojson.features.filter((f) => f.properties.owner_id === user.id);
    const myLastPhotos = _.reverse(
      _.sortBy(myPhotos, (o) => o.properties.updated)
    ).slice(0, 20);

    console.log(myLastPhotos);

    const numPieces = _.sumBy(myPhotos, (o) => o.properties.pieces);

    console.log(user);

    return (
      <PageWrapper
        label={label}
        handleClose={handleClose}
        header={false}
      >
        <div className={classes.profileInfo}>

          < div className = { classes.wrapper } >
          
            < IconButton
              onClick={ this.handleAvatarClick }
              disabled = { this.state.updatingPhoto } >
                <Avatar
                  className={classes.avatar}
                  alt="profile-image"
                  src = {
                    this.state.profileImg || user.photoURL
                  }
                  />
            </ IconButton>

            {
              this.state.updatingPhoto &&
              < CircularProgress size = { AVATAR_SIZE } className = { classes.avatarProgress } />
            }
            

          </div>

          <RootRef rootRef = {
              this.domRefInput
            } >
            < input
              className = "hidden"
              type = "file"
              accept = "image/*"
              id = { "fileInput" }
              onChange = { this.openFile }
              onClick = {
                (e) => (e.target.value = null)
              }
            />
          </RootRef>

          <Typography gutterBottom variant="h5">
            {user.displayName} {user.phoneNumber && ` ph: ${user.phoneNumber}`}
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
                Last {myLastPhotos.length} uploaded
              </Typography>

              {_.map(myLastPhotos, (photo) => (
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
                      {photo.properties.updated.toDateString()}
                    </Link>

                    <Icon>
                      {photo.properties.published === true && (
                        <CheckIcon color="secondary" />
                      )}
                      {photo.properties.published === false && (
                        <ClearIcon color="error" />
                      )}
                      {photo.properties.published !== false &&
                        photo.properties.published !== true && (
                          <HourglassEmptyIcon olor="action" />
                        )}
                    </Icon>
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object,
};

export default withStyles(styles)(Profile);