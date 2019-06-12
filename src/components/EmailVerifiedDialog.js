import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import authFirebase from '../authFirebase';
import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from '../utils';

const styles = theme => ({
  typography : {
    ...theme.mixins.gutters(),
    whiteSpace: 'pre-wrap',
    paddingRight: 0,
    paddingLeft: 0
  },
  body: {
    marginTop: theme.spacing(3)
  },
  iconButton: {
    marginRight: theme.spacing(2)
  },
  link: {
    cursor: 'pointer',
    color: 'blue'
  },
  button: {
    margin: theme.spacing(1.5),
  },
  notchTop: {
    paddingTop:  isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' :
      isIphoneAndCordova ? theme.spacing(1.5) : null,
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  },
});

class EmailVerifiedDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openProgressCircle: false,
      openConformationDialog: false,
      conformationTitle: '',
      conformationMessage: ''
    };
  }

  handleSignOut = () => {
    authFirebase.signOut();
  };

  handleNextClick = async () => {
    this.setState({ openProgressCircle: true });
    const message = await this.props.handleNextClick();
    this.setState({
      openProgressCircle: false,
      openConformationDialog: true,
      conformationTitle: message.title,
      conformationMessage: message.body
    });
  };

  handleResendEmail = async () => {
    this.setState({ openProgressCircle: true });
    const message = await authFirebase.sendEmailVerification(this.props.user.email)
    this.setState({
      openProgressCircle: false,
      openConformationDialog: true,
      conformationTitle: message.title,
      conformationMessage: message.body
    });
  };

  handleCloseConfirmationDialog = () => {
    this.setState({ openConformationDialog: false});
  };

  render() {
    const { fullScreen, user, open, classes } = this.props;

    return (
      <div>
        <Dialog fullScreen={fullScreen} open={open}>
          <AppBar position='static' className={classes.notchTop}>
            <Toolbar>
              <CloseIcon className={classes.iconButton} onClick={this.handleNextClick} />
              <Typography variant='h6' color='inherit'>Email Verification</Typography>
            </Toolbar>
          </AppBar>
          <DialogContent style={{fontFamily: 'Arial'}}>
            <Typography align={'justify'} variant={'subtitle1'} className={`${classes.body} ${classes.typography}`}>
              A verification email has been sent to <b>{user && user.email}</b>.
              Please click on the link in the email to activate your account. <br/><br/>

              Once you have activated your account, click next to proceed to the app.<br/><br/>

              - If you haven’t received your verification email, check your spam folder or click
              <b className={classes.link} onClick={this.handleResendEmail}> here</b> to resend it.<br/><br/>

              - to carry on without activating your account, click
              <b className={classes.link} onClick={this.handleSignOut}> sign out</b>.
              Some features may not be available until you activate your account.<br/><br/>
            </Typography>
          </DialogContent>
          <DialogActions color='secondary'>
            <Button
              className={classes.button}
              fullWidth
              variant='contained'
              color='secondary'
              onClick={this.handleNextClick}
            >
              Next
            </Button>
          </DialogActions>
          <div className={classes.notchBottom}/>
        </Dialog>

        <Dialog open={this.state.openProgressCircle} PaperProps={{style: {backgroundColor: 'transparent', boxShadow: 'none'}}}>
            <CircularProgress color='secondary'/>
        </Dialog>

        <Dialog open={this.state.openConformationDialog}>
          <DialogTitle id="responsive-dialog-title"  style={{ textAlign: "center"}}>
            {this.state.conformationTitle}
          </DialogTitle>
          <DialogContent style={{fontFamily: 'Arial'}}>
            <Typography align={'justify'} variant={'subtitle1'} className={classes.typography}>
              {this.state.conformationMessage}
            </Typography>
          </DialogContent>
          <DialogActions color='secondary'>
            <Button
              className={classes.button}
              fullWidth
              color='secondary'
              variant='contained'
              onClick={this.handleCloseConfirmationDialog}
            >
              Close
            </Button>
          </DialogActions>
          <div className={classes.notchBottom}/>
        </Dialog>
      </div>
    );
  }
}

EmailVerifiedDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles)(EmailVerifiedDialog));
