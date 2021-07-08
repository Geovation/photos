// Profile page to display user details.

import React, { createRef, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import _ from "lodash";
import loadImage from "blueimp-load-image";

import CircularProgress from "@material-ui/core/CircularProgress";
import RootRef from "@material-ui/core/RootRef";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

import PageWrapper from "./PageWrapper";
import { dbFirebase, authFirebase } from "features/firebase";
import User from "types/User";

import config from "custom/config";

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
    position: "relative",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px;",
  },
  avatarProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -AVATAR_SIZE / 2,
    marginLeft: -AVATAR_SIZE / 2,
  },
  name: {
    fontSize: "1.6em",
  },
  textProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -10,
    marginLeft: -10,
  },
});

const mapStateToProps = state => ({
  user: state.user,
  geojson: state.geojson
});

const ProfileTextField = connect(mapStateToProps)(withStyles(styles)(function (props) {
  const { user, className, fieldName, classes, maxLength, placeholder } = props;
  const originalFieldValue = user[fieldName] || "";

  const [updating, setUpdating] = useState(false);
  const [fieldValue, setFieldValue] = useState(originalFieldValue);

  const onBlur = async (event) => {
    console.log(fieldValue);
    console.log(originalFieldValue === fieldValue);
    const trimmedOld = _.trim(originalFieldValue);
    const trimmedNew = _.trim(fieldValue);
    if (trimmedOld !== trimmedNew) {
      setUpdating(true);

      try {
        const fields = {};
        fields[fieldName] = fieldValue;
        await dbFirebase.updateProfile(fields);
        await authFirebase.updateCurrentUser(fields);
      } catch (error) {
        setFieldValue(trimmedOld);
      } finally {
        setUpdating(false);
      }
    }
  };

  const onChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setFieldValue(newValue);
  };

  return (
    <span className={classes.wrapper}>
      <InputBase
        disabled={updating}
        value={fieldValue}
        placeholder={placeholder}
        className={className}
        inputProps={{ style: { textAlign: "center" }, maxLength: maxLength }}
        onChange={onChange}
        onBlur={onBlur}
      />
      {updating && <CircularProgress size={20} className={classes.textProgress} />}
    </span>
  );
}));

function Profile({ user, classes, geojson, handleClose }) {

  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [profileImg, setProfileImg] = useState();

  const domRefInput = createRef();

  const handleAvatarClick = (e) => {
    domRefInput.current.click();
  };

  const openFile = async (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setUpdatingPhoto(true);

      try {
        // reduce and save file
        const img = await loadImage(imageFile, {
          canvas: true,
          orientation: true,
          maxWidth: MAX_AVATAR_SIZE,
          maxHeight: MAX_AVATAR_SIZE,
        });

        const imgSrc = img.image.toDataURL("image/jpeg");
        setProfileImg(imgSrc);

        const base64 = imgSrc.split(",")[1];
        const avatarUrl = await dbFirebase.saveProfileAvatar(base64);
        await authFirebase.updateCurrentUser({ photoURL: avatarUrl });
      } catch (e) {
        setProfileImg(null);
      } finally {
        setUpdatingPhoto(false);
      }
    }
  };

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
      label={config.PAGES.account.label}
      handleClose={handleClose}
      header={false}
    >
      <div className={classes.profileInfo}>
        <div className={classes.wrapper}>
          <IconButton
            onClick={handleAvatarClick}
            disabled={updatingPhoto}
          >
            <Avatar
              className={classes.avatar}
              alt="profile-image"
              src={profileImg || user.photoURL}
            />
          </IconButton>

          {updatingPhoto && (
            <CircularProgress
              size={AVATAR_SIZE}
              className={classes.avatarProgress}
            />
          )}
        </div>

        <RootRef rootRef={domRefInput}>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            id={"fileInput"}
            onChange={openFile}
            onClick={(e) => (e.target.value = null)}
          />
        </RootRef>

        <ProfileTextField
          fieldName="displayName"
          className={classes.name}
          maxLength={User.DISPLAY_NAME_MAXLENGTH}
          placeholder="My name"
        />

        <Typography gutterBottom variant="h5">
          {user.phoneNumber && ` ph: ${user.phoneNumber}`}
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
      </div>
    </PageWrapper>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
};

export default connect(mapStateToProps)(withStyles(styles)(Profile));
