// let the user write a feedback.

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import dbFirebase from '../dbFirebase';

const styles = theme => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center'
  },
  closeIcon: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end'
  },
  subtitle: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3
  },
  content: {
    width: '80%',
    marginTop: theme.spacing.unit * 2
  },
  button: {
    width: '80%',
    marginTop: theme.spacing.unit * 3
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
});

class WriteFeedbackPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      isEmptyMsg: true
    };
  }

  handleChange = (event) => {
    this.setState({
      isEmptyMsg: !event.target.value,
      feedback: event.target.value
    });
  }

  sendFeedback = () => {
    this.setState({ sending: true });
    dbFirebase.writeFeedback({
      content: this.state.feedback,
      location: {
        latitude: this.props.location.latitude,
        longitude: this.props.location.longitude
      }
    }).then(res => {
      this.setState({ sending: false });
      this.props.handleClose();
    }).catch(err => {
      console.log("error: ", err);
      this.setState({ sending: false });
    });
  }

  render() {
    const { classes, handleClose } = this.props;

    return (
        <div className={classes.container}>
          <AppBar position='static'>
            <Toolbar>
              <Typography variant='h6' color='inherit'>
                Feedback
              </Typography>
              <div className={classes.closeIcon}>
                <CloseIcon onClick={handleClose} />
              </div>
            </Toolbar>
          </AppBar>
          <Typography align='left' variant='subtitle1' color='inherit' className={classes.subtitle}>
            We would appreciate if you can provide any feedback:
          </Typography>
          <TextField
            className={classes.content}
            id='feedback-textfield'
            placeholder='eg. I like the app'
            onChange={this.handleChange}
            autoFocus
            variant='filled'
            type='string'
            required
            margin='dense'
            rows='20'
            rowsMax='50'
            multiline
          />
          <Button
            color='secondary'
            className={classes.button}
            disabled={!this.props.online || this.state.isEmptyMsg}
            variant='contained'
            onClick={this.sendFeedback}
          >
            Send
          </Button>

          <Dialog open={this.state.sending}>
            <DialogContent>
              <DialogContentText id='loading-dialog-text'>
                Sending ;)
              </DialogContentText>
              <CircularProgress
                className={classes.progress}
                color='secondary'
                size={50}
                thickness={6}
              />
            </DialogContent>
          </Dialog>
        </div>
    );
  }
}

export default withStyles(styles)(WriteFeedbackPage);
