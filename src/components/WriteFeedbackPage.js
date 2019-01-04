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
    width: '80%'
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
      email: '',
      open: false,
      sending: false,
      isEmptyMsg: true
    };
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value
    });
  }

  handleFeedbackChange = (event) => {
    this.setState({
      isEmptyMsg: !event.target.value,
      feedback: event.target.value
    });
  }

  openDialog = (message) => {
    this.setState({
      sending: false,
      open: true,
      message
    });
  }

  closeDialog = () => {
    this.setState({ open: false });
  }

  sendFeedback = () => {
    this.setState({ sending: true });
    const { user, location, online } = this.props;

    if (!location.online) {
      this.openDialog(`Could not get the location yet. You won't be able to send the feedback.`);
    } else if (!online) {
      this.openDialog(`Can't connect to our servers. You won't be able to send the feedback.`);
    } else {
      let data = {};
      data.feedback = this.state.feedback;
      data.appVersion = process.env.REACT_APP_VERSION;
      data.buildNumber = process.env.REACT_APP_BUILD_NUMBER;

      if (user) {
        data.email = user.email;
      } else {
        data.email = this.state.email ? this.state.email : 'anonymous';
      }

      if (location) {
        data.latitude = location.latitude;
        data.longitude = location.longitude;
      }

      dbFirebase.writeFeedback(data).then(res => {
        this.setState({ sending: false });
        this.props.handleClose();
      }).catch(err => {
        this.openDialog(err);
      });
    }
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
          <div className={classes.content}>
            <TextField
              fullWidth
              id="filled-email-input"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              margin="normal"
              variant="filled"
              onChange={this.handleEmailChange}
            />
            <TextField
              fullWidth
              id='feedback-textfield'
              placeholder='eg. I like the app'
              onChange={this.handleFeedbackChange}
              autoFocus
              variant='filled'
              type='string'
              required
              margin='dense'
              rows='15'
              rowsMax='30'
              multiline
            />
          </div>
          <Button
            color='secondary'
            className={classes.button}
            disabled={this.state.isEmptyMsg}
            variant='contained'
            onClick={this.sendFeedback}
          >
            Send
          </Button>

          <Dialog
            open={this.state.open}
            onClose={this.closeDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {this.state.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color='secondary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>

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
