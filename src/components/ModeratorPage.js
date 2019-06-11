import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import PageWrapper from './PageWrapper';
import CardComponent from './CardComponent';
import './ModeratorPage.scss';
import dbFirebase from '../dbFirebase';
import config from '../custom/config';

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

class ModeratorPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDialogHandleCancel: this.handleCancelDialog,
      confirmDialogHandleOk: null,
      confirmDialogOpen: false,
      zoomDialogOpen: false,
      photoSelected: {},
      photos: null
    };
  }

  async componentDidMount() {
    this.setState({ photos: await dbFirebase.photosToModerate() });
  }

  handleRejectClick = (photo) => {
    console.log(photo);
    this.setState({
      confirmDialogTitle: `Are you sure you want to reject the photo ?`,
      confirmDialogHandleOk: () => this.handleRejectDialogOk(photo.id),
      confirmDialogOpen: true
    });
  };

  handlePhotoClick = (photoSelected) => {
    this.setState({ zoomDialogOpen: true, photoSelected });
  };

  handleZoomDialogClose = () => {
    this.setState({ zoomDialogOpen: false });
  }

  handleApproveClick = (photo) => {
    console.log(photo);
    this.setState({
      confirmDialogTitle: `Are you sure you want to approve the photo  ?`,
      confirmDialogHandleOk: () => this.handleApproveDialogOk(photo.id),
      confirmDialogOpen: true
    });
  };

  handleCancelDialog = () => {
    this.setState({confirmDialogOpen: false})
  };

  handleRejectDialogOk = async (id) => {
    dbFirebase.rejectPhoto(id,this.props.user.id);
    this.setState({
      confirmDialogOpen: false,
      zoomDialogOpen: false,
      photos: await dbFirebase.photosToModerate()
    });
  };

  handleApproveDialogOk = async (id) => {
    dbFirebase.approvePhoto(id,this.props.user.id);
    this.setState({
      confirmDialogOpen: false,
      zoomDialogOpen: false,
      photos: await dbFirebase.photosToModerate()
    });
  };

  render() {
    const { label, handleClose } = this.props;

    return (
      <PageWrapper label={label} handleClose={handleClose} hasHeader={false}>
        { this.state.photos !== null &&
          <List dense={false}>
            {this.state.photos.map(photo => (
              <ListItem key={photo.id} button onClick={() => this.handlePhotoClick(photo)}>
                <ListItemAvatar>
                  <Avatar
                  imgProps={{ onError: (e) => { e.target.src=placeholderImage} }}
                  src={photo.thumbnail} />
                </ListItemAvatar>
                <ListItemText primary={config.PHOTO_ZOOMED_FIELDS.updated(photo.updated)}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label='Reject' edge={false} onClick={() => this.handleRejectClick(photo)}>
                    <ThumbDownIcon />
                  </IconButton>
                  <IconButton aria-label='Approve' edge={false} onClick={() => this.handleApproveClick(photo)}>
                    <ThumbUpIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        }

        <Dialog open={this.state.confirmDialogOpen}>
          <DialogTitle>{this.state.confirmDialogTitle}</DialogTitle>
          <DialogActions>
            <Button onClick={this.state.confirmDialogHandleCancel} color='secondary'>
              Cancel
            </Button>
            <Button onClick={this.state.confirmDialogHandleOk} color='secondary'>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

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
              handleRejectClick={this.handleRejectClick}
              handleApproveClick={this.handleApproveClick}
            />
          </DialogContent>

        </Dialog>
      </PageWrapper>
    );
  }
}

export default ModeratorPage;
