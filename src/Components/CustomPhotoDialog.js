// Custom Dialog to choose camera and photo library to interact with cordova-plugin-camera

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import CancelIcon from '@material-ui/icons/Close';
import blue from '@material-ui/core/colors/blue';

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class PhotoDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, open } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby='simple-dialog-title' open={open}>
        <div>
          <List>
            <ListItem button onClick={() => this.handleListItemClick('CAMERA')}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <CameraIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={'Camera'} />
            </ListItem>
            <ListItem button onClick={() => this.handleListItemClick('PHOTOLIBRARY')}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PhotoLibraryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={'Photo Library'} />
            </ListItem>
            <ListItem button onClick={this.handleClose}>
              <ListItemAvatar>
                <Avatar>
                  <CancelIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Cancel' />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}

PhotoDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

const CustomPhotoDialog = withStyles(styles)(PhotoDialog);

export default CustomPhotoDialog;
