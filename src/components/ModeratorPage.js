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
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Link } from "react-router-dom";

import './ModeratorPage.scss';
import config from '../custom/config';

import placeholderImage from '../images/logo.svg'

class ModeratorPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDialogTitle: "Are you sure?",
      confirmDialogContent: "",
      confirmDialogHandleCancel: this.handleCancelDialog,
      confirmDialogHandleOk: null,
      confirmDialogOpen: false,
      zoomDialogOpen: false,
      photoSelected: {}
    };
  }

  handleRejectClick = (photo) =>
    () => {
      console.log(photo);
      this.setState({
        confirmDialogContent: `Are you sure you want to reject the photo "${photo.description}" (${photo.id}) ?`,
        confirmDialogHandleOk: this.handleRejectDialogOk(photo.id),
        confirmDialogOpen: true
      });
    };

  handlePhotoClick = (photoSelected) =>
    () => {
      this.setState({zoomDialogOpen:true, photoSelected});
    };

  handleZoomDialogClose = () => {
    this.setState({zoomDialogOpen:false});
  }

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
    this.setState({confirmDialogOpen: false});
    this.handleZoomDialogClose();
  };

  handleApproveDialogOk = (id) => () => {
    config.dbModule.approvePhoto(id);
    this.setState({confirmDialogOpen: false});
    this.handleZoomDialogClose();
  };

  render() {
    return (
      <div className='geovation-moderatorPage'>

        <AppBar position="static">
          <Toolbar>
            <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
              <IconButton color="inherit" aria-label="Home" >
                <ChevronLeftIcon />
              </IconButton>
            </Link>
              Moderate Photos
          </Toolbar>
        </AppBar>

        <div className={"content"}>
          <List dense={false}>
            {this.props.photos.map(photo => (
              <ListItem key={photo.id} button onClick={this.handlePhotoClick(photo)}>
                <Avatar
                 imgProps={{ onError: (e) => { e.target.src=placeholderImage} }}
                 alt={photo.description}
                 src={photo.thumbnail} />
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
        </div>

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

        <Dialog open={this.state.zoomDialogOpen} onClose={this.handleZoomDialogClose}>
          <DialogContent>
            <img onError={(e) => { e.target.src=placeholderImage}} className={"main-image"} alt={this.state.photoSelected.description} src={this.state.photoSelected.main}/>

            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Another Photo
                  </Typography>
                  <Typography component="p">
                    {this.state.photoSelected.description}
                  </Typography>
                  <Typography component="p">
                    Location: {JSON.stringify(this.state.photoSelected.location)}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <IconButton aria-label="Reject" onClick={this.handleRejectClick(this.state.photoSelected)}>
                  <ThumbDownIcon />
                </IconButton>
                <IconButton aria-label="Approve" onClick={this.handleApproveClick(this.state.photoSelected)}>
                  <ThumbUpIcon />
                </IconButton>
              </CardActions>
            </Card>

          </DialogContent>

        </Dialog>
      </div>
    );
  }
}

export default ModeratorPage;
