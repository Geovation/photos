import React, { Component } from 'react';

import _ from "lodash";

import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import PageWrapper from './PageWrapper';
import CardComponent from './CardComponent';
import './ModeratorPage.scss';
import config from '../custom/config';

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

class ModeratorPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDialogHandleCancel: this.handleCancelDialog,
      confirmDialogHandleOk: null,
      zoomDialogOpen: false,
      photoSelected: {}
    };
  }

  handlePhotoClick = (photoSelected) => {
    this.setState({ zoomDialogOpen: true, photoSelected });
  };

  handleZoomDialogClose = () => {
    this.setState({ zoomDialogOpen: false });
  }

  handleCancelDialog = () => {
    this.setState({confirmDialogOpen: false})
  };

  render() {
    const { label, handleClose, photos } = this.props;

    return (
      <PageWrapper label={label} handleClose={handleClose} hasHeader={false}>
        <List dense={false}>
          {_.map(photos, photo => (
            <ListItem key={photo.id} button onClick={() => this.handlePhotoClick(photo)}>
              <ListItemAvatar>
                <Avatar
                imgProps={{ onError: (e) => { e.target.src=placeholderImage} }}
                src={photo.thumbnail} />
              </ListItemAvatar>
              <ListItemText primary={config.PHOTO_ZOOMED_FIELDS.updated(photo.updated)}/>
              <ListItemSecondaryAction>
                <IconButton aria-label='Reject' edge={false} onClick={() => this.props.handleRejectClick(photo)}>
                  <ThumbDownIcon />
                </IconButton>
                <IconButton aria-label='Approve' edge={false} onClick={() => this.props.handleApproveClick(photo)}>
                  <ThumbUpIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Dialog open={this.state.zoomDialogOpen} onClose={this.handleZoomDialogClose}>
          <DialogContent>
            <div style={{ textAlign: 'center' }}>
              <img className={'main-image'}
                onError={(e) => { e.target.src=placeholderImage}}
                alt={this.state.photoSelected.id}
                src={this.state.photoSelected.main}
              />
            </div>
            <CardComponent
              photoSelected={this.state.photoSelected}
              handleRejectClick={this.props.handleRejectClick}
              handleApproveClick={this.props.handleApproveClick}
            />
          </DialogContent>

        </Dialog>
      </PageWrapper>
    );
  }
}

export default ModeratorPage;
