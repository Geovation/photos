// let the user write a feedback.

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';
import dbFirebase from '../dbFirebase';
import { device } from '../utils';

import PageWrapper from './PageWrapper';

const styles = theme => ({
  content: {
    height: '100%',
    overflow:'auto',
    '-webkit-overflow-scrolling': 'touch',
    marginTop: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 0.5,
    marginLeft: theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit * 1.5
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 1.5,
  }
});

class WriteFeedbackPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.user ? props.user.email : '',
      emailHelperText: '',
      feedback: '',
      open: false,
      sending: false
    };
  }

  handleEmailChange = (event) => {
    const email = event.target.value;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

    if (email && !email.match(emailRegex)) {
      this.setState({
        email,
        emailHelperText: 'Invalid email format!'
      });
    } else {
      this.setState({
        email,
        emailHelperText: ''
      });
    }
  }

  handleFeedbackChange = (event) => {
    this.setState({
      feedback: event.target.value
    });
  }

  openDialog = (message, isError) => {
    this.setState({
      sending: false,
      open: true,
      message,
      isError
    });
  }

  closeDialog = () => {
    this.setState({ open: false });

    // if it is NOT error...
    if (!this.state.isError) {
      this.props.handleClose();
    }
  }

  sendFeedback = () => {
    this.setState({ sending: true });
    const { location } = this.props;

    let data = {};
    data.feedback = this.state.feedback;
    data.appVersion = process.env.REACT_APP_VERSION;
    data.buildNumber = process.env.REACT_APP_BUILD_NUMBER;
    data.email = this.state.email ? this.state.email : 'anonymous';
    data.device = device();
    data.userAgent = navigator.userAgent;
    if (location) {
      data.latitude = location.latitude;
      data.longitude = location.longitude;
    }

    dbFirebase.writeFeedback(data).then(res => {
      this.setState({ sending: false });
      this.openDialog('Feedback sent, our team will reply as soon as possible!');
    }).catch(err => {
      console.log(err.toString());
      this.openDialog('Something went wrong. Try again later or please email us to ' + config.customiseString('writeFeedback', 'admin@geovation.uk'), true);
    });
  }

  render() {
    const { classes, label } = this.props;

    return (
      <PageWrapper label={label} handleClose={this.props.handleClose}>
          <div className={classes.content}>
            <TextField
              fullWidth
              id="filled-email-input"
              label="Email"
              placeholder='aa@bb.com'
              error={!!this.state.emailHelperText}
              helperText={this.state.emailHelperText}
              type="email"
              name="email"
              autoComplete="email"
              margin="normal"
              variant="filled"
              onChange={this.handleEmailChange}
              value={this.state.email}
            />
            <TextField
              fullWidth
              id='feedback-textfield'
              placeholder='eg. I like the app'
              onChange={this.handleFeedbackChange}
              value={this.state.feedback}
              autoFocus
              variant='filled'
              type='string'
              required
              margin='dense'
              rows={window.innerHeight > 667 ? 23 : window.innerHeight > 640 ? 19 : window.innerHeight > 480 ? 11 : 9}
              rowsMax={window.innerHeight > 667 ? 24 : window.innerHeight > 640 ? 20 : window.innerHeight > 480 ? 12 : 10}
              multiline
            />
          </div>
          <div className={classes.button}>
            <Button
              color='secondary'
              fullWidth
              disabled={!!this.state.emailHelperText || !this.state.feedback || !this.props.online}
              variant='contained'
              onClick={this.sendFeedback}
            >
              Send
            </Button>
          </div>

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
        </PageWrapper>
    );
  }
}

export default withStyles(styles)(WriteFeedbackPage);
