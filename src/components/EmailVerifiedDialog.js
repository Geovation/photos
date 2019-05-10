import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import authFirebase from '../authFirebase';

const styles = theme => ({
  root: {
    background:'rgba(255,225,225,0.5)'
  },
  link: {
    cursor: 'pointer',
    color: 'blue'
  }
});

class EmailVerifiedDialog extends React.Component {

  render() {
    const { fullScreen, user, open, handleNextClick, classes } = this.props;

    return (
        <Dialog
        fullScreen={fullScreen}
          classes={{container: classes.root}}
          open={open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title"  style={{textAlign: "center"}}>Email Verification</DialogTitle>
          <DialogContent>
            <p>
              A verification email has been sent to <b>{user && user.email}</b>.
              Please click on the link in the email to activate your account.
            </p>
            <p>
              Once you have activated your account, click next to proceed to the app.
            </p>
            <p>
              - If you haven’t received your verification email, check your spam folder or click
              <b className={classes.link} onClick={authFirebase.sendEmailVerification}> here</b> to resend it.
            </p>
            <p>
              - to carry on without activating your account, click
              <b className={classes.link} onClick={authFirebase.signOut}> sign out</b>.
              Some features may not be available until you activate your account.
            </p>
          </DialogContent>
          <DialogActions color='secondary'>
            <Button variant='contained' color='secondary' onClick={handleNextClick}>
              Next
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

EmailVerifiedDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles)(EmailVerifiedDialog));
