import React from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import CloudUpload from "@material-ui/icons/CloudUpload"
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { Icon } from "@material-ui/core";

import _ from "lodash";

import PageWrapper from "./PageWrapper";
import config from "custom/config";
import { dbFirebase } from "features/firebase";

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const OwnPhotosPage = (props) => {
  const label = config.PAGES.ownPhotos.label;
  
  function createAction(photo) {
    // the icon depends on the status
    if (dbFirebase.getUploadProgress(photo.properties.id) < 100) {
      // still being uploaded
      // TODO: display progress
      // TODO: add cancell button
      return (
        <Icon>
          <CloudUpload color="error" />
        </Icon>
      );
    } else if (photo.properties.published === false) {
      // rejected
      return (
        <Icon>
          <ClearIcon color="error" />
        </Icon>
      );
    } else if (photo.properties.published === true) {
      // approved
      return (
        <Icon>
          <CheckIcon color="secondary" />
        </Icon>
      );
    } else {
      // waiting for moderation
      return (
        <Icon>
          <HourglassEmptyIcon color="action" />
        </Icon>
      );
    }
  }

  function createThumbnail(photo) {    
    return dbFirebase.getUploadingPhoto(photo.properties.id, photo.properties.thumbnail);
  }

  function createUpdated(photo) {
    const progress = dbFirebase.getUploadProgress(photo.properties.id);
    return progress < 100
      ? `${progress} %`
      : config.PHOTO_ZOOMED_FIELDS.updated(photo.properties.updated);
  }

  return (
    <PageWrapper
      label={label}
      handleClose={props.handleClose}
      hasHeader={false}
    >
      <List dense={false}>
        {_.map(props.photos, (photo) => (
          <ListItem
            key={photo.properties.id}
            button
            onClick={() => props.handlePhotoClick(photo)}
          >
            <ListItemAvatar>
              <Avatar
                imgProps={{
                  onError: (e) => {
                    e.target.src = placeholderImage;
                  },
                }}
                src={createThumbnail(photo)}
              />
            </ListItemAvatar>
            <ListItemText primary={createUpdated(photo)} />
            <ListItemSecondaryAction>
              {createAction(photo)}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </PageWrapper>
  );
};

export default OwnPhotosPage;