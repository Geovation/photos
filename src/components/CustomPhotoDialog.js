// Custom Dialog to choose camera and photo library to interact with cordova-plugin-camera

import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import CancelIcon from '@material-ui/icons/Close';

class CustomPhotoDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { open } = this.props;

    return (
      <Dialog onClose={this.handleClose} open={open}>
        <List>
          <ListItem button onClick={() => this.handleListItemClick('CAMERA')}>
            <IconButton color='primary'>
              <CameraIcon />
            </IconButton>
            <ListItemText primary={'Camera'} />
          </ListItem>
          <ListItem button onClick={() => this.handleListItemClick('PHOTOLIBRARY')}>
            <IconButton color='primary'>
                <PhotoLibraryIcon />
            </IconButton>
            <ListItemText primary={'Photo Library'} />
          </ListItem>
          <ListItem button onClick={this.handleClose}>
            <IconButton>
              <CancelIcon />
            </IconButton>
            <ListItemText primary='Cancel' />
          </ListItem>
        </List>
      </Dialog>
    );
  }
}

CustomPhotoDialog.propTypes = {
  onClose: PropTypes.func
};

export default CustomPhotoDialog;
