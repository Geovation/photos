import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
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

import './ModeratorPage.scss';
import config from '../custom/config';

class ModeratorPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDialogTitle: "Are you sure?",
      confirmDialogContent: "",
      confirmDialogHandleCancel: this.handleCancelDialog,
      confirmDialogHandleOk: null,
      confirmDialogOpen: false,
      photoDetailsOpen: false,
      photoDetailsId: null
    };
  }

  closePage =() => {
    this.props.closePage();
  };

  handleRejectClick = (photo) =>
    () => {
      console.log(photo);
      this.setState({
        confirmDialogContent: `Are you sure you want to reject the photo "${photo.description}" (${photo.id}) ?`,
        confirmDialogHandleOk: this.handleRejectDialogOk(photo.id),
        confirmDialogOpen: true
    });
  };

  handleApproveClick = (photo) =>
    () => {
      console.log(photo);
      this.setState({
        confirmDialogContent: `Are you sure you want to approve the photo "${photo.description}" (${photo.id}) ?`,
        confirmDialogHandleOk: this.handleApproveDialogOk(photo.id),
        confirmDialogOpen: true
    });
  };

  handleCancelDialog = () => {
    this.setState({confirmDialogOpen: false})
  };

  handleRejectDialogOk = (id) => () => {
    config.dbModule.rejectPhoto(id);
    this.setState({confirmDialogOpen: false})
  };

  handleApproveDialogOk = (id) => () => {
    config.dbModule.approvePhoto(id);
    this.setState({confirmDialogOpen: false})
  };

  handleListItemClick = (photoDetailsId) => () => {
    this.setState({photoDetailsOpen: true, photoDetailsId});
  };

  render() {
    return (
      <div className='geovation-moderatorPage'>

        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Home" onClick={this.closePage}>
              <ChevronLeftIcon />
            </IconButton>
            {/*<Typography variant="h6" color="inherit">*/}
              Photos
            {/*</Typography>*/}
          </Toolbar>
        </AppBar>
        <List dense={false}>
          {this.props.photos.map(photo => (
            <ListItem key={photo.id} button onClick={() => alert(photo)}>
              <Avatar alt={photo.description} src={photo.thumbnail} />
              <ListItemText primary={`${photo.description}`} />
              <ListItemSecondaryAction>
                <IconButton aria-label="Reject" onClick={this.handleRejectClick(photo)}>
                  <ThumbDownIcon />
                </IconButton>
                <IconButton aria-label="Approve" onClick={this.handleApproveClick(photo)}>
                  <ThumbUpIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <PhotoDetails open={this.state.photoDetailsOpen}
          photoId={this.state.photoDetailsId}/>
        <Dialog open={this.state.confirmDialogOpen}>
          <DialogTitle>{this.state.confirmDialogTitle}</DialogTitle>
          <DialogContent>{this.state.confirmDialogContent}</DialogContent>
          <DialogActions>
            <Button onClick={this.state.confirmDialogHandleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.state.confirmDialogHandleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ModeratorPage;
